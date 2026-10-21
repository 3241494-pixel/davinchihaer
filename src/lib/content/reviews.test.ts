import { describe, expect, it } from "vitest";
import { getReviews, parseReviews } from "./reviews";

describe("reviews (content/reviews.json)", () => {
  it("loads the client's reviews without placeholders", () => {
    const reviews = getReviews();
    expect(reviews.length).toBeGreaterThan(0);
    for (const review of reviews) {
      for (const text of Object.values(review.text)) {
        expect(text.trim()).not.toBe("");
        expect(text).not.toMatch(/TODO_CLIENT/);
      }
    }
  });

  it("rejects duplicate ids", () => {
    const text = { ru: "x", en: "x", ka: "x" };
    const raw = {
      reviews: [
        { id: "a", text },
        { id: "a", text },
      ],
    };
    expect(() => parseReviews(raw)).toThrow(/повторяется id/);
  });
});
