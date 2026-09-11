"use client";

import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { buildCatalogHref, type EditableFilters } from "@/lib/catalog/search-params";
import { ru } from "@/i18n/messages";
import type { ProductSort } from "@/lib/content/types";

export interface SortSelectProps {
  pathname: string;
  filters: EditableFilters;
}

const SORT_LABELS: Record<ProductSort, string> = {
  popularity: ru.catalog.sort.popularity,
  "price-asc": ru.catalog.sort.priceAsc,
  "price-desc": ru.catalog.sort.priceDesc,
  newest: ru.catalog.sort.newest,
};

export function SortSelect({ pathname, filters }: SortSelectProps) {
  const router = useRouter();

  return (
    <Select
      aria-label={ru.catalog.sort.label}
      value={filters.sort ?? "popularity"}
      wrapperClassName="w-full sm:w-56"
      onChange={(event) => {
        const sort = event.target.value as ProductSort;
        router.push(buildCatalogHref(pathname, { ...filters, sort }), { scroll: false });
      }}
    >
      {(Object.keys(SORT_LABELS) as ProductSort[]).map((sort) => (
        <option key={sort} value={sort}>
          {SORT_LABELS[sort]}
        </option>
      ))}
    </Select>
  );
}
