import { cn } from "@/components/ui/cn";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "./ProductCard";
import type { HairColor, Product } from "@/lib/content/types";

export interface ProductGridProps {
  products: Product[];
  colorsByCode: Map<string, HairColor>;
  imageExistsBySlug: Map<string, boolean>;
  /** Материалов четыре: один ряд на десктопе, 2×2 на мобильном. */
  layout?: "hair" | "materials";
}

const LAYOUT_CLASSES = {
  hair: "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4",
  materials: "grid-cols-2 lg:grid-cols-4",
} as const;

const STAGGER_STEP_MS = 60;
const STAGGER_CAP_MS = 240;

export function ProductGrid({
  products,
  colorsByCode,
  imageExistsBySlug,
  layout = "hair",
}: ProductGridProps) {
  return (
    <div className={cn("grid gap-3 sm:gap-6", LAYOUT_CLASSES[layout])}>
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
