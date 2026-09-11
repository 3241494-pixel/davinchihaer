import type { ContentSource } from "./source/content-source";
import { fileContentSource } from "./source/file-source";
import { productSchema, hairColorSchema } from "./schemas";
import { filterProducts as filterProductsPure } from "./filter-logic";
import type {
  HairColor,
  Product,
  ProductCategory,
  ProductFilters,
} from "./types";

export { getPriceRange } from "./filter-logic";

export const PRODUCT_CATEGORIES: readonly ProductCategory[] = [
  "tape-classic",
  "tape-imitation-1",
  "tape-imitation-2",
  "accessories",
  "care",
];

function parseProducts(raw: unknown[]): Product[] {
  return raw.map((entry, index) => {
    const result = productSchema.safeParse(entry);
    if (!result.success) {
      const slug =
        typeof entry === "object" && entry !== null && "slug" in entry
          ? String((entry as { slug: unknown }).slug)
          : `#${index}`;
      throw new Error(
        `content/products: невалидные данные товара "${slug}": ${result.error.message}`,
      );
    }
    return result.data;
  });
}

function parseColors(raw: unknown[]): HairColor[] {
  return raw.map((entry, index) => {
    const result = hairColorSchema.safeParse(entry);
    if (!result.success) {
      throw new Error(
        `content/colors.json: невалидный оттенок #${index}: ${result.error.message}`,
      );
    }
    return result.data;
  });
}

/**
 * Собирает публичное API контент-слоя поверх конкретного ContentSource.
 * Продакшен использует singleton ниже; тесты передают свой ContentSource
 * с контролируемыми фикстурами, не трогая файловую систему.
 */
export function createContentApi(source: ContentSource) {
  let productsCache: Product[] | null = null;
  let colorsCache: HairColor[] | null = null;

  function getAllProducts(): Product[] {
    if (!productsCache) {
      productsCache = parseProducts(source.getProductsRaw());
    }
    return productsCache;
  }

  function getColors(): HairColor[] {
    if (!colorsCache) {
      colorsCache = parseColors(source.getColorsRaw());
    }
    return colorsCache;
  }

  function getProductBySlug(slug: string): Product | undefined {
    return getAllProducts().find((product) => product.slug === slug);
  }

  function getProductsByCategory(category: ProductCategory): Product[] {
    return getAllProducts().filter((product) => product.category === category);
  }

  function getColorByCode(code: string): HairColor | undefined {
    return getColors().find((color) => color.code === code);
  }

  function getCategories(): ProductCategory[] {
    return [...PRODUCT_CATEGORIES];
  }

  function filterProducts(filters: ProductFilters = {}): Product[] {
    return filterProductsPure(getAllProducts(), getColors(), filters);
  }

  return {
    getAllProducts,
    getProductBySlug,
    getProductsByCategory,
    getColors,
    getColorByCode,
    getCategories,
    filterProducts,
  };
}

const defaultApi = createContentApi(fileContentSource);

export const getAllProducts = defaultApi.getAllProducts;
export const getProductBySlug = defaultApi.getProductBySlug;
export const getProductsByCategory = defaultApi.getProductsByCategory;
export const getColors = defaultApi.getColors;
export const getColorByCode = defaultApi.getColorByCode;
export const getCategories = defaultApi.getCategories;
export const filterProducts = defaultApi.filterProducts;
