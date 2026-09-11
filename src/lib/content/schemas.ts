import { z } from "zod";
import type { I18nString } from "./types";

export const i18nStringSchema = z.object({
  ru: z.string(),
  en: z.string(),
  ka: z.string(),
}) satisfies z.ZodType<I18nString>;

export const hairColorGroupSchema = z.enum([
  "blonde",
  "brown",
  "dark",
  "red",
  "ombre",
  "grey",
]);

export const hairColorSchema = z.object({
  code: z.string().min(1),
  name: i18nStringSchema,
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "hex должен быть в формате #RRGGBB"),
  group: hairColorGroupSchema,
  swatchImage: z.string().min(1).optional(),
});

const hairLengthSchema = z.union([
  z.literal(40),
  z.literal(50),
  z.literal(60),
  z.literal(70),
]);

export const productVariantSchema = z.object({
  id: z.string().min(1),
  length: hairLengthSchema,
  weight: z.number().int().nonnegative(),
  tapesCount: z.number().int().nonnegative(),
  color: z.string().min(1),
  price: z.number().int().nonnegative(),
  oldPrice: z.number().int().nonnegative().optional(),
  inStock: z.boolean(),
  sku: z.string().min(1),
});

export const productCategorySchema = z.enum([
  "tape-classic",
  "tape-imitation-1",
  "tape-imitation-2",
  "accessories",
  "care",
]);

const hairStructureSchema = z.enum(["straight", "wavy", "curly"]);
const tapeWidthSchema = z.union([z.literal(3), z.literal(4)]);
const productBadgeSchema = z.enum(["new", "bestseller", "sale", "limited"]);

const productImageSchema = z.object({
  src: z.string().min(1),
  alt: i18nStringSchema,
});

const productSeoSchema = z.object({
  title: i18nStringSchema,
  description: i18nStringSchema,
});

export const productSchema = z.object({
  slug: z.string().min(1),
  category: productCategorySchema,
  title: i18nStringSchema,
  shortDescription: i18nStringSchema,
  description: i18nStringSchema,
  hairOrigin: i18nStringSchema.optional(),
  hairStructure: hairStructureSchema.optional(),
  tapeWidth: tapeWidthSchema.optional(),
  variants: z.array(productVariantSchema).min(1),
  images: z.array(productImageSchema).min(1),
  badges: z.array(productBadgeSchema).optional(),
  relatedSlugs: z.array(z.string()).optional(),
  seo: productSeoSchema,
});
