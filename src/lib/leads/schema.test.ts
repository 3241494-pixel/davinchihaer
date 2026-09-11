import { describe, expect, it } from "vitest";
import { leadSchema, leadServiceFieldsSchema } from "./schema";

function baseRetail(overrides: Record<string, unknown> = {}) {
  return {
    type: "retail",
    name: "Анна",
    contact: "+995555123456",
    channel: "phone",
    consent: true,
    ...overrides,
  };
}

describe("leadSchema", () => {
  it("accepts a valid retail lead", () => {
    const result = leadSchema.safeParse(baseRetail({ productSlug: "tape-classic-slavic" }));
    expect(result.success).toBe(true);
  });

  it("rejects when consent is not true", () => {
    const result = leadSchema.safeParse(baseRetail({ consent: false }));
    expect(result.success).toBe(false);
  });

  it("rejects a too-short name", () => {
    const result = leadSchema.safeParse(baseRetail({ name: "A" }));
    expect(result.success).toBe(false);
  });

  it("accepts a Telegram username only for channel=telegram", () => {
    const withTelegram = leadSchema.safeParse(
      baseRetail({ channel: "telegram", contact: "@anna_hair" }),
    );
    expect(withTelegram.success).toBe(true);

    const withWhatsapp = leadSchema.safeParse(
      baseRetail({ channel: "whatsapp", contact: "@anna_hair" }),
    );
    expect(withWhatsapp.success).toBe(false);
  });

  it("rejects a phone without a country code", () => {
    const result = leadSchema.safeParse(baseRetail({ contact: "555123456" }));
    expect(result.success).toBe(false);
  });

  it("requires wholesale-specific fields", () => {
    const missingCity = leadSchema.safeParse({
      type: "wholesale",
      name: "Мастер",
      contact: "+995555123456",
      channel: "phone",
      consent: true,
      experience: "5 лет",
    });
    expect(missingCity.success).toBe(false);

    const complete = leadSchema.safeParse({
      type: "wholesale",
      name: "Мастер",
      contact: "+995555123456",
      channel: "phone",
      consent: true,
      city: "Тбилиси",
      experience: "5 лет",
    });
    expect(complete.success).toBe(true);
  });

  it("requires training format and experience", () => {
    const result = leadSchema.safeParse({
      type: "training",
      name: "Мастер",
      contact: "+995555123456",
      channel: "phone",
      consent: true,
      format: "online",
      experience: "Новичок",
    });
    expect(result.success).toBe(true);
  });

  it("does not fail validation when honeypot is filled (checked separately server-side)", () => {
    const result = leadSchema.safeParse(baseRetail());
    const service = leadServiceFieldsSchema.safeParse({
      sourcePath: "/product/tape-classic-slavic",
      locale: "ru",
      honeypot: "i-am-a-bot",
      startedAt: Date.now(),
    });
    expect(result.success).toBe(true);
    expect(service.success).toBe(true);
  });
});

describe("leadServiceFieldsSchema", () => {
  it("defaults honeypot to an empty string", () => {
    const result = leadServiceFieldsSchema.parse({
      sourcePath: "/",
      locale: "ru",
      startedAt: Date.now(),
    });
    expect(result.honeypot).toBe("");
  });
});
