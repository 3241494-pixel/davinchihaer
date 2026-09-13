import { ProductGrid } from "@/components/catalog/ProductGrid";
import { getTypedMessages } from "@/i18n/get-messages";
import { buildImageExistsMap } from "@/lib/image-exists";
import type { HairColor, Product } from "@/lib/content/types";

export async function RelatedProducts({
  products,
  colorsByCode,
}: {
  products: Product[];
  colorsByCode: Map<string, HairColor>;
}) {
  if (products.length === 0) return null;
  const ru = await getTypedMessages();
  const imageExistsBySlug = buildImageExistsMap(products);

  return (
    <section className="flex flex-col gap-4 border-t border-border pt-10">
      <h2 className="font-heading text-2xl text-ink-strong">{ru.product.related}</h2>
      <ProductGrid products={products} colorsByCode={colorsByCode} imageExistsBySlug={imageExistsBySlug} />
    </section>
  );
}
