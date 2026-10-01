"use client";

import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/components/ui/cn";
import { Checkbox } from "@/components/ui/Checkbox";
import { ColorSwatch } from "@/components/ui/ColorSwatch";
import {
  ATTACHMENTS,
  COLOR_GROUPS,
  LENGTHS,
  ORIGINS,
  STRUCTURES,
  type EditableFilters,
} from "@/lib/catalog/search-params";
import { Link } from "@/i18n/navigation";
import { useTypedMessages } from "@/i18n/use-messages";
import { pickLocale } from "@/lib/content/locale";
import type {
  AttachmentType,
  HairColor,
  HairColorGroup,
  HairLength,
  HairOrigin,
  HairStructure,
  WeightRange,
} from "@/lib/content/types";

export interface FilterControlsProps {
  value: EditableFilters;
  onChange: (next: EditableFilters) => void;
  colors: HairColor[];
  weightRange: WeightRange | null;
  /** Пока цен нет («по запросу»), фильтр по цене ничего бы не нашёл — прячем его. */
  hasPrices: boolean;
  idPrefix: string;
}

function toggleInArray<T>(list: T[] | undefined, item: T): T[] | undefined {
  const current = list ?? [];
  const next = current.includes(item) ? current.filter((v) => v !== item) : [...current, item];
  return next.length ? next : undefined;
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-base border px-3 py-1.5 text-sm font-medium transition-colors duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
        active
          ? "border-ink bg-ink text-bg"
          : "border-border bg-bg text-ink hover:border-ink-strong",
      )}
    >
      {children}
    </button>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-ink-strong">{title}</legend>
      {children}
    </fieldset>
  );
}

