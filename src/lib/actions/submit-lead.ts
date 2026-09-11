"use server";

import { headers } from "next/headers";
import { escapeHtml } from "@/lib/escape-html";
import { sendLeadEmail } from "@/lib/email";
import { getColorByCode, getProductBySlug } from "@/lib/content/products";
import {
  leadSchema,
  leadServiceFieldsSchema,
  type Lead,
  type LeadServiceFields,
} from "@/lib/leads/schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendLeadToTelegram } from "@/lib/telegram";

export interface SubmitLeadResult {
  ok: boolean;
  error?: string;
}

/** Заполнение формы быстрее этого порога считается ботом. */
const MIN_SUBMIT_MS = 3000;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headerList.get("x-real-ip") ?? "unknown";
}

const LEAD_TYPE_EMAIL_SUBJECTS: Record<Lead["type"], string> = {
  retail: "Заявка — розница",
  wholesale: "Заявка — опт",
  training: "Заявка — обучение",
};

function buildProductSummary(lead: Lead): string | undefined {
  if (lead.type !== "retail" || !lead.productSlug) return undefined;

  const product = getProductBySlug(lead.productSlug);
  if (!product) return undefined;

  const variant = lead.variantId
    ? product.variants.find((v) => v.id === lead.variantId)
    : undefined;
  const colorName = variant ? (getColorByCode(variant.color)?.name.ru ?? variant.color) : undefined;

  return [
    product.title.ru,
    variant ? `${variant.length} см` : undefined,
    colorName,
    variant ? `SKU ${variant.sku}` : undefined,
  ]
    .filter(Boolean)
    .join(", ");
}

function buildEmailHtml(lead: Lead, service: LeadServiceFields, productSummary: string | undefined): string {
  const rows: Array<[string, string | undefined]> = [
    ["Имя", lead.name],
    ["Контакт", lead.contact],
    ["Канал связи", lead.channel],
  ];

  if (lead.type === "retail") {
    rows.push(["Товар", productSummary]);
  }
  if (lead.type === "wholesale") {
    rows.push(
      ["Салон", lead.salonName],
      ["Город", lead.city],
      ["Опыт работы", lead.experience],
      ["Ориентировочный объём", lead.estimatedVolume],
    );
  }
  if (lead.type === "training") {
    rows.push(
      ["Формат", lead.format],
      ["Опыт", lead.experience],
      ["Предпочтительные даты", lead.preferredDates],
    );
  }

  rows.push(
    ["Комментарий", lead.comment],
    ["Страница-источник", service.sourcePath],
    ["Локаль", service.locale],
  );

  const rowsHtml = rows
    .filter(([, value]) => Boolean(value))
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;"><b>${escapeHtml(label)}</b></td><td style="padding:4px 0;">${escapeHtml(
          String(value),
        )}</td></tr>`,
    )
    .join("");

  return `<table cellspacing="0" cellpadding="0">${rowsHtml}</table>`;
}

/**
 * Принимает уже собранный payload (лид + служебные поля) единой формой,
 * валидирует по той же схеме, что и клиент, и отправляет уведомления.
 * Не бросает исключений наружу — всегда возвращает { ok, error? }.
 */
export async function submitLead(raw: unknown): Promise<SubmitLeadResult> {
  const parsedLead = leadSchema.safeParse(raw);
  if (!parsedLead.success) {
    return { ok: false, error: "Проверьте, пожалуйста, правильность заполнения формы." };
  }

  const parsedService = leadServiceFieldsSchema.safeParse(raw);
  if (!parsedService.success) {
    return { ok: false, error: "Не удалось обработать заявку. Попробуйте ещё раз." };
  }

  const lead = parsedLead.data;
  const service = parsedService.data;

  // Антиспам: ловушка заполнена, или форма отправлена подозрительно быстро —
  // тихо «успех», чтобы не подсказывать боту, что его поймали.
  if (service.honeypot) {
    return { ok: true };
  }
  if (Date.now() - service.startedAt < MIN_SUBMIT_MS) {
    return { ok: true };
  }

  const ip = await getClientIp();
  const rate = checkRateLimit(`lead:${ip}`, { windowMs: RATE_LIMIT_WINDOW_MS, max: RATE_LIMIT_MAX });
  if (!rate.allowed) {
    return { ok: false, error: "Слишком много заявок подряд. Попробуйте через минуту." };
  }

  const productSummary = buildProductSummary(lead);

  const [telegramResult, emailResult] = await Promise.all([
    sendLeadToTelegram({ lead, service, productSummary }),
    sendLeadEmail(
      `Da Vinchi Hair — ${LEAD_TYPE_EMAIL_SUBJECTS[lead.type]}`,
      buildEmailHtml(lead, service, productSummary),
    ),
  ]);

  const emailActuallySent = emailResult.ok && !emailResult.skipped;

  if (!telegramResult.ok && !emailActuallySent) {
    if (process.env.NODE_ENV === "production") {
      console.error("submitLead: оба канала доставки не сработали", {
        type: lead.type,
        telegramError: telegramResult.error,
        emailError: emailResult.error,
      });
    } else {
      console.error("submitLead: оба канала доставки не сработали", {
        lead,
        telegramError: telegramResult.error,
        emailError: emailResult.error,
      });
    }
    return {
      ok: false,
      error: "Не удалось отправить заявку. Напишите нам напрямую в Telegram.",
    };
  }

  return { ok: true };
}
