"use client";

import { useLocale } from "next-intl";
import { cn } from "@/components/ui/cn";
import { ColorSwatch } from "@/components/ui/ColorSwatch";
import { useTypedMessages, type Messages } from "@/i18n/use-messages";
import { pickLocale } from "@/lib/content/locale";
import { useVariantSelection } from "./variant-context";

function OptionChip({
  label,
  active,
  disabled,
  onClick,
  ru,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  ru: Messages;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-disabled={disabled}
      title={disabled ? ru.product.unavailableCombination : undefined}
      onClick={() => {
        if (!disabled) onClick();
      }}
      className={cn(
        "rounded-base border px-3 py-1.5 text-sm font-medium transition-colors duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
        disabled
          ? "cursor-not-allowed border-border text-ink-muted opacity-50"
          : active
            ? "border-ink bg-ink text-bg"
            : "border-border bg-bg text-ink hover:border-ink-strong",
      )}
    >
      {label}
    </button>
  );
}

export function VariantSelector() {
  const ru = useTypedMessages();
  const locale = useLocale();
  const { colorsByCode, hair } = useVariantSelection();

  if (!hair) return null;

  const {
    selectedColor,
    selectedLength,
    selectedWeight,
    setSelectedColor,
    setSelectedLength,
    setSelectedWeight,
    availableColorCodes,
    availableLengths,
    availableWeights,
    isColorAvailable,
    isLengthAvailable,
    isWeightAvailable,
  } = hair;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink-strong">{ru.product.selectColor}</span>
        <div className="flex flex-wrap gap-3">
          {availableColorCodes.map((code) => {
            const color = colorsByCode.get(code);
            if (!color) return null;
            const disabled = !isColorAvailable(code);
            return (
              <div
                key={code}
                aria-disabled={disabled}
                title={disabled ? ru.product.unavailableCombination : undefined}
                className={disabled ? "cursor-not-allowed opacity-40 grayscale" : undefined}
              >
                <ColorSwatch
                  code={color.code}
                  hex={color.hex}
                  swatchImage={color.swatchImage}
                  label={pickLocale(color.name, locale)}
                  selected={selectedColor === code}
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled) setSelectedColor(code);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink-strong">{ru.product.selectLength}</span>
        <div className="flex flex-wrap gap-2">
          {availableLengths.map((length) => (
            <OptionChip
              key={length}
              label={`${length} ${ru.catalog.lengthUnit}`}
              active={selectedLength === length}
              disabled={!isLengthAvailable(length)}
              onClick={() => setSelectedLength(length)}
              ru={ru}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink-strong">{ru.product.selectWeight}</span>
        <div className="flex flex-wrap gap-2">
          {availableWeights.map((weight) => (
            <OptionChip
              key={weight}
              label={`${weight} ${ru.product.weightUnit}`}
              active={selectedWeight === weight}
              disabled={!isWeightAvailable(weight)}
              onClick={() => setSelectedWeight(weight)}
              ru={ru}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
