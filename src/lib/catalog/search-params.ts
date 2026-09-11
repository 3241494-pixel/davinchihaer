import type {
  HairColorGroup,
  HairLength,
  ProductCategory,
  ProductFilters,
  ProductSort,
  TapeWidth,
} from "@/lib/content/types";

export type RawSearchParams = Record<string, string | string[] | undefined>;

export const LENGTHS: readonly HairLength[] = [40, 50, 60, 70];
export const COLOR_GROUPS: readonly HairColorGroup[] = [
  "blonde",
  "brown",
  "dark",
  "red",
  "ombre",
  "grey",
];
export const TAPE_WIDTHS: readonly TapeWidth[] = [3, 4];
export const SORTS: readonly ProductSort[] = ["popularity", "price-asc", "price-desc", "newest"];

export const DEFAULT_LIMIT = 12;
export const LOAD_MORE_STEP = 12;

/** Фильтры, которыми управляет клиентская панель — категория задаётся маршрутом, не query. */
export type EditableFilters = Omit<ProductFilters, "category">;

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

export interface ParsedCatalogParams {
  filters: ProductFilters;
  limit: number;
}

export function parseCatalogSearchParams(
  raw: RawSearchParams,
  options: { lockedCategory?: ProductCategory } = {},
): ParsedCatalogParams {
  const lengths = parseCsvNumbers(first(raw.length), LENGTHS);

  const tapeWidthRaw = first(raw.tapeWidth);
  const tapeWidthNum = tapeWidthRaw ? Number(tapeWidthRaw) : undefined;
  const tapeWidth = TAPE_WIDTHS.includes(tapeWidthNum as TapeWidth)
    ? (tapeWidthNum as TapeWidth)
    : undefined;

  const colorGroups = parseCsvStrings(first(raw.colorGroup), COLOR_GROUPS);
  const colorCodes = parseCsvStrings(first(raw.color));

  const inStockOnly = first(raw.inStock) === "1" ? true : undefined;

  const priceMin = toCents(first(raw.priceMin));
  const priceMax = toCents(first(raw.priceMax));

  const sortRaw = first(raw.sort);
  const sort: ProductSort = SORTS.includes(sortRaw as ProductSort)
    ? (sortRaw as ProductSort)
    : "popularity";

  const limitRaw = first(raw.limit);
  const parsedLimit = limitRaw ? Number(limitRaw) : DEFAULT_LIMIT;
  const limit =
    Number.isFinite(parsedLimit) && parsedLimit > 0
      ? Math.min(Math.floor(parsedLimit), 1000)
      : DEFAULT_LIMIT;

  return {
    filters: {
      category: options.lockedCategory,
      lengths,
      colorCodes,
      colorGroups,
      tapeWidth,
      inStockOnly,
      priceMin,
      priceMax,
      sort,
    },
    limit,
  };
}

function toCents(value: string | undefined): number | undefined {
  if (value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : undefined;
}

/** Строит querystring для набора фильтров без category (см. EditableFilters). */
export function buildCatalogHref(
  pathname: string,
  filters: EditableFilters,
  extra: { limit?: number } = {},
): string {
  const params = new URLSearchParams();
  if (filters.lengths?.length) params.set("length", filters.lengths.join(","));
  if (filters.colorCodes?.length) params.set("color", filters.colorCodes.join(","));
  if (filters.colorGroups?.length) params.set("colorGroup", filters.colorGroups.join(","));
  if (filters.tapeWidth) params.set("tapeWidth", String(filters.tapeWidth));
  if (filters.inStockOnly) params.set("inStock", "1");
  if (filters.priceMin !== undefined) params.set("priceMin", String(filters.priceMin / 100));
  if (filters.priceMax !== undefined) params.set("priceMax", String(filters.priceMax / 100));
  if (filters.sort && filters.sort !== "popularity") params.set("sort", filters.sort);
  if (extra.limit && extra.limit !== DEFAULT_LIMIT) params.set("limit", String(extra.limit));

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function emptyEditableFilters(): EditableFilters {
  return {};
}
