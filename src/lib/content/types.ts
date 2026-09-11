export type Locale = "ru" | "en" | "ka";

export type I18nString = Record<Locale, string>;

export type ProductCategory =
  | "tape-classic"
  | "tape-imitation-1"
  | "tape-imitation-2"
  | "accessories"
  | "care";

export type HairColorGroup =
  | "blonde"
  | "brown"
  | "dark"
  | "red"
  | "ombre"
  | "grey";

export interface HairColor {
  /** '6.0', '8.13', 'ombre-4-10' */
  code: string;
  name: I18nString;
  hex: string;
  group: HairColorGroup;
  /** фото пряди — приоритетнее hex при отрисовке свотча */
  swatchImage?: string;
}

export type HairLength = 40 | 50 | 60 | 70;

export interface ProductVariant {
  id: string;
  length: HairLength;
  /** грамм */
  weight: number;
  tapesCount: number;
  color: HairColor["code"];
  /** целое число евроцентов. 19990 = € 199,90. Форматирование только на выводе. */
  price: number;
  oldPrice?: number;
  inStock: boolean;
  sku: string;
}

export type HairStructure = "straight" | "wavy" | "curly";

export type TapeWidth = 3 | 4;

export type ProductBadge = "new" | "bestseller" | "sale" | "limited";

export interface ProductImage {
  src: string;
  alt: I18nString;
}

export interface ProductSeo {
  title: I18nString;
  description: I18nString;
}

export interface Product {
  slug: string;
  category: ProductCategory;
  title: I18nString;
  shortDescription: I18nString;
  /** MDX */
  description: I18nString;
  /** славянские / европейские / южнорусские */
  hairOrigin?: I18nString;
  hairStructure?: HairStructure;
  tapeWidth?: TapeWidth;
  variants: ProductVariant[];
  images: ProductImage[];
  badges?: ProductBadge[];
  relatedSlugs?: string[];
  seo: ProductSeo;
}

export type ProductSort = "price-asc" | "price-desc";

export interface ProductFilters {
  category?: ProductCategory;
  lengths?: HairLength[];
  colorCodes?: string[];
  colorGroups?: HairColorGroup[];
  tapeWidth?: TapeWidth;
  inStockOnly?: boolean;
  priceMin?: number;
  priceMax?: number;
  sort?: ProductSort;
}

export interface PriceRange {
  min: number;
  max: number;
}
