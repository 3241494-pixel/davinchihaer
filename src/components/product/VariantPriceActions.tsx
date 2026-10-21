"use client";

import type { MouseEvent } from "react";
import { useLocale } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { IconTelegram } from "@/components/ui/icons";
import { formatMessage } from "@/lib/format-message";
import { formatPrice } from "@/lib/format-price";
import { siteConfig } from "@/config/site";
import { useTypedMessages } from "@/i18n/use-messages";
import { pickLocale } from "@/lib/content/locale";
import { useVariantSelection } from "./variant-context";

export function VariantPriceActions() {
  const ru = useTypedMessages();
  const locale = useLocale();
  const { product, colorsByCode, selectedVariant } = useVariantSelection();

  function handleLeadFormClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!selectedVariant) {
    return null;
  }

  const title = pickLocale(product.title, locale);
  let telegramMessage: string;
  if (product.kind === "hair" && "color" in selectedVariant) {
    const colorNameSource = colorsByCode.get(selectedVariant.color)?.name;
    const colorName = colorNameSource ? pickLocale(colorNameSource, locale) : selectedVariant.color;
    telegramMessage = formatMessage(ru.product.telegramMessageTemplate, {
      title,
      length: selectedVariant.length,
      color: `${selectedVariant.color} ${colorName}`,
      weight: selectedVariant.weightGrams,
    });
  } else {
    telegramMessage = formatMessage(ru.product.telegramMessageMaterial, { title });
  }
  const telegramHref = `${siteConfig.telegramBotUrl}?text=${encodeURIComponent(telegramMessage)}`;
  const oldPrice = "oldPrice" in selectedVariant ? selectedVariant.oldPrice : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        {selectedVariant.price !== undefined ? (
          <Price
            cents={selectedVariant.price}
            className="font-heading text-3xl tabular-nums text-ink-strong"
          />
        ) : (
          <span className="font-heading text-3xl text-ink-strong">{ru.product.priceOnRequest}</span>
        )}
        {selectedVariant.price !== undefined && oldPrice !== undefined && (
          <span className="text-lg text-ink-muted line-through">{formatPrice(oldPrice, locale)}</span>
        )}
        <Badge variant={selectedVariant.inStock ? "outline" : "solid"} tone={selectedVariant.inStock ? "default" : "danger"}>
          {selectedVariant.inStock ? ru.product.inStock : ru.product.outOfStock}
        </Badge>
      </div>

      <p className="text-sm text-ink-muted">
        {ru.product.specsLabels.sku}: {selectedVariant.sku}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="primary" size="lg" className="sm:flex-1">
          <a href="#lead-form" onClick={handleLeadFormClick}>
            {ru.product.cta.leadForm}
          </a>
        </Button>
        <Button asChild variant="secondary" size="lg" className="sm:flex-1">
          <a href={telegramHref} target="_blank" rel="noopener noreferrer">
            <IconTelegram className="size-5" />
            {ru.product.cta.telegram}
          </a>
        </Button>
      </div>
    </div>
  );
}
