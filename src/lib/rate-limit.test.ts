import { describe, expect, it } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  it("allows requests under the limit and blocks once exceeded", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit(key, { windowMs: 60_000, max: 3 }).allowed).toBe(true);
    }
    const blocked = checkRateLimit(key, { windowMs: 60_000, max: 3 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("tracks separate keys independently", () => {
    const a = `test-a-${Math.random()}`;
    const b = `test-b-${Math.random()}`;
    checkRateLimit(a, { max: 1 });
    expect(checkRateLimit(a, { max: 1 }).allowed).toBe(false);
    expect(checkRateLimit(b, { max: 1 }).allowed).toBe(true);
  });
});
