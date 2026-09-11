"use client";

import { formatMessage } from "@/lib/format-message";
import { ru } from "@/i18n/messages";
import { useVariantSelection } from "./variant-context";

export function LeadFormPlaceholder() {
  const { product, colorsByCode, selectedVariant } = useVariantSelection();

  const summary = selectedVariant
    ? `«${product.title.ru}», ${selectedVariant.length} ${ru.catalog.lengthUnit}, ${
        colorsByCode.get(selectedVariant.color)?.name.ru ?? selectedVariant.color
      }, ${ru.product.specsLabels.sku.toLowerCase()} ${selectedVariant.sku}`
    : undefined;

  return (
    <section
      id="lead-form"
      className="flex scroll-mt-24 flex-col gap-2 rounded-base border border-dashed border-border bg-surface px-6 py-10 text-center"
    >
      <h2 className="font-heading text-2xl text-ink-strong">{ru.product.leadFormPlaceholder.title}</h2>
      <p className="mx-auto max-w-md text-sm text-ink-muted">
        {summary
          ? formatMessage(ru.product.leadFormPlaceholder.note, { summary })
          : ru.product.leadFormPlaceholder.noteEmpty}
      </p>
    </section>
  );
}
