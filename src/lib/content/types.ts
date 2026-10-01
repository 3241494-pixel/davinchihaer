export type Locale = "ru" | "en" | "ka";

export type I18nString = Record<Locale, string>;

/** Способ крепления — характеристика волос и фильтр, а не раздел каталога. */
export type AttachmentType =
  | "tape-classic"
  | "imitation-1"
  | "imitation-2"
  | "bio-tape"
  | "ring-star";

/** В интерфейсе: Славянка · Индия · Вьетнам · Китай. */
export type HairOrigin = "slavic" | "india" | "vietnam" | "china";

export type HairStructure = "porous" | "straight" | "wavy" | "curly";

export type MaterialType = "tape" | "primer" | "remover";

export type CatalogSection = "hair" | "materials";

export type HairColorGroup = "dark" | "brown" | "blonde" | "ash" | "ombre";

export interface HairColor {
  /** '1.0', '7.0', '12.0' */
  code: string;
  name: I18nString;
  hex: string;
  group: HairColorGroup;
  /** фото пряди — приоритетнее hex при отрисовке свотча */
  swatchImage?: string;
}

export type HairLength = 40 | 50 | 60 | 70;

export interface HairVariant {
  id: string;
  length: HairLength;
  /** густота комплекта, грамм */
  weightGrams: number;
  tapesCount?: number;
  color: HairColor["code"];
  /**
   * Целое число евроцентов. 19990 = € 199,90. Форматирование только на выводе.
   * Нет поля — «Цена по запросу».
   */
  price?: number;
  oldPrice?: number;
  inStock: boolean;
  sku: string;
}

export interface MaterialVariant {
  id: string;
  /** Целое число евроцентов; нет поля — «Цена по запросу». */
  price?: number;
  inStock: boolean;
  sku: string;
}

export type ProductBadge = "new" | "bestseller";

export interface ProductImage {
  src: string;
  alt: I18nString;
}

export interface ProductSeo {
  title: I18nString;
  description: I18nString;
}

interface ProductBase {
  slug: string;
  title: I18nString;
  shortDescription: I18nString;
  /** Абзацы разделены пустой строкой. */
  description: I18nString;
  images: ProductImage[];
  badges?: ProductBadge[];
  /** Демо-данные: характеристики и цены не от клиента (TODO_CLIENT). */
  isPlaceholder?: boolean;
  seo: ProductSeo;
}

export interface HairProduct extends ProductBase {
  kind: "hair";
  attachment: AttachmentType;
  structure: HairStructure;
  origin: HairOrigin;
  variants: HairVariant[];
}

export interface MaterialSpec {
  lengthM?: number;
  widthCm?: number;
  volumeMl?: number;
}

export interface MaterialProduct extends ProductBase {
  kind: "material";
  materialType: MaterialType;
  /** Пустой массив — подходит ко всем креплениям. */
  compatibleWith: AttachmentType[];
  spec: MaterialSpec;
  variants: MaterialVariant[];
}

export type Product = HairProduct | MaterialProduct;

export type ProductSort = "price-asc" | "price-desc" | "popularity";

export interface WeightRange {
  min: number;
  max: number;
}

export interface HairFilters {
  attachment?: AttachmentType[];
  origin?: HairOrigin[];
  structure?: HairStructure[];
  lengths?: HairLength[];
  weightMin?: number;
  weightMax?: number;
  colorCodes?: string[];
  colorGroups?: HairColorGroup[];
  inStockOnly?: boolean;
  priceMin?: number;
  priceMax?: number;
  sort?: ProductSort;
}

export interface PriceRange {
  min: number;
  max: number;
}
