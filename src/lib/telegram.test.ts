import { afterEach, describe, expect, it } from "vitest";
import { escapeTelegramHtml, formatLeadMessage } from "./telegram";
import type { Lead, LeadServiceFields } from "@/lib/leads/schema";

describe("escapeTelegramHtml", () => {
  it("escapes HTML special characters", () => {
    expect(escapeTelegramHtml('<script>alert("x")</script> & co')).toBe(
      "&lt;script&gt;alert(\"x\")&lt;/script&gt; &amp; co",
    );
  });
});

const service: LeadServiceFields = {
  sourcePath: "/product/tape-classic-slavic",
  locale: "ru",
  honeypot: "",
  startedAt: Date.now(),
};

describe("formatLeadMessage", () => {
  it("includes core fields and escapes user input", () => {
    const lead: Lead = {
      type: "retail",
      name: "<b>Anna</b>",
      contact: "+995555123456",
      channel: "phone",
      consent: true,
    };

    const text = formatLeadMessage({ lead, service, productSummary: "Товар X, 60 см" });

    expect(text).toContain("&lt;b&gt;Anna&lt;/b&gt;");
    expect(text).toContain("Товар X, 60 см");
    expect(text).toContain(service.sourcePath);
    expect(text).not.toContain("<script>");
  });

  it("includes wholesale-specific fields", () => {
    const lead: Lead = {
      type: "wholesale",
      name: "Мастер",
      contact: "+995555123456",
      channel: "phone",
      consent: true,
      city: "Тбилиси",
      experience: "5 лет",
    };

    const text = formatLeadMessage({ lead, service });
    expect(text).toContain("Тбилиси");
    expect(text).toContain("5 лет");
  });

  it("includes training-specific fields", () => {
    const lead: Lead = {
      type: "training",
      name: "Мастер",
      contact: "+995555123456",
      channel: "telegram",
      consent: true,
      format: "offline",
      experience: "Новичок",
    };

    const text = formatLeadMessage({ lead, service });
    expect(text).toContain("Тбилиси (очно)");
    expect(text).toContain("Новичок");
  });
});

describe("sendTelegramMessage — topic routing", () => {
  const originalFetch = global.fetch;
  const originalEnv = { ...process.env };

  afterEach(() => {
    global.fetch = originalFetch;
    process.env = { ...originalEnv };
  });

  function mockFetchOk() {
    const calls: Array<{ url: string; body: Record<string, unknown> }> = [];
    global.fetch = ((url: string, init: RequestInit) => {
      calls.push({ url, body: JSON.parse(String(init.body)) });
      return Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    }) as typeof fetch;
    return calls;
  }

  it("routes retail/wholesale/training to their own message_thread_id", async () => {
    const calls = mockFetchOk();
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_CHAT_ID = "-100123456";
    process.env.TELEGRAM_TOPIC_RETAIL = "10";
    process.env.TELEGRAM_TOPIC_WHOLESALE = "20";
    process.env.TELEGRAM_TOPIC_TRAINING = "30";

    const { sendTelegramMessage } = await import("./telegram");

    await sendTelegramMessage("retail text", "retail");
    await sendTelegramMessage("wholesale text", "wholesale");
    await sendTelegramMessage("training text", "training");

    expect(calls).toHaveLength(3);
    expect(calls[0].body.message_thread_id).toBe(10);
    expect(calls[1].body.message_thread_id).toBe(20);
    expect(calls[2].body.message_thread_id).toBe(30);
    expect(calls.every((c) => c.body.chat_id === "-100123456")).toBe(true);
  });

  it("falls back to the general chat when a topic id is not configured", async () => {
    const calls = mockFetchOk();
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_CHAT_ID = "-100123456";
    delete process.env.TELEGRAM_TOPIC_RETAIL;

    const { sendTelegramMessage } = await import("./telegram");
    const result = await sendTelegramMessage("retail text", "retail");

    expect(result.ok).toBe(true);
    expect(calls[0].body.message_thread_id).toBeUndefined();
  });

  it("does not throw and reports a clear error when bot token is missing", async () => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;

    const { sendTelegramMessage } = await import("./telegram");
    const result = await sendTelegramMessage("text", "retail");

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/TELEGRAM_BOT_TOKEN/);
  });
});
