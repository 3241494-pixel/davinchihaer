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

  const colorNameSource = colorsByCode.get(selectedVariant.color)?.name;
  const colorName = colorNameSource ? pickLocale(colorNameSource, locale) : selectedVariant.color;
  const telegramMessage = formatMessage(ru.product.telegramMessageTemplate, {
    title: pickLocale(product.title, locale),
    length: selectedVariant.length,
    color: colorName,
  });
  const telegramHref = `${siteConfig.telegramBotUrl}?text=${encodeURIComponent(telegramMessage)}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <Price cents={selectedVariant.price} className="font-heading text-3xl text-ink-strong" />
        {selectedVariant.oldPrice !== undefined && (
          <span className="text-lg text-ink-muted line-through">
            {formatPrice(selectedVariant.oldPrice, locale)}
          </span>
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
