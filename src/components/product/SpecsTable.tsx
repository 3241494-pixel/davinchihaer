"use client";

import { useLocale } from "next-intl";
import { useTypedMessages } from "@/i18n/use-messages";
import { pickLocale } from "@/lib/content/locale";
import { useVariantSelection } from "./variant-context";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-border last:border-0">
      <th scope="row" className="py-2 pr-4 text-left text-sm font-medium text-ink-strong">
        {label}
      </th>
      <td className="py-2 text-sm text-ink-muted">{value}</td>
    </tr>
  );
}

export function SpecsTable() {
  const ru = useTypedMessages();
  const locale = useLocale();
  const { product, colorsByCode, selectedVariant } = useVariantSelection();
  const labels = ru.product.specsLabels;

  if (!selectedVariant) return null;

  if (product.kind === "material") {
    const { lengthM, widthCm, volumeMl } = product.spec;
    const compatible =
      product.compatibleWith.length === 0
        ? ru.product.allAttachments
        : product.compatibleWith.map((a) => ru.attachments[a]).join(", ");
    return (
      <table className="w-full border-collapse">
        <tbody>
          <Row label={labels.materialType} value={ru.materialTypes[product.materialType]} />
          {lengthM !== undefined && (
            <Row label={labels.rollLength} value={`${lengthM} ${ru.product.units.m}`} />
          )}
          {widthCm !== undefined && (
            <Row label={labels.width} value={`${widthCm} ${ru.product.units.cm}`} />
          )}
          {volumeMl !== undefined && (
            <Row label={labels.volume} value={`${volumeMl} ${ru.product.units.ml}`} />
          )}
          <Row label={labels.compatibleWith} value={compatible} />
          <Row label={labels.sku} value={selectedVariant.sku} />
        </tbody>
      </table>
    );
  }

  if (!("color" in selectedVariant)) return null;
  const colorNameSource = colorsByCode.get(selectedVariant.color)?.name;
  const colorName = colorNameSource ? pickLocale(colorNameSource, locale) : "";

  return (
    <table className="w-full border-collapse">
      <tbody>
        <Row label={labels.attachment} value={ru.attachments[product.attachment]} />
        <Row label={labels.origin} value={ru.origins[product.origin]} />
        <Row label={labels.structure} value={ru.structures[product.structure]} />
        <Row label={labels.length} value={`${selectedVariant.length} ${ru.catalog.lengthUnit}`} />
        <Row label={labels.color} value={`${selectedVariant.color} ${colorName}`.trim()} />
        <Row label={labels.weight} value={`${selectedVariant.weightGrams} ${ru.product.weightUnit}`} />
        {selectedVariant.tapesCount !== undefined && (
          <Row label={labels.tapesCount} value={String(selectedVariant.tapesCount)} />
        )}
        <Row label={labels.sku} value={selectedVariant.sku} />
      </tbody>
    </table>
  );
}
