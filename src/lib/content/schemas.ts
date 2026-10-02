import { z } from "zod";
import { ATTACHMENTS, COLOR_GROUPS, MATERIAL_TYPES, ORIGINS, STRUCTURES } from "./enums";
import type { I18nString } from "./types";

export { ATTACHMENTS, COLOR_GROUPS, MATERIAL_TYPES, ORIGINS, STRUCTURES };

export const i18nStringSchema = z.object({
  ru: z.string(),
  en: z.string(),
  ka: z.string(),
}) satisfies z.ZodType<I18nString>;

export const hairColorSchema = z.strictObject({
  code: z.string().min(1),
  name: i18nStringSchema,
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "hex должен быть в формате #RRGGBB"),
  group: z.enum(COLOR_GROUPS),
  swatchImage: z.string().min(1).optional(),
});

const hairLengthSchema = z.union([z.literal(40), z.literal(50), z.literal(60), z.literal(70)]);
const centsSchema = z.number().int().nonnegative();

const productImageSchema = z.object({
  src: z.string().min(1),
  alt: i18nStringSchema,
});

const productSeoSchema = z.object({
  title: i18nStringSchema,
  description: i18nStringSchema,
});

/**
 * Общие поля. Объекты строгие (strictObject): поле материала в файле волос
 * (или наоборот) роняет сборку, а не молча игнорируется.
 */
const productBaseShape = {
  /** Служебные заметки для редактора контента, на сайт не выводятся. */
  _todoClient: z.array(z.string()).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug: только a-z, 0-9 и дефис"),
  title: i18nStringSchema,
  shortDescription: i18nStringSchema,
  description: i18nStringSchema,
  images: z.array(productImageSchema).min(1),
  badges: z.array(z.enum(["new", "bestseller"])).optional(),
  isPlaceholder: z.boolean().optional(),
  seo: productSeoSchema,
};

export const hairVariantSchema = z.strictObject({
  id: z.string().min(1),
  length: hairLengthSchema,
  weightGrams: z.number().int().positive(),
  tapesCount: z.number().int().positive().optional(),
  color: z.string().min(1),
  price: centsSchema.optional(),
  oldPrice: centsSchema.optional(),
  inStock: z.boolean(),
  sku: z.string().min(1),
});

export const materialVariantSchema = z.strictObject({
  id: z.string().min(1),
  price: centsSchema.optional(),
  inStock: z.boolean(),
  sku: z.string().min(1),
});

export const hairProductSchema = z.strictObject({
  ...productBaseShape,
  kind: z.literal("hair"),
  attachment: z.enum(ATTACHMENTS),
  structure: z.enum(STRUCTURES),
  origin: z.enum(ORIGINS),
  variants: z.array(hairVariantSchema).min(1),
});

export const materialProductSchema = z.strictObject({
  ...productBaseShape,
  kind: z.literal("material"),
  materialType: z.enum(MATERIAL_TYPES),
  compatibleWith: z.array(z.enum(ATTACHMENTS)),
  spec: z.strictObject({
    lengthM: z.number().positive().optional(),
    widthCm: z.number().positive().optional(),
    volumeMl: z.number().positive().optional(),
  }),
  variants: z.array(materialVariantSchema).min(1),
});

export const productSchema = z.discriminatedUnion("kind", [
  hairProductSchema,
  materialProductSchema,
]);
