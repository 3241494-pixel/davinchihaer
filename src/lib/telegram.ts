import { escapeHtml } from "@/lib/escape-html";
import type { Lead, LeadServiceFields, LeadType } from "@/lib/leads/schema";

export { escapeHtml as escapeTelegramHtml };

export interface TelegramSendResult {
  ok: boolean;
  error?: string;
}

const CHANNEL_LABELS: Record<Lead["channel"], string> = {
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  phone: "Звонок",
};

const TRAINING_FORMAT_LABELS: Record<"online" | "offline", string> = {
  online: "Онлайн",
  offline: "Тбилиси (очно)",
};

const LEAD_TYPE_TITLES: Record<LeadType, string> = {
  retail: "Новая заявка — розница",
  wholesale: "Новая заявка — опт",
  training: "Новая заявка — обучение",
};

function formatTbilisiTime(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Tbilisi",
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
}

function line(label: string, value: string | undefined): string {
  if (!value) return "";
  return `<b>${escapeHtml(label)}:</b> ${escapeHtml(value)}\n`;
}

export interface LeadNotificationPayload {
  lead: Lead;
  service: LeadServiceFields;
  /** Заранее собранное человекочитаемое описание товара/варианта (retail). */
  productSummary?: string;
}

/**
 * Формирует HTML-сообщение для темы супергруппы. Все пользовательские
 * значения экранированы через escapeTelegramHtml.
 */
export function formatLeadMessage({ lead, service, productSummary }: LeadNotificationPayload): string {
  let body = `<b>${escapeHtml(LEAD_TYPE_TITLES[lead.type])}</b>\n\n`;

  body += line("Имя", lead.name);
  body += line("Контакт", lead.contact);
  body += line("Канал связи", CHANNEL_LABELS[lead.channel]);

  if (lead.type === "retail") {
    body += line("Товар", productSummary);
  }

  if (lead.type === "wholesale") {
    body += line("Салон", lead.salonName);
    body += line("Город", lead.city);
    body += line("Опыт работы", lead.experience);
    body += line("Ориентировочный объём", lead.estimatedVolume);
  }

  if (lead.type === "training") {
    body += line("Формат", TRAINING_FORMAT_LABELS[lead.format]);
    body += line("Опыт", lead.experience);
    body += line("Предпочтительные даты", lead.preferredDates);
  }

  body += line("Комментарий", lead.comment);

  body += "\n<i>";
  body += `Страница: ${escapeHtml(service.sourcePath)}\n`;
  body += `Локаль: ${escapeHtml(service.locale)}\n`;
  if (service.utm && Object.keys(service.utm).length > 0) {
    const utmText = Object.entries(service.utm)
      .map(([key, value]) => `${key}=${value}`)
      .join(", ");
    body += `UTM: ${escapeHtml(utmText)}\n`;
  }
  body += `Время (Тбилиси): ${escapeHtml(formatTbilisiTime(new Date()))}`;
  body += "</i>";

  return body;
}

function getTopicEnvByType(leadType: LeadType): string | undefined {
  switch (leadType) {
    case "retail":
      return process.env.TELEGRAM_TOPIC_RETAIL;
    case "wholesale":
      return process.env.TELEGRAM_TOPIC_WHOLESALE;
    case "training":
      return process.env.TELEGRAM_TOPIC_TRAINING;
  }
}

/** Низкоуровневая отправка через Bot API. Тема — по типу заявки, если задана. */
export async function sendTelegramMessage(text: string, leadType: LeadType): Promise<TelegramSendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { ok: false, error: "TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы" };
  }

  const threadIdRaw = getTopicEnvByType(leadType);
  const messageThreadId = threadIdRaw ? Number(threadIdRaw) : undefined;

  const payload: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };
  if (messageThreadId !== undefined && Number.isFinite(messageThreadId)) {
    payload.message_thread_id = messageThreadId;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return { ok: false, error: `Telegram API ${response.status}: ${body.slice(0, 300)}` };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Неизвестная ошибка сети" };
  }
}

/** Собирает сообщение и отправляет его в тему, соответствующую типу заявки. */
export async function sendLeadToTelegram(payload: LeadNotificationPayload): Promise<TelegramSendResult> {
  const text = formatLeadMessage(payload);
  return sendTelegramMessage(text, payload.lead.type);
}