export function FilterControls({ value, onChange, colors, weightRange, hasPrices, idPrefix }: FilterControlsProps) {
  const ru = useTypedMessages();
  const locale = useLocale();
  const [priceMinInput, setPriceMinInput] = useState(
    value.priceMin !== undefined ? String(value.priceMin / 100) : "",
  );
  const [priceMaxInput, setPriceMaxInput] = useState(
    value.priceMax !== undefined ? String(value.priceMax / 100) : "",
  );

  const [weightMinInput, setWeightMinInput] = useState(
    value.weightMin !== undefined ? String(value.weightMin) : "",
  );
  const [weightMaxInput, setWeightMaxInput] = useState(
    value.weightMax !== undefined ? String(value.weightMax) : "",
  );

  function commitWeight() {
    const weightMin = weightMinInput === "" ? undefined : Math.round(Number(weightMinInput));
    const weightMax = weightMaxInput === "" ? undefined : Math.round(Number(weightMaxInput));
    onChange({
      ...value,
      weightMin: Number.isFinite(weightMin) ? weightMin : undefined,
      weightMax: Number.isFinite(weightMax) ? weightMax : undefined,
    });
  }

  function handleWeightKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitWeight();
    }
  }

  function commitPrice() {
    const priceMin = priceMinInput === "" ? undefined : Math.round(Number(priceMinInput) * 100);
    const priceMax = priceMaxInput === "" ? undefined : Math.round(Number(priceMaxInput) * 100);
    onChange({
      ...value,
      priceMin: Number.isFinite(priceMin) ? priceMin : undefined,
      priceMax: Number.isFinite(priceMax) ? priceMax : undefined,
    });
  }

  function handlePriceKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitPrice();
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <FilterSection title={ru.catalog.filters.attachment}>
        <div className="flex flex-wrap gap-2">
          {ATTACHMENTS.map((attachment) => (
            <FilterChip
              key={attachment}
              active={Boolean(value.attachment?.includes(attachment))}
              onClick={() =>
                onChange({
                  ...value,
                  attachment: toggleInArray<AttachmentType>(value.attachment, attachment),
                })
              }
            >
              {ru.attachments[attachment]}
            </FilterChip>
          ))}
        </div>
        <Link
          href="/technology/bio-tape"
          className="text-xs text-ink-muted underline-offset-4 hover:text-ink hover:underline"
        >
          {ru.attachments["bio-tape"]}: {ru.catalog.filters.bioTapeHint.toLowerCase()}
        </Link>
      </FilterSection>

      <FilterSection title={ru.catalog.filters.origin}>
        <div className="flex flex-wrap gap-2">
          {ORIGINS.map((origin) => (
            <FilterChip
              key={origin}
              active={Boolean(value.origin?.includes(origin))}
              onClick={() =>
                onChange({ ...value, origin: toggleInArray<HairOrigin>(value.origin, origin) })
              }
            >
              {ru.origins[origin]}
            </FilterChip>
          ))}
        </div>
      </FilterSection>

      <FilterSection title={ru.catalog.filters.structure}>
        <div className="flex flex-wrap gap-2">
          {STRUCTURES.map((structure) => (
            <FilterChip
              key={structure}
              active={Boolean(value.structure?.includes(structure))}
              onClick={() =>
                onChange({
                  ...value,
                  structure: toggleInArray<HairStructure>(value.structure, structure),
                })
              }
            >
              {ru.structures[structure]}
            </FilterChip>
          ))}
        </div>
      </FilterSection>

      <FilterSection title={ru.catalog.filters.length}>
        <div className="flex flex-wrap gap-2">
          {LENGTHS.map((length) => (
            <FilterChip
              key={length}
              active={Boolean(value.lengths?.includes(length))}
              onClick={() =>
                onChange({
                  ...value,
                  lengths: toggleInArray<HairLength>(value.lengths, length),
                })
              }
            >
              {length} {ru.catalog.lengthUnit}
            </FilterChip>
          ))}
        </div>
      </FilterSection>

      <FilterSection title={ru.catalog.filters.weight}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={10}
            placeholder={weightRange ? `${ru.catalog.filters.weightMin} ${weightRange.min}` : ru.catalog.filters.weightMin}
            aria-label={`${ru.catalog.filters.weight}: ${ru.catalog.filters.weightMin}`}
            value={weightMinInput}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setWeightMinInput(event.target.value)}
            onBlur={commitWeight}
            onKeyDown={handleWeightKeyDown}
            className="w-full min-w-0 rounded-base border border-border bg-bg px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
          />
          <span aria-hidden className="text-ink-muted">
            –
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={10}
            placeholder={weightRange ? `${ru.catalog.filters.weightMax} ${weightRange.max}` : ru.catalog.filters.weightMax}
            aria-label={`${ru.catalog.filters.weight}: ${ru.catalog.filters.weightMax}`}
            value={weightMaxInput}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setWeightMaxInput(event.target.value)}
            onBlur={commitWeight}
            onKeyDown={handleWeightKeyDown}
            className="w-full min-w-0 rounded-base border border-border bg-bg px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
          />
        </div>
      </FilterSection>

      <FilterSection title={ru.catalog.filters.colorGroup}>
        <div className="flex flex-wrap gap-2">
          {COLOR_GROUPS.map((group) => (
            <FilterChip
              key={group}
              active={Boolean(value.colorGroups?.includes(group))}
              onClick={() =>
                onChange({
                  ...value,
                  colorGroups: toggleInArray<HairColorGroup>(value.colorGroups, group),
                })
              }
            >
              {ru.catalog.colorGroups[group]}
            </FilterChip>
          ))}
        </div>
      </FilterSection>

      <FilterSection title={ru.catalog.filters.color}>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <ColorSwatch
              key={color.code}
              code={color.code}
              hex={color.hex}
              swatchImage={color.swatchImage}
              label={pickLocale(color.name, locale)}
              size="sm"
              selected={Boolean(value.colorCodes?.includes(color.code))}
              onClick={() =>
                onChange({
                  ...value,
                  colorCodes: toggleInArray<string>(value.colorCodes, color.code),
                })
              }
            />
          ))}
        </div>
      </FilterSection>

      <Checkbox
        id={`${idPrefix}-in-stock`}
        label={ru.catalog.filters.inStockOnly}
        checked={Boolean(value.inStockOnly)}
        onChange={(event) => onChange({ ...value, inStockOnly: event.target.checked || undefined })}
      />

      {hasPrices && (
      <FilterSection title={ru.catalog.filters.priceMin}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            placeholder={ru.catalog.filters.priceMin}
            aria-label={ru.catalog.filters.priceMin}
            value={priceMinInput}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setPriceMinInput(event.target.value)}
            onBlur={commitPrice}
            onKeyDown={handlePriceKeyDown}
            className="w-full rounded-base border border-border bg-bg px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
          />
          <span aria-hidden className="text-ink-muted">
            –
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            placeholder={ru.catalog.filters.priceMax}
            aria-label={ru.catalog.filters.priceMax}
            value={priceMaxInput}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setPriceMaxInput(event.target.value)}
            onBlur={commitPrice}
            onKeyDown={handlePriceKeyDown}
            className="w-full rounded-base border border-border bg-bg px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
          />
        </div>
      </FilterSection>
      )}

    </div>
  );
}
