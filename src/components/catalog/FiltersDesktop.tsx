"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FilterControls } from "./FilterControls";
import { buildCatalogHref, type EditableFilters } from "@/lib/catalog/search-params";
import { ru } from "@/i18n/messages";
import type { HairColor } from "@/lib/content/types";

export interface FiltersDesktopProps {
  pathname: string;
  filters: EditableFilters;
  colors: HairColor[];
}

export function FiltersDesktop({ pathname, filters, colors }: FiltersDesktopProps) {
  const router = useRouter();

  function handleChange(next: EditableFilters) {
    router.push(buildCatalogHref(pathname, next), { scroll: false });
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 lg:flex">
      <h2 className="font-heading text-xl text-ink-strong">{ru.catalog.filters.title}</h2>
      <FilterControls value={filters} onChange={handleChange} colors={colors} idPrefix="desktop" />
      <Link
        href={pathname}
        className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline"
      >
        {ru.catalog.filters.reset}
      </Link>
    </aside>
  );
}
