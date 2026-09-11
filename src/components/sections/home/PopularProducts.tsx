import Link from "next/link";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { getAllProducts, getColors } from "@/lib/content/products";
import { filterProducts } from "@/lib/content/filter-logic";
import { ru } from "@/i18n/messages";

const POPULAR_LIMIT = 8;

export function PopularProducts() {
  const colors = getColors();
  const colorsByCode = new Map(colors.map((color) => [color.code, color] as const));
  const products = filterProducts(getAllProducts(), colors, { sort: "popularity" }).slice(
    0,
    POPULAR_LIMIT,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-3xl text-ink-strong">{ru.home.popular.heading}</h2>
        <Link
          href="/catalog"
          className="text-sm font-medium text-ink underline-offset-4 hover:underline"
        >
          {ru.home.popular.cta}
        </Link>
      </div>
      <ProductGrid products={products} colorsByCode={colorsByCode} />
    </div>
  );
}
