import { ProductGrid } from "@/components/catalog/ProductGrid";
import { getTypedMessages } from "@/i18n/get-messages";
import { buildImageExistsMap } from "@/lib/image-exists";
import type { HairColor, Product } from "@/lib/content/types";

export async function RelatedProducts({
  products,
  colorsByCode,
  heading,
  description,
}: {
  products: Product[];
  colorsByCode: Map<string, HairColor>;
  /** По умолчанию — «Похожие товары». */
  heading?: string;
  description?: string;
}) {
  if (products.length === 0) return null;
  const ru = await getTypedMessages();
  const imageExistsBySlug = buildImageExistsMap(products);

  return (
    <section className="flex flex-col gap-4 border-t border-border pt-10">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl text-ink-strong">{heading ?? ru.product.related}</h2>
        {description && <p className="text-sm text-ink-muted">{description}</p>}
      </div>
      <ProductGrid products={products} colorsByCode={colorsByCode} imageExistsBySlug={imageExistsBySlug} />
    </section>
  );
}
