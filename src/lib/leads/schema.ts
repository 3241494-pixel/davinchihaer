import { z } from "zod";

/**
 * Схема заявок. Используется и на клиенте (react-hook-form resolver), и на
 * сервере (server action) — одна и та же логика валидации в обоих местах.
 *
 * Разделена на два слоя:
 * - leadSchema (discriminated union по type) — то, что реально вводит
 *   пользователь в форме;
 * - leadServiceFieldsSchema — служебные поля (антиспам, трекинг), которые
 *   добавляет обёртка формы/сервер-экшен, а не сам пользователь.
 */

export const leadTypeSchema = z.enum(["retail", "wholesale", "training"]);
export type LeadType = z.infer<typeof leadTypeSchema>;

export const leadChannelSchema = z.enum(["telegram", "whatsapp", "phone"]);
export type LeadChannel = z.infer<typeof leadChannelSchema>;

export const trainingFormatSchema = z.enum(["online", "offline"]);
export type TrainingFormat = z.infer<typeof trainingFormatSchema>;

/** Достаточно permissive E.164: + и 8-15 цифр, без строгой валидации по стране. */
const E164_REGEX = /^\+[1-9]\d{7,14}$/;
const TELEGRAM_USERNAME_REGEX = /^@[a-zA-Z0-9_]{5,32}$/;

function normalizePhoneCandidate(value: string): string {
  return value.replace(/[\s()-]/g, "");
}

export function isValidPhone(value: string): boolean {
  return E164_REGEX.test(normalizePhoneCandidate(value));
}

export function isValidTelegramHandle(value: string): boolean {
  return TELEGRAM_USERNAME_REGEX.test(value.trim());
}

const coreLeadFields = {
  name: z
    .string()
    .trim()
    .min(2, "Введите имя")
    .max(120, "Слишком длинное имя"),
  contact: z
    .string()
    .trim()
    .min(3, "Введите телефон или @username")
    .max(64, "Слишком длинное значение"),
  channel: leadChannelSchema,
  comment: z.string().trim().max(2000, "Слишком длинный комментарий").optional(),
  consent: z.literal(true, "Нужно согласие на обработку персональных данных"),
};

export const retailLeadSchema = z.object({
  type: z.literal("retail"),
  ...coreLeadFields,
  productSlug: z.string().max(200).optional(),
  variantId: z.string().max(200).optional(),
});

export const wholesaleLeadSchema = z.object({
  type: z.literal("wholesale"),
  ...coreLeadFields,
  salonName: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2, "Укажите город").max(120),
  experience: z.string().trim().min(1, "Укажите опыт работы").max(500),
  estimatedVolume: z.string().trim().max(300).optional(),
});

export const trainingLeadSchema = z.object({
  type: z.literal("training"),
  ...coreLeadFields,
  format: trainingFormatSchema,
  experience: z.string().trim().min(1, "Укажите опыт").max(500),
  preferredDates: z.string().trim().max(300).optional(),
});

function refineContactMatchesChannel(
  data: { channel: LeadChannel; contact: string },
  ctx: z.RefinementCtx,
) {
  const phoneOk = isValidPhone(data.contact);
  if (data.channel === "telegram") {
    if (!phoneOk && !isValidTelegramHandle(data.contact)) {
      ctx.addIssue({
        code: "custom",
        path: ["contact"],
        message: "Введите номер в международном формате (+995...) или @username",
      });
    }
    return;
  }
  if (!phoneOk) {
    ctx.addIssue({
      code: "custom",
      path: ["contact"],
      message: "Введите номер телефона в международном формате, например +995555123456",
    });
  }
}

export const leadSchema = z
  .discriminatedUnion("type", [retailLeadSchema, wholesaleLeadSchema, trainingLeadSchema])
  .superRefine(refineContactMatchesChannel);

export type RetailLead = z.infer<typeof retailLeadSchema>;
export type WholesaleLead = z.infer<typeof wholesaleLeadSchema>;
export type TrainingLead = z.infer<typeof trainingLeadSchema>;
export type Lead = z.infer<typeof leadSchema>;

/**
 * Служебные поля, которые пользователь не заполняет: их добавляет обёртка
 * формы (sourcePath/locale/startedAt/utm сразу при монтировании) и honeypot
 * (скрытое поле-ловушка для ботов). Отдельная схема — чтобы не путать их с
 * пользовательским вводом при рендере полей формы.
 */
export const leadServiceFieldsSchema = z.object({
  sourcePath: z.string().max(300),
  locale: z.enum(["ru", "en", "ka"]),
  utm: z.record(z.string(), z.string()).optional(),
  honeypot: z.string().max(200).optional().default(""),
  startedAt: z.number(),
});

export type LeadServiceFields = z.infer<typeof leadServiceFieldsSchema>;

/** Полный payload, отправляемый в server action. */
export type LeadSubmission = Lead & LeadServiceFields;
