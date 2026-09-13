import { Link } from "@/i18n/navigation";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { getAllProducts, getColors } from "@/lib/content/products";
import { filterProducts } from "@/lib/content/filter-logic";
import { buildImageExistsMap } from "@/lib/image-exists";
import { getTypedMessages } from "@/i18n/get-messages";

const POPULAR_LIMIT = 8;

export async function PopularProducts() {
  const ru = await getTypedMessages();
  const colors = getColors();
  const colorsByCode = new Map(colors.map((color) => [color.code, color] as const));
  const products = filterProducts(getAllProducts(), colors, { sort: "popularity" }).slice(
    0,
    POPULAR_LIMIT,
  );
  const imageExistsBySlug = buildImageExistsMap(products);

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
      <ProductGrid
        products={products}
        colorsByCode={colorsByCode}
        imageExistsBySlug={imageExistsBySlug}
      />
    </div>
  );
}
