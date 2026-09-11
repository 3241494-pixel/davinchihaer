import { Container } from "@/components/ui/Container";
import { getAllProducts, getColors } from "@/lib/content/products";
import { filterProducts } from "@/lib/content/filter-logic";
import {
  LOAD_MORE_STEP,
  parseCatalogSearchParams,
  type EditableFilters,
  type RawSearchParams,
} from "@/lib/catalog/search-params";
import { formatMessage } from "@/lib/format-message";
import { ru } from "@/i18n/messages";
import { CategoryIntro } from "./CategoryIntro";
import { FiltersDesktop } from "./FiltersDesktop";
import { FiltersMobile } from "./FiltersMobile";
import { SortSelect } from "./SortSelect";
import { ProductGrid } from "./ProductGrid";
import { LoadMore } from "./LoadMore";
import { EmptyState } from "./EmptyState";
import type { ProductCategory } from "@/lib/content/types";

export interface CatalogViewProps {
  pathname: string;
  lockedCategory?: ProductCategory;
  searchParams: RawSearchParams;
}

export function CatalogView({ pathname, lockedCategory, searchParams }: CatalogViewProps) {
  const { filters, limit } = parseCatalogSearchParams(searchParams, { lockedCategory });
  const editableFilters: EditableFilters = {
    lengths: filters.lengths,
    colorCodes: filters.colorCodes,
    colorGroups: filters.colorGroups,
    tapeWidth: filters.tapeWidth,
    inStockOnly: filters.inStockOnly,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    sort: filters.sort,
  };

  const allProducts = getAllProducts();
  const colors = getColors();
  const colorsByCode = new Map(colors.map((c) => [c.code, c] as const));

  const categoryScopedProducts = lockedCategory
    ? allProducts.filter((product) => product.category === lockedCategory)
    : allProducts;

  const filtered = filterProducts(allProducts, colors, filters);
  const visible = filtered.slice(0, limit);
  const hasMore = filtered.length > visible.length;

  return (
    <Container className="pb-16">
      <CategoryIntro category={lockedCategory} />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        <FiltersDesktop pathname={pathname} filters={editableFilters} colors={colors} />

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
                products={categoryScopedProducts}
              />
              <SortSelect pathname={pathname} filters={editableFilters} />
            </div>
          </div>

          {visible.length > 0 ? (
            <>
              <ProductGrid products={visible} colorsByCode={colorsByCode} />
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
