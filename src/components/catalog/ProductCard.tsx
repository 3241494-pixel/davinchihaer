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
  if (product.kind === "hair") {
    const lengths = Array.from(new Set(product.variants.map((variant) => variant.length))).sort(
      (a, b) => a - b,
    );
    const weights = Array.from(new Set(product.variants.map((variant) => variant.weightGrams))).sort(
      (a, b) => a - b,
    );
    const shades = new Set(
      product.variants.map((variant) => variant.color).filter((code) => colorsByCode.has(code)),
    ).size;
    paramsLine = [
      formatRange(lengths, ru.catalog.lengthUnit),
      formatMessage(ru.catalog.shadesCount, { count: shades }),
      formatRange(weights, ru.product.weightUnit),
    ].join(" · ");
  } else {
    const { lengthM, widthCm, volumeMl } = product.spec;
    paramsLine =
      volumeMl !== undefined
        ? `${volumeMl} ${ru.product.units.ml}`
        : `${lengthM ?? ""} ${ru.product.units.m} × ${widthCm ?? ""} ${ru.product.units.cm}`;
  }

  const inStock = product.variants.some((variant) => variant.inStock);
  const image = product.images[0];
  // Все пути из content/ проверяет тест «product images exist», поэтому второе фото
  // можно брать без отдельной проверки, если первое на месте.
  const hoverImage = imageExists ? product.images[1] : undefined;
  const cta = product.kind === "hair" ? ru.catalog.cardCta.hair : ru.catalog.cardCta.material;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col bg-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-alt">
        {imageExists && image ? (
          <>
            <Image
              src={image.src}
              alt={pickLocale(image.alt, locale)}
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 640px) 30vw, 50vw"
              className="object-cover"
            />
            {hoverImage && (
              <Image
                src={hoverImage.src}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1280px) 22vw, (min-width: 640px) 30vw, 50vw"
                className="object-cover opacity-0 transition-opacity duration-300 motion-reduce:transition-none md:group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex size-full items-center justify-center p-4 text-center text-xs text-ink-muted">
            {ru.product.gallery.placeholder}
          </div>
        )}
        {siteConfig.showDemoBadge && product.isPlaceholder && (
          <div className="absolute top-2 left-2 bg-bg">
            <Badge variant="outline">{ru.catalog.demoBadge}</Badge>
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

      <div className="flex flex-1 flex-col gap-1.5 pt-3 pb-1">
        <h3 className="caps font-medium text-ink-strong">{pickLocale(product.title, locale)}</h3>
        <p className="text-sm text-ink-muted">{paramsLine}</p>
        <p className="text-[15px] font-medium tabular-nums text-ink">{priceLabel}</p>
        <span className="caps mt-auto pt-2 text-ink underline decoration-border underline-offset-4 transition-colors duration-200 group-hover:decoration-ink">
          {cta}
        </span>
      </div>
    </Link>
  );
}

function formatRange(values: number[], unit: string): string {
  if (values.length === 0) return "";
  const min = values[0];
  const max = values[values.length - 1];
  return min === max ? `${min}\u00a0${unit}` : `${min}–${max}\u00a0${unit}`;
}
