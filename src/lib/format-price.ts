import type { Locale } from "@/i18n/routing";

const INTL_LOCALE_TAG: Record<Locale, string> = {
  ru: "ru-RU",
  en: "en-US",
  ka: "ka-GE",
};

/**
 * cents — целое число евроцентов (см. lib/content/types). Форматирование только
 * на выводе, всегда через Intl.NumberFormat с currency: "EUR" — валюта одна на
 * всех локалях, конвертера нет.
 */
export function formatPrice(cents: number, locale: Locale = "ru"): string {
  return new Intl.NumberFormat(INTL_LOCALE_TAG[locale], {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
