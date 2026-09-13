import { siteConfig } from "@/config/site";
import { buildLeadMessageText, type LeadPayload } from "./message";

export interface SendLeadResult {
  kind: "link";
  url: string;
}

export interface LeadTransport {
  sendLead(payload: LeadPayload): SendLeadResult;
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Единственное место в коде, которое знает, КУДА уходит заявка. Сайт —
 * статический экспорт без сервера, поэтому «отправка» — это готовая ссылка
 * в мессенджер с текстом заявки; форма её просто открывает (см.
 * use-lead-form.ts). Когда появится бэкенд, здесь заменится на fetch —
 * формы и их валидация не изменятся.
 */
export const messengerTransport: LeadTransport = {
  sendLead(payload) {
    const text = buildLeadMessageText(payload);
    const encodedText = encodeURIComponent(text);

    if (payload.channel === "whatsapp" && siteConfig.whatsappNumber) {
      const digits = digitsOnly(siteConfig.whatsappNumber);
      return { kind: "link", url: `https://wa.me/${digits}?text=${encodedText}` };
    }

    // telegram и phone (звонок ещё не настроен как отдельный канал) уходят в Telegram.
    return { kind: "link", url: `${siteConfig.telegramBotUrl}?text=${encodedText}` };
  },
};
