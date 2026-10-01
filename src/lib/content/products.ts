import type { ContentSource } from "./source/content-source";
import { fileContentSource } from "./source/file-source";
import { ATTACHMENTS } from "./enums";
import { hairColorSchema, productSchema } from "./schemas";
import {
  filterHair as filterHairPure,
  getProductWeightRange,
  hairFor,
  materialsFor,
} from "./filter-logic";
import type {
  AttachmentType,
  HairColor,
  HairFilters,
  HairLength,
  HairProduct,
  MaterialProduct,
  Product,
  WeightRange,
} from "./types";

export { getPriceRange } from "./filter-logic";

function parseProducts(raw: unknown[]): Product[] {
  const products = raw.map((entry, index) => {
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
    return result.data as Product;
  });

  const seen = new Set<string>();
  for (const product of products) {
    if (seen.has(product.slug)) {
      throw new Error(`content/products: повторяется slug "${product.slug}"`);
    }
    seen.add(product.slug);
  }
  return products;
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

  function getHairProducts(): HairProduct[] {
    return getAllProducts().filter((p): p is HairProduct => p.kind === "hair");
  }

  function getMaterials(): MaterialProduct[] {
    return getAllProducts().filter((p): p is MaterialProduct => p.kind === "material");
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

  function getColorByCode(code: string): HairColor | undefined {
    return getColors().find((color) => color.code === code);
  }

  function filterHair(filters: HairFilters = {}): HairProduct[] {
    return filterHairPure(getHairProducts(), getColors(), filters);
  }

  function getMaterialsFor(attachment: AttachmentType): MaterialProduct[] {
    return materialsFor(getMaterials(), attachment);
  }

  function getHairFor(material: MaterialProduct): HairProduct[] {
    return hairFor(getHairProducts(), material);
  }

  function getWeightRange(): WeightRange | null {
    return getProductWeightRange(getHairProducts());
  }

  function getLengths(): HairLength[] {
    const lengths = new Set(getHairProducts().flatMap((p) => p.variants.map((v) => v.length)));
    return Array.from(lengths).sort((a, b) => a - b);
  }

  /** Крепления в каноническом порядке, включая те, по которым товаров пока нет. */
  function getAttachments(): AttachmentType[] {
    return [...ATTACHMENTS];
  }

  return {
    getAllProducts,
    getHairProducts,
    getMaterials,
    getProductBySlug,
    getColors,
    getColorByCode,
    filterHair,
    getMaterialsFor,
    getHairFor,
    getWeightRange,
    getLengths,
    getAttachments,
  };
}

const defaultApi = createContentApi(fileContentSource);

export const getAllProducts = defaultApi.getAllProducts;
export const getHairProducts = defaultApi.getHairProducts;
export const getMaterials = defaultApi.getMaterials;
export const getProductBySlug = defaultApi.getProductBySlug;
export const getColors = defaultApi.getColors;
export const getColorByCode = defaultApi.getColorByCode;
export const filterHair = defaultApi.filterHair;
export const getMaterialsFor = defaultApi.getMaterialsFor;
export const getHairFor = defaultApi.getHairFor;
export const getWeightRange = defaultApi.getWeightRange;
export const getLengths = defaultApi.getLengths;
export const getAttachments = defaultApi.getAttachments;
