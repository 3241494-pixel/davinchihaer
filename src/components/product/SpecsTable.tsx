"use client";

import { ru } from "@/i18n/messages";
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
  const { product, colorsByCode, selectedVariant } = useVariantSelection();

  if (!selectedVariant) return null;

  const colorName = colorsByCode.get(selectedVariant.color)?.name.ru ?? selectedVariant.color;

  return (
    <table className="w-full border-collapse">
      <tbody>
        <Row label={ru.product.specsLabels.length} value={`${selectedVariant.length} ${ru.catalog.lengthUnit}`} />
        <Row label={ru.product.specsLabels.color} value={colorName} />
        <Row label={ru.product.specsLabels.weight} value={`${selectedVariant.weight} ${ru.product.weightUnit}`} />
        <Row label={ru.product.specsLabels.tapesCount} value={String(selectedVariant.tapesCount)} />
        <Row label={ru.product.specsLabels.sku} value={selectedVariant.sku} />
        {product.tapeWidth && (
          <Row
            label={ru.product.specsLabels.tapeWidth}
            value={`${product.tapeWidth} ${ru.catalog.lengthUnit}`}
          />
        )}
        {product.hairStructure && (
          <Row
            label={ru.product.specsLabels.hairStructure}
            value={ru.product.hairStructureLabels[product.hairStructure]}
          />
        )}
        {product.hairOrigin && (
          <Row label={ru.product.specsLabels.hairOrigin} value={product.hairOrigin.ru} />
        )}
      </tbody>
    </table>
  );
}
