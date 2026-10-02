import type {
  AttachmentType,
  HairColor,
  HairFilters,
  HairProduct,
  MaterialProduct,
  PriceRange,
  Product,
  WeightRange,
} from "./types";

/**
 * Чистая логика фильтрации/сортировки без обращения к источнику данных —
 * можно безопасно импортировать и в клиентские компоненты (живой счётчик в
 * мобильной панели фильтров), не затягивая fs/path.
 */

/** null — ни у одного варианта нет цены («Цена по запросу»). */
export function getPriceRange(product: Product): PriceRange | null {
  const prices = product.variants
    .map((variant) => variant.price)
    .filter((price): price is number => price !== undefined);
  if (prices.length === 0) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function getProductWeightRange(products: HairProduct[]): WeightRange | null {
  const weights = products.flatMap((product) => product.variants.map((v) => v.weightGrams));
  if (weights.length === 0) return null;
  return { min: Math.min(...weights), max: Math.max(...weights) };
}

function includesOrEmpty<T>(list: T[] | undefined, value: T): boolean {
  return !list?.length || list.includes(value);
}

function matchesHair(
  product: HairProduct,
  filters: HairFilters,
  colorGroupByCode: Map<string, HairColor["group"]>,
): boolean {
  if (!includesOrEmpty(filters.attachment, product.attachment)) return false;
  if (!includesOrEmpty(filters.origin, product.origin)) return false;
  if (!includesOrEmpty(filters.structure, product.structure)) return false;

  // Вариантные условия должны выполняться на ОДНОМ варианте: «60 см и в наличии»
  // не должно совпадать с товаром, где 60 см нет в наличии, а в наличии только 40.
  const priceMin = filters.priceMin;
  const priceMax = filters.priceMax;
  const hasPriceFilter = priceMin !== undefined || priceMax !== undefined;

  return product.variants.some((variant) => {
    if (filters.lengths?.length && !filters.lengths.includes(variant.length)) return false;
    if (filters.weightMin !== undefined && variant.weightGrams < filters.weightMin) return false;
    if (filters.weightMax !== undefined && variant.weightGrams > filters.weightMax) return false;
    if (filters.colorCodes?.length && !filters.colorCodes.includes(variant.color)) return false;
    if (filters.colorGroups?.length) {
      const group = colorGroupByCode.get(variant.color);
      if (group === undefined || !filters.colorGroups.includes(group)) return false;
    }
    if (filters.inStockOnly && !variant.inStock) return false;
    if (hasPriceFilter) {
      if (variant.price === undefined) return false;
      if (priceMin !== undefined && variant.price < priceMin) return false;
      if (priceMax !== undefined && variant.price > priceMax) return false;
    }
    return true;
  });
}

/** Товары без цены всегда в конце, в любом направлении сортировки. */
function comparePrice(a: Product, b: Product, direction: 1 | -1): number {
  const pa = getPriceRange(a);
  const pb = getPriceRange(b);
  if (!pa && !pb) return 0;
  if (!pa) return 1;
  if (!pb) return -1;
  return (pa.min - pb.min) * direction;
}

export function sortProducts<T extends Product>(products: T[], sort: HairFilters["sort"]): T[] {
  switch (sort) {
    case "price-desc":
      return [...products].sort((a, b) => comparePrice(a, b, -1));
    case "popularity": {
      const tagged = products.filter((p) => p.badges?.includes("bestseller"));
      const rest = products.filter((p) => !p.badges?.includes("bestseller"));
      return [...tagged, ...rest];
    }
    case "price-asc":
    default:
      return [...products].sort((a, b) => comparePrice(a, b, 1));
  }
}

export function filterHair(
  products: HairProduct[],
  colors: HairColor[],
  filters: HairFilters = {},
): HairProduct[] {
  const colorGroupByCode = new Map(colors.map((color) => [color.code, color.group] as const));
  const matched = products.filter((product) => matchesHair(product, filters, colorGroupByCode));
  return sortProducts(matched, filters.sort);
}

/**
 * «Что нужно для работы»: материалы, совместимые с креплением, плюс
 * универсальные (пустой compatibleWith).
 */
export function materialsFor(
  materials: MaterialProduct[],
  attachment: AttachmentType,
): MaterialProduct[] {
  return materials.filter(
    (material) =>
      material.compatibleWith.length === 0 || material.compatibleWith.includes(attachment),
  );
}

/** Обратная связь для карточки материала: волосы, к которым он подходит. */
export function hairFor(hair: HairProduct[], material: MaterialProduct): HairProduct[] {
  if (material.compatibleWith.length === 0) return hair;
  return hair.filter((product) => material.compatibleWith.includes(product.attachment));
}
