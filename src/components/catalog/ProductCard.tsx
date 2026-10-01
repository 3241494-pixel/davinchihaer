"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getPriceRange } from "@/lib/content/filter-logic";
import { pickLocale } from "@/lib/content/locale";
import { formatPrice } from "@/lib/format-price";
import { formatMessage } from "@/lib/format-message";
import { useTypedMessages } from "@/i18n/use-messages";
import { Badge } from "@/components/ui/Badge";
import { siteConfig } from "@/config/site";
import type { HairColor, Product } from "@/lib/content/types";

const MAX_VISIBLE_SWATCHES = 6;

export interface ProductCardProps {
  product: Product;
  colorsByCode: Map<string, HairColor>;
  /** Посчитано на сервере (fs недоступен клиентским компонентам), см. lib/image-exists. */
  imageExists: boolean;
}

export function ProductCard({ product, colorsByCode, imageExists }: ProductCardProps) {
  const ru = useTypedMessages();
  const locale = useLocale();
  const range = getPriceRange(product);
  const priceLabel = !range
    ? ru.catalog.priceOnRequest
    : range.min === range.max
      ? formatPrice(range.min, locale)
      : formatMessage(ru.catalog.priceFrom, { price: formatPrice(range.min, locale) });

  let paramsLine: string;
  let swatchColors: HairColor[] = [];
  if (product.kind === "hair") {
    const lengths = Array.from(new Set(product.variants.map((variant) => variant.length))).sort(
      (a, b) => a - b,
    );
    const colorCodes = Array.from(new Set(product.variants.map((variant) => variant.color)));
    swatchColors = colorCodes
      .map((code) => colorsByCode.get(code))
      .filter((color): color is HairColor => Boolean(color));
    paramsLine = [
      ru.attachments[product.attachment],
      ru.origins[product.origin],
      `${lengths[0]}–${lengths[lengths.length - 1]} ${ru.catalog.lengthUnit}`,
    ].join(" · ");
  } else {
    const { lengthM, widthCm, volumeMl } = product.spec;
    paramsLine =
      volumeMl !== undefined
        ? `${volumeMl} ${ru.product.units.ml}`
        : `${lengthM ?? ""} ${ru.product.units.m} × ${widthCm ?? ""} ${ru.product.units.cm}`;
  }
  const visibleSwatches = swatchColors.slice(0, MAX_VISIBLE_SWATCHES);
  const extraSwatchCount = swatchColors.length - visibleSwatches.length;

  const inStock = product.variants.some((variant) => variant.inStock);
  const image = product.images[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-base border border-border bg-bg transition-colors duration-200 hover:border-ink-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-alt">
        {imageExists && image ? (
          <Image
            src={image.src}
            alt={pickLocale(image.alt, locale)}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center p-4 text-center text-xs text-ink-muted">
            {ru.product.gallery.placeholder}
          </div>
        )}
        {siteConfig.showDemoBadge && product.isPlaceholder && (
          <div className="absolute top-2 left-2 bg-bg">
            <Badge variant="outline">
              {ru.catalog.demoBadge}
            </Badge>
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
        <h3 className="font-heading text-lg text-ink-strong">{pickLocale(product.title, locale)}</h3>
        <p className="text-sm text-ink-muted">{paramsLine}</p>
        <p className="text-base font-medium tabular-nums text-ink">{priceLabel}</p>
        {visibleSwatches.length > 0 && (
          <div className="mt-1 flex items-center gap-1.5">
            {visibleSwatches.map((color) => (
              <span
                key={color.code}
                aria-hidden
                title={color.code}
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
