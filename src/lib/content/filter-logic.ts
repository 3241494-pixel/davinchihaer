import type {
  HairColor,
  PriceRange,
  Product,
  ProductFilters,
} from "./types";

/**
 * Чистая логика фильтрации/сортировки без обращения к источнику данных —
 * можно безопасно импортировать и в клиентские компоненты (например, для
 * live-счётчика в мобильной панели фильтров), не затягивая fs/path.
 */

export function getPriceRange(product: Product): PriceRange {
  const prices = product.variants.map((variant) => variant.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

function matchesFilters(
  product: Product,
  filters: ProductFilters,
  colorGroupByCode: Map<string, HairColor["group"]>,
): boolean {
  if (filters.category && product.category !== filters.category) {
    return false;
  }

  if (filters.tapeWidth && product.tapeWidth !== filters.tapeWidth) {
    return false;
  }

  if (filters.inStockOnly && !product.variants.some((variant) => variant.inStock)) {
    return false;
  }

  if (
    filters.lengths?.length &&
    !product.variants.some((variant) => filters.lengths!.includes(variant.length))
  ) {
    return false;
  }

  if (
    filters.colorCodes?.length &&
    !product.variants.some((variant) => filters.colorCodes!.includes(variant.color))
  ) {
    return false;
  }

  if (
    filters.colorGroups?.length &&
    !product.variants.some((variant) => {
      const group = colorGroupByCode.get(variant.color);
      return group !== undefined && filters.colorGroups!.includes(group);
    })
  ) {
    return false;
  }

  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    const priceMin = filters.priceMin ?? -Infinity;
    const priceMax = filters.priceMax ?? Infinity;
    if (!product.variants.some((variant) => variant.price >= priceMin && variant.price <= priceMax)) {
      return false;
    }
  }

  return true;
}

function sortProducts(products: Product[], sort: ProductFilters["sort"]): Product[] {
  switch (sort) {
    case "price-asc":
      return [...products].sort((a, b) => getPriceRange(a).min - getPriceRange(b).min);
    case "price-desc":
      return [...products].sort((a, b) => getPriceRange(b).min - getPriceRange(a).min);
    case "newest":
      return stablePartitionByBadge(products, "new");
    case "popularity":
    default:
      return stablePartitionByBadge(products, "bestseller");
  }
}

/** Помечённые бейджем товары — вперёд, порядок внутри групп не меняется. */
function stablePartitionByBadge(
  products: Product[],
  badge: NonNullable<Product["badges"]>[number],
): Product[] {
  const tagged: Product[] = [];
  const rest: Product[] = [];
  for (const product of products) {
    if (product.badges?.includes(badge)) tagged.push(product);
    else rest.push(product);
  }
  return [...tagged, ...rest];
}

export function filterProducts(
  products: Product[],
  colors: HairColor[],
  filters: ProductFilters = {},
): Product[] {
  const colorGroupByCode = new Map(colors.map((color) => [color.code, color.group] as const));
  const matched = products.filter((product) => matchesFilters(product, filters, colorGroupByCode));
  return sortProducts(matched, filters.sort);
}
