import type { ContentSource } from "./source/content-source";
import { fileContentSource } from "./source/file-source";
import { productSchema, hairColorSchema } from "./schemas";
import type {
  HairColor,
  PriceRange,
  Product,
  ProductCategory,
  ProductFilters,
} from "./types";

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
    const colors = getColors();
    const colorGroupByCode = new Map(
      colors.map((color) => [color.code, color.group] as const),
    );

    const priceMin = filters.priceMin ?? -Infinity;
    const priceMax = filters.priceMax ?? Infinity;

    let result = getAllProducts().filter((product) => {
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      if (filters.tapeWidth && product.tapeWidth !== filters.tapeWidth) {
        return false;
      }

      if (
        filters.inStockOnly &&
        !product.variants.some((variant) => variant.inStock)
      ) {
        return false;
      }

      if (
        filters.lengths?.length &&
        !product.variants.some((variant) =>
          filters.lengths!.includes(variant.length),
        )
      ) {
        return false;
      }

      if (
        filters.colorCodes?.length &&
        !product.variants.some((variant) =>
          filters.colorCodes!.includes(variant.color),
        )
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

      if (
        (filters.priceMin !== undefined || filters.priceMax !== undefined) &&
        !product.variants.some(
          (variant) => variant.price >= priceMin && variant.price <= priceMax,
        )
      ) {
        return false;
      }

      return true;
    });

    if (filters.sort) {
      const withRange = result.map((product) => ({
        product,
        range: getPriceRange(product),
      }));
      withRange.sort((a, b) =>
        filters.sort === "price-asc"
          ? a.range.min - b.range.min
          : b.range.min - a.range.min,
      );
      result = withRange.map(({ product }) => product);
    }

    return result;
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

export function getPriceRange(product: Product): PriceRange {
  const prices = product.variants.map((variant) => variant.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
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
