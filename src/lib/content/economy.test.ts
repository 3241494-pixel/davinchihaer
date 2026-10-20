import { describe, expect, it } from "vitest";
import { costTotals, getCostComparison } from "./economy";

function totalsById() {
  const { options } = getCostComparison();
  return Object.fromEntries(
    options.flatMap((option) =>
      costTotals(option).map(({ variantId, total }) => [
        variantId ? `${option.id}/${variantId}` : option.id,
        total,
      ]),
    ),
  );
}

describe("cost comparison (content/economy.json)", () => {
  it("matches the client's yearly totals", () => {
    expect(totalsById()).toEqual({
      "tape/master": 58000,
      "tape/home": 40000,
      capsule: 123000,
    });
  });

  it("keeps the on-site claim true: tapes cost at most half of capsules", () => {
    const totals = totalsById();
    expect(totals.capsule).toBeGreaterThanOrEqual(2 * totals["tape/master"]);
    expect(totals.capsule).toBeGreaterThanOrEqual(2 * totals["tape/home"]);
  });
});
