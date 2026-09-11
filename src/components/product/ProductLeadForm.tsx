"use client";

import { RetailLeadForm } from "@/components/forms/RetailLeadForm";
import { ru } from "@/i18n/messages";
import { useVariantSelection } from "./variant-context";

export function ProductLeadForm() {
  const { product, colorsByCode, selectedVariant } = useVariantSelection();
  const colorName = selectedVariant
    ? (colorsByCode.get(selectedVariant.color)?.name.ru ?? selectedVariant.color)
    : undefined;

  return (
    <section
      id="lead-form"
      className="scroll-mt-24 rounded-base border border-border bg-surface px-6 py-8"
    >
      <h2 className="mb-6 font-heading text-2xl text-ink-strong">
        {ru.product.leadFormPlaceholder.title}
      </h2>
      <RetailLeadForm
        productSlug={product.slug}
        variantId={selectedVariant?.id}
        productTitle={product.title.ru}
        length={selectedVariant?.length}
        colorName={colorName}
      />
    </section>
  );
}
