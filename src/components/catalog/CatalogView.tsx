"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { filterHair } from "@/lib/content/filter-logic";
import {
  LOAD_MORE_STEP,
  parseCatalogSearchParams,
  type EditableFilters,
} from "@/lib/catalog/search-params";
import { formatMessage } from "@/lib/format-message";
import { useTypedMessages } from "@/i18n/use-messages";
import { CategoryIntro } from "./CategoryIntro";
import { FiltersDesktop } from "./FiltersDesktop";
import { FiltersMobile } from "./FiltersMobile";
import { SortSelect } from "./SortSelect";
import { ProductGrid } from "./ProductGrid";
import { LoadMore } from "./LoadMore";
import { EmptyState } from "./EmptyState";
import type { HairColor, HairProduct, WeightRange } from "@/lib/content/types";

export interface CatalogViewProps {
  pathname: string;
  /** Все волосы — фильтрация происходит в браузере. */
  products: HairProduct[];
  colors: HairColor[];
  weightRange: WeightRange | null;
  /** Посчитано на сервере (см. lib/image-exists) — клиентские компоненты не читают fs. */
  imageExistsBySlug: Map<string, boolean>;
}

/**
 * Фильтрация — на клиенте: сервер (static export, без API-роутов) отдаёт
 * весь список волос один раз, а useSearchParams реактивно
 * пересчитывает выдачу без похода на сервер. useSearchParams требует
 * Suspense-границу, иначе next build ругается при static export.
 */
export function CatalogView(props: CatalogViewProps) {
  return (
    <Suspense fallback={<CatalogViewFallback {...props} />}>
      <CatalogViewInner {...props} />
    </Suspense>
  );
}

function CatalogViewFallback({ products }: CatalogViewProps) {
  return (
    <Container className="pb-16">
      <CategoryIntro section="hair" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 xl:grid-cols-4">
        {products.slice(0, 12).map((product) => (
          <div key={product.slug} className="aspect-[3/4] animate-pulse rounded-base bg-surface-alt" />
        ))}
      </div>
    </Container>
  );
}

function CatalogViewInner({
  pathname,
  products,
  colors,
  weightRange,
  imageExistsBySlug,
}: CatalogViewProps) {
  const ru = useTypedMessages();
  const rawSearchParams = useSearchParams();
  const raw = Object.fromEntries(rawSearchParams.entries());

  const { filters, limit } = parseCatalogSearchParams(raw);
  const editableFilters: EditableFilters = filters;
  const hasPrices = products.some((p) => p.variants.some((v) => v.price !== undefined));

  const colorsByCode = new Map(colors.map((c) => [c.code, c] as const));

  const filtered = filterHair(products, colors, filters);
  const visible = filtered.slice(0, limit);
  const hasMore = filtered.length > visible.length;

  return (
    <Container className="pb-16">
      <CategoryIntro section="hair" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        <FiltersDesktop
          pathname={pathname}
          filters={editableFilters}
          colors={colors}
          weightRange={weightRange}
          hasPrices={hasPrices}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-muted">
              {formatMessage(ru.catalog.resultsCount, { count: filtered.length })}
            </p>
            <div className="flex items-center gap-3">
              <FiltersMobile
                pathname={pathname}
                filters={editableFilters}
                colors={colors}
                products={products}
                weightRange={weightRange}
                hasPrices={hasPrices}
              />
              <SortSelect pathname={pathname} filters={editableFilters} />
            </div>
          </div>

          {visible.length > 0 ? (
            <>
              <ProductGrid
                products={visible}
                colorsByCode={colorsByCode}
                imageExistsBySlug={imageExistsBySlug}
              />
              {hasMore && (
                <LoadMore
                  pathname={pathname}
                  filters={editableFilters}
                  nextLimit={limit + LOAD_MORE_STEP}
                />
              )}
            </>
          ) : (
            <EmptyState resetHref={pathname} />
          )}
        </div>
      </div>
    </Container>
  );
}
