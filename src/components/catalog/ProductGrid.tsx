import { ProductCard } from "./ProductCard";
import type { HairColor, Product } from "@/lib/content/types";

export interface ProductGridProps {
  products: Product[];
  colorsByCode: Map<string, HairColor>;
}

export function ProductGrid({ products, colorsByCode }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} colorsByCode={colorsByCode} />
      ))}
    </div>
  );
}
