/**
 * Артикул-заглушка: у демо-товаров он начинается с DEMO-, у материалов без
 * данных от клиента — с TODO_CLIENT. Такой артикул не показываем на сайте;
 * настоящий появится сам, как только его внесут в content/.
 */
export function isPlaceholderSku(sku: string): boolean {
  return sku.startsWith("DEMO-") || sku.startsWith("TODO_CLIENT");
}
