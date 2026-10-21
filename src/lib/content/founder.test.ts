import { describe, expect, it } from "vitest";
import { getFounder, parseFounder } from "./founder";
import type { I18nString } from "./types";

function strings(founder: ReturnType<typeof getFounder>): I18nString[] {
  return [
    founder.name,
    founder.role,
    founder.intro,
    founder.quote,
    ...founder.timeline.map((item) => item.text),
  ];
}

describe("founder (content/founder.json)", () => {
  it("has the founder's story in every locale without placeholders", () => {
    const founder = getFounder();
    expect(founder.timeline.length).toBeGreaterThan(0);
    for (const value of strings(founder)) {
      for (const text of Object.values(value)) {
        expect(text.trim()).not.toBe("");
        expect(text).not.toMatch(/TODO_CLIENT/);
      }
    }
  });

  it("rejects a timeline out of order", () => {
    const text = { ru: "x", en: "x", ka: "x" };
    const raw = {
      name: text,
      role: text,
      intro: text,
      quote: text,
      timeline: [
        { year: 2018, text },
        { year: 2012, text },
      ],
    };
    expect(() => parseFounder(raw)).toThrow(/не по порядку/);
  });
});
