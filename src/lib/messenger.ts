import { siteConfig } from "@/config/site";
import type { Locale } from "@/lib/content/types";

export interface MessengerMessageOptions {
  productTitle?: string;
  length?: number;
  colorName?: string;
  locale?: Locale;
}

/**
 * ka временно использует тот же текст, что и ru — реальный перевод должен
 * сделать носитель языка (см. CLAUDE.md, раздел «Рынок»), но так как это
 * реальное сообщение, уходящее в чат клиенту, placeholder вида TODO_CLIENT
 * здесь недопустим — используем корректный русский текст как временную меру.
 */
const TEMPLATES: Record<Locale, { withProduct: string; generic: string }> = {
  ru: {
    withProduct: "Здравствуйте! Интересует «{title}»{length}{color}.",
    generic: "Здравствуйте! У меня вопрос по сайту Da Vinchi Hair.",
  },
  en: {
    withProduct: "Hello! I'm interested in “{title}”{length}{color}.",
    generic: "Hello! I have a question about the Da Vinchi Hair website.",
  },
  ka: {
    withProduct: "Здравствуйте! Интересует «{title}»{length}{color}.",
    generic: "Здравствуйте! У меня вопрос по сайту Da Vinchi Hair.",
  },
};

export function buildMessengerText(options: MessengerMessageOptions = {}): string {
  const locale = options.locale ?? "ru";
  const template = TEMPLATES[locale];

  if (!options.productTitle) {
    return template.generic;
  }

  const isRu = locale === "ru" || locale === "ka";
  const lengthPart = options.length
    ? isRu
      ? `, длина ${options.length} см`
      : `, length ${options.length} cm`
    : "";
  const colorPart = options.colorName
    ? isRu
      ? `, оттенок ${options.colorName}`
      : `, colour ${options.colorName}`
    : "";

  return template.withProduct
    .replace("{title}", options.productTitle)
    .replace("{length}", lengthPart)
    .replace("{color}", colorPart);
}

export function buildTelegramLink(options: MessengerMessageOptions = {}): string {
  const text = buildMessengerText(options);
  return `${siteConfig.telegramBotUrl}?text=${encodeURIComponent(text)}`;
}

/** null — WhatsApp не настроен (siteConfig.whatsappNumber отсутствует). */
export function buildWhatsAppLink(options: MessengerMessageOptions = {}): string | null {
  if (!siteConfig.whatsappNumber) return null;
  const digits = siteConfig.whatsappNumber.replace(/\D/g, "");
  const text = buildMessengerText(options);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
