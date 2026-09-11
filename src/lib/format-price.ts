/**
 * cents — целое число евроцентов (см. lib/content/types). Форматирование только
 * на выводе. Формат «€ 199,90» — символ перед суммой — задан явно в брифе,
 * поэтому вместо style:"currency" (даёт «199,90 €» в ru-RU) собираем сумму
 * через Intl.NumberFormat и добавляем символ вручную.
 */
export function formatPrice(cents: number, locale = "ru-RU"): string {
  const amount = new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
  return `€ ${amount}`;
}
