/** cents — целое число евроцентов (см. lib/content/types). Форматирование только на выводе. */
export function formatPrice(cents: number, locale = "ru-RU"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
