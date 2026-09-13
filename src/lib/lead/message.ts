import type { Lead, LeadServiceFields, LeadType } from "@/lib/leads/schema";

/**
 * Собранное на клиенте описание товара/варианта (retail) — каталог читает
 * файлы (fs) и недоступен в браузере, поэтому текст готовит сама форма
 * (см. RetailLeadForm) из уже известных пропсов, а не lookup по slug.
 */
export interface LeadMessageExtras {
  productSummary?: string;
}

export type LeadPayload = Lead & LeadServiceFields & LeadMessageExtras;

const LEAD_TYPE_TITLES: Record<LeadType, string> = {
  retail: "РОЗНИЦА",
  wholesale: "ОПТ",
  training: "ОБУЧЕНИЕ",
};

const CHANNEL_LABELS: Record<Lead["channel"], string> = {
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  phone: "Звонок",
};

const TRAINING_FORMAT_LABELS: Record<"online" | "offline", string> = {
  online: "Онлайн",
  offline: "Тбилиси (очно)",
};

function line(label: string, value: string | undefined): string {
  if (!value) return "";
  return `${label}: ${value}\n`;
}

/**
 * Текст заявки одинаковый независимо от локали интерфейса — уходит
 * оператору на русском.
 */
export function buildLeadMessageText(payload: LeadPayload): string {
  let body = `${LEAD_TYPE_TITLES[payload.type]}\n\n`;

  body += line("Имя", payload.name);
  body += line("Контакт", payload.contact);
  body += line("Канал связи", CHANNEL_LABELS[payload.channel]);

  if (payload.type === "retail") {
    body += line("Товар", payload.productSummary);
  }

  if (payload.type === "wholesale") {
    body += line("Салон", payload.salonName);
    body += line("Город", payload.city);
    body += line("Опыт работы", payload.experience);
    body += line("Ориентировочный объём", payload.estimatedVolume);
  }

  if (payload.type === "training") {
    body += line("Формат", TRAINING_FORMAT_LABELS[payload.format]);
    body += line("Опыт", payload.experience);
    body += line("Предпочтительные даты", payload.preferredDates);
  }

  body += line("Комментарий", payload.comment);

  body += `\nСтраница: ${payload.sourcePath}\n`;
  body += `Локаль: ${payload.locale}\n`;
  if (payload.utm && Object.keys(payload.utm).length > 0) {
    const utmText = Object.entries(payload.utm)
      .map(([key, value]) => `${key}=${value}`)
      .join(", ");
    body += `UTM: ${utmText}\n`;
  }

  return body.trimEnd();
}
