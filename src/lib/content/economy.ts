import { costComparisonSchema } from "./schemas";
import type { ContentSource } from "./source/content-source";
import { fileContentSource } from "./source/file-source";
import type { CostComparison, CostItem, CostOption } from "./types";

/** Годовая сумма строки в центах. */
export function yearlyCost(item: CostItem): number {
  return item.price * item.timesPerYear;
}

export interface CostTotal {
  /** id способа обслуживания или null, если у варианта он один. */
  variantId: string | null;
  total: number;
}

/** Итоги за год по каждому способу обслуживания варианта. */
export function costTotals(option: CostOption): CostTotal[] {
  const base = option.items.reduce((sum, item) => sum + yearlyCost(item), 0);
  if (option.variants.length === 0) return [{ variantId: null, total: base }];
  return option.variants.map((variant) => ({
    variantId: variant.id,
    total: variant.items.reduce((sum, item) => sum + yearlyCost(item), base),
  }));
}

export function parseCostComparison(raw: unknown): CostComparison {
  const result = costComparisonSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `content/economy.json: невалидный расчёт: ${result.error.message}`,
    );
  }
  const { currency, options } = result.data;
  return { currency, options };
}

export function createCostComparisonApi(source: ContentSource) {
  let cache: CostComparison | null = null;
  return function getCostComparison(): CostComparison {
    cache ??= parseCostComparison(source.getCostComparisonRaw());
    return cache;
  };
}

export const getCostComparison = createCostComparisonApi(fileContentSource);
