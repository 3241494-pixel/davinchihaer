"use client";

import { useLocale } from "next-intl";
import { RetailLeadForm } from "@/components/forms/RetailLeadForm";
import { useTypedMessages } from "@/i18n/use-messages";
import { pickLocale } from "@/lib/content/locale";
import { useVariantSelection } from "./variant-context";

export function ProductLeadForm() {
  const ru = useTypedMessages();
  const locale = useLocale();
  const { product, colorsByCode, selectedVariant } = useVariantSelection();
  const colorNameSource = selectedVariant ? colorsByCode.get(selectedVariant.color)?.name : undefined;
  const colorName = selectedVariant
    ? (colorNameSource ? pickLocale(colorNameSource, locale) : selectedVariant.color)
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
        productTitle={pickLocale(product.title, locale)}
        length={selectedVariant?.length}
        colorName={colorName}
      />
    </section>
  );
}
