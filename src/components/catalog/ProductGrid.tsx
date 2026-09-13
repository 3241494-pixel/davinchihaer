import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "./ProductCard";
import type { HairColor, Product } from "@/lib/content/types";

export interface ProductGridProps {
  products: Product[];
  colorsByCode: Map<string, HairColor>;
  imageExistsBySlug: Map<string, boolean>;
}

const STAGGER_STEP_MS = 60;
const STAGGER_CAP_MS = 240;

export function ProductGrid({ products, colorsByCode, imageExistsBySlug }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
      {products.map((product, index) => (
        <Reveal
          key={product.slug}
          className="h-full"
          delayMs={Math.min(index * STAGGER_STEP_MS, STAGGER_CAP_MS)}
        >
          <ProductCard
            product={product}
            colorsByCode={colorsByCode}
            imageExists={imageExistsBySlug.get(product.slug) ?? false}
          />
        </Reveal>
      ))}
    </div>
  );
}
