import type { Locale } from "@/i18n/routing";
import type { Currency } from "@/lib/content/types";

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

/**
 * Сумма в центах в указанной валюте, без копеек, если сумма целая («230 $»).
 * Для расчётов вне каталога (content/economy.json), где валюту задаёт сам расчёт.
 */
export function formatMoney(
  cents: number,
  currency: Currency,
  locale: Locale = "ru",
): string {
  const fractionDigits = cents % 100 === 0 ? 0 : 2;
  return new Intl.NumberFormat(INTL_LOCALE_TAG[locale], {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(cents / 100);
}
