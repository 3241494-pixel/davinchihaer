"use client";

import { useRouter } from "@/i18n/navigation";
import { Select } from "@/components/ui/Select";
import { buildCatalogHref, DEFAULT_SORT, type EditableFilters } from "@/lib/catalog/search-params";
import { useTypedMessages } from "@/i18n/use-messages";
import type { ProductSort } from "@/lib/content/types";

export interface SortSelectProps {
  pathname: string;
  filters: EditableFilters;
}

export function SortSelect({ pathname, filters }: SortSelectProps) {
  const ru = useTypedMessages();
  const router = useRouter();

  const SORT_LABELS: Record<ProductSort, string> = {
    "price-asc": ru.catalog.sort.priceAsc,
    "price-desc": ru.catalog.sort.priceDesc,
    popularity: ru.catalog.sort.popularity,
  };

  return (
    <Select
      aria-label={ru.catalog.sort.label}
      value={filters.sort ?? DEFAULT_SORT}
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
