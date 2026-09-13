import { existsSync } from "fs";
import path from "path";
import type { Product } from "./content/types";

/** Только для серверных компонентов — проверяет наличие файла в /public. */
export function publicImageExists(src: string): boolean {
  if (!src.startsWith("/")) return false;
  return existsSync(path.join(process.cwd(), "public", src));
}

/**
 * Только для серверных компонентов. Карточки товаров рендерятся клиентским
 * ProductCard (см. каталог с client-side фильтрацией) и не могут сами читать
 * fs — поэтому наличие первой картинки считается один раз на сервере и
 * прокидывается вниз как обычные данные.
 */
export function buildImageExistsMap(products: Product[]): Map<string, boolean> {
  const map = new Map<string, boolean>();
  for (const product of products) {
    const first = product.images[0];
    map.set(product.slug, first ? publicImageExists(first.src) : false);
  }
  return map;
}
