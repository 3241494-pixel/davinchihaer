import Image from "next/image";
import Link from "next/link";
import { getPriceRange } from "@/lib/content/filter-logic";
import { formatPrice } from "@/lib/format-price";
import { formatMessage } from "@/lib/format-message";
import { publicImageExists } from "@/lib/image-exists";
import { ru } from "@/i18n/messages";
import { Badge } from "@/components/ui/Badge";
import type { HairColor, Product } from "@/lib/content/types";

const MAX_VISIBLE_SWATCHES = 6;

export interface ProductCardProps {
  product: Product;
  colorsByCode: Map<string, HairColor>;
}

export function ProductCard({ product, colorsByCode }: ProductCardProps) {
  const { min, max } = getPriceRange(product);
  const priceLabel =
    min === max ? formatPrice(min) : formatMessage(ru.catalog.priceFrom, { price: formatPrice(min) });

  const lengths = Array.from(new Set(product.variants.map((variant) => variant.length))).sort(
    (a, b) => a - b,
  );

  const colorCodes = Array.from(new Set(product.variants.map((variant) => variant.color)));
  const swatchColors = colorCodes
    .map((code) => colorsByCode.get(code))
    .filter((color): color is HairColor => Boolean(color));
  const visibleSwatches = swatchColors.slice(0, MAX_VISIBLE_SWATCHES);
  const extraSwatchCount = swatchColors.length - visibleSwatches.length;

  const inStock = product.variants.some((variant) => variant.inStock);
  const image = product.images[0];
  const imageExists = image ? publicImageExists(image.src) : false;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-base border border-border bg-bg transition-colors duration-200 hover:border-ink-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-alt">
        {imageExists && image ? (
          <Image
            src={image.src}
            alt={image.alt.ru}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-center text-xs text-ink-muted">
            {ru.categories[product.category]}
          </div>
        )}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {product.badges.map((badge) => (
              <Badge key={badge} variant="solid">
                {ru.catalog.badges[badge]}
              </Badge>
            ))}
          </div>
        )}
        {!inStock && (
          <div className="absolute top-2 right-2">
            <Badge variant="solid" tone="danger">
              {ru.catalog.outOfStock}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-heading text-lg text-ink-strong">{product.title.ru}</h3>
        <p className="text-base font-medium text-ink">{priceLabel}</p>
        <p className="text-sm text-ink-muted">
          {formatMessage(ru.catalog.availableLengths, { lengths: lengths.join(", ") })}
        </p>
        {visibleSwatches.length > 0 && (
          <div className="mt-1 flex items-center gap-1.5">
            {visibleSwatches.map((color) => (
              <span
                key={color.code}
                aria-hidden
                className="size-5 rounded-full border border-border"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {extraSwatchCount > 0 && (
              <span className="text-xs text-ink-muted">
                {formatMessage(ru.catalog.moreColors, { count: extraSwatchCount })}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
