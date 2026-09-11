"use client";

import type { MouseEvent } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconTelegram } from "@/components/ui/icons";
import { formatMessage } from "@/lib/format-message";
import { formatPrice } from "@/lib/format-price";
import { siteConfig } from "@/config/site";
import { ru } from "@/i18n/messages";
import { useVariantSelection } from "./variant-context";

export function VariantPriceActions() {
  const { product, colorsByCode, selectedVariant } = useVariantSelection();

  function handleLeadFormClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!selectedVariant) {
    return null;
  }

  const colorName = colorsByCode.get(selectedVariant.color)?.name.ru ?? selectedVariant.color;
  const telegramMessage = formatMessage(ru.product.telegramMessageTemplate, {
    title: product.title.ru,
    length: selectedVariant.length,
    color: colorName,
  });
  const telegramHref = `${siteConfig.telegramBotUrl}?text=${encodeURIComponent(telegramMessage)}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <span className="font-heading text-3xl text-ink-strong">
          {formatPrice(selectedVariant.price)}
        </span>
        {selectedVariant.oldPrice !== undefined && (
          <span className="text-lg text-ink-muted line-through">
            {formatPrice(selectedVariant.oldPrice)}
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
