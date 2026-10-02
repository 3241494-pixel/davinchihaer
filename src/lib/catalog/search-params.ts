import { ATTACHMENTS, COLOR_GROUPS, ORIGINS, STRUCTURES } from "@/lib/content/enums";
import type { HairFilters, HairLength, ProductSort } from "@/lib/content/types";

export { ATTACHMENTS, COLOR_GROUPS, ORIGINS, STRUCTURES };

export type RawSearchParams = Record<string, string | string[] | undefined>;

export const LENGTHS: readonly HairLength[] = [40, 50, 60, 70];
export const SORTS: readonly ProductSort[] = ["price-asc", "price-desc", "popularity"];
/** По возрастанию цены: иначе первым человек видит самые дорогие позиции. */
export const DEFAULT_SORT: ProductSort = "price-asc";

export const DEFAULT_LIMIT = 12;
export const LOAD_MORE_STEP = 12;

/** Фильтры волос в URL: /catalog/hair?attachment=imitation-2&origin=slavic&weight=50-100 */
export type EditableFilters = HairFilters;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseCsvNumbers<T extends number>(
  value: string | undefined,
  allowed: readonly T[],
): T[] | undefined {
  if (!value) return undefined;
  const parsed = Array.from(
    new Set(
      value
        .split(",")
        .map((item) => Number(item))
        .filter((num): num is T => allowed.includes(num as T)),
    ),
  );
  return parsed.length ? parsed : undefined;
}

function parseCsvStrings<T extends string>(
  value: string | undefined,
  allowed?: readonly T[],
): T[] | undefined {
  if (!value) return undefined;
  const items = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean) as T[];
  const filtered = allowed ? items.filter((item) => allowed.includes(item)) : items;
  const unique = Array.from(new Set(filtered));
  return unique.length ? unique : undefined;
}

function toInt(value: string | undefined): number | undefined {
  if (value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : undefined;
}

function toCents(value: string | undefined): number | undefined {
  if (value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed * 100) : undefined;
}

/** "50-100", "50-", "-100" */
function parseRange(value: string | undefined): [number | undefined, number | undefined] {
  if (!value) return [undefined, undefined];
  const [min, max] = value.split("-");
  return [toInt(min), toInt(max)];
}

export interface ParsedCatalogParams {
  filters: HairFilters;
  limit: number;
}

export function parseCatalogSearchParams(raw: RawSearchParams): ParsedCatalogParams {
  const [weightMin, weightMax] = parseRange(first(raw.weight));

  const sortRaw = first(raw.sort);
  const sort: ProductSort = SORTS.includes(sortRaw as ProductSort)
    ? (sortRaw as ProductSort)
    : DEFAULT_SORT;

  const limitRaw = first(raw.limit);
  const parsedLimit = limitRaw ? Number(limitRaw) : DEFAULT_LIMIT;
  const limit =
    Number.isFinite(parsedLimit) && parsedLimit > 0
      ? Math.min(Math.floor(parsedLimit), 1000)
      : DEFAULT_LIMIT;

  return {
    filters: {
      attachment: parseCsvStrings(first(raw.attachment), ATTACHMENTS),
      origin: parseCsvStrings(first(raw.origin), ORIGINS),
      structure: parseCsvStrings(first(raw.structure), STRUCTURES),
      lengths: parseCsvNumbers(first(raw.length), LENGTHS),
      weightMin,
      weightMax,
      colorCodes: parseCsvStrings(first(raw.color)),
      colorGroups: parseCsvStrings(first(raw.colorGroup), COLOR_GROUPS),
      inStockOnly: first(raw.inStock) === "1" ? true : undefined,
      priceMin: toCents(first(raw.priceMin)),
      priceMax: toCents(first(raw.priceMax)),
      sort,
    },
    limit,
  };
}

export function buildCatalogHref(
  pathname: string,
  filters: EditableFilters,
  extra: { limit?: number } = {},
): string {
  const params = new URLSearchParams();
  if (filters.attachment?.length) params.set("attachment", filters.attachment.join(","));
  if (filters.origin?.length) params.set("origin", filters.origin.join(","));
  if (filters.structure?.length) params.set("structure", filters.structure.join(","));
  if (filters.lengths?.length) params.set("length", filters.lengths.join(","));
  if (filters.weightMin !== undefined || filters.weightMax !== undefined) {
    params.set("weight", `${filters.weightMin ?? ""}-${filters.weightMax ?? ""}`);
  }
  if (filters.colorCodes?.length) params.set("color", filters.colorCodes.join(","));
  if (filters.colorGroups?.length) params.set("colorGroup", filters.colorGroups.join(","));
  if (filters.inStockOnly) params.set("inStock", "1");
  if (filters.priceMin !== undefined) params.set("priceMin", String(filters.priceMin / 100));
  if (filters.priceMax !== undefined) params.set("priceMax", String(filters.priceMax / 100));
  if (filters.sort && filters.sort !== DEFAULT_SORT) params.set("sort", filters.sort);
  if (extra.limit && extra.limit !== DEFAULT_LIMIT) params.set("limit", String(extra.limit));

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function emptyEditableFilters(): EditableFilters {
  return {};
}
