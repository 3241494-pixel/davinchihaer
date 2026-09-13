import type { Lead, LeadType } from "@/lib/leads/schema";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/**
 * lead_intent = пользователь нажал кнопку отправки формы, а не «заявка
 * получена» — сайт статический, сервера, подтверждающего доставку, нет.
 * Раньше событие называлось submit_lead и вводило в заблуждение по этой же
 * причине (см. бриф, этап миграции на static export).
 */
export function trackLeadIntent(type: LeadType, messenger: Lead["channel"]): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: "lead_intent",
    lead_type: type,
    messenger,
  });
}
