"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type {
  HairColor,
  HairLength,
  HairVariant,
  MaterialVariant,
  Product,
} from "@/lib/content/types";

export interface HairSelection {
  selectedColor: string;
  selectedLength: HairLength;
  selectedWeight: number;
  selectedVariant: HairVariant | undefined;
  setSelectedColor: (color: string) => void;
  setSelectedLength: (length: HairLength) => void;
  setSelectedWeight: (weight: number) => void;
  availableColorCodes: string[];
  availableLengths: HairLength[];
  availableWeights: number[];
  isColorAvailable: (color: string) => boolean;
  isLengthAvailable: (length: HairLength) => boolean;
  isWeightAvailable: (weight: number) => boolean;
}

interface VariantContextValue {
  product: Product;
  colorsByCode: Map<string, HairColor>;
  selectedVariant: HairVariant | MaterialVariant | undefined;
  /** null для материалов: у них нет выбора оттенка, длины и густоты. */
  hair: HairSelection | null;
}

const VariantContext = createContext<VariantContextValue | null>(null);

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

/** Порядок выбора: оттенок → длина → густота. */
function useHairSelection(variants: HairVariant[]): HairSelection {
  const defaultVariant = variants.find((variant) => variant.inStock) ?? variants[0];
  const [selectedColor, setColorState] = useState<string>(defaultVariant?.color ?? "");
  const [selectedLength, setLengthState] = useState<HairLength>(defaultVariant?.length ?? 40);
  const [selectedWeight, setWeightState] = useState<number>(defaultVariant?.weightGrams ?? 0);

  const availableColorCodes = useMemo(() => unique(variants.map((v) => v.color)), [variants]);
  const availableLengths = useMemo(
    () => unique(variants.map((v) => v.length)).sort((a, b) => a - b),
    [variants],
  );
  const availableWeights = useMemo(
    () => unique(variants.map((v) => v.weightGrams)).sort((a, b) => a - b),
    [variants],
  );

  function find(color: string, length: HairLength, weight: number) {
    return variants.find(
      (v) => v.color === color && v.length === length && v.weightGrams === weight,
    );
  }

  /** После смены оттенка или длины подбирает ближайшую существующую комбинацию. */
  function settle(color: string, length: HairLength, weight: number) {
    const sameColor = variants.filter((v) => v.color === color);
    const nextLength = sameColor.some((v) => v.length === length)
      ? length
      : (sameColor[0]?.length ?? length);
    const sameColorLength = sameColor.filter((v) => v.length === nextLength);
    const nextWeight = sameColorLength.some((v) => v.weightGrams === weight)
      ? weight
      : (sameColorLength[0]?.weightGrams ?? weight);
    setColorState(color);
    setLengthState(nextLength);
    setWeightState(nextWeight);
  }

  return {
    selectedColor,
    selectedLength,
    selectedWeight,
    selectedVariant: find(selectedColor, selectedLength, selectedWeight),
    setSelectedColor: (color) => settle(color, selectedLength, selectedWeight),
    setSelectedLength: (length) => settle(selectedColor, length, selectedWeight),
    setSelectedWeight: (weight) => setWeightState(weight),
    availableColorCodes,
    availableLengths,
    availableWeights,
    isColorAvailable: (color) => variants.some((v) => v.color === color),
    isLengthAvailable: (length) =>
      variants.some((v) => v.color === selectedColor && v.length === length),
    isWeightAvailable: (weight) =>
      variants.some(
        (v) => v.color === selectedColor && v.length === selectedLength && v.weightGrams === weight,
      ),
  };
}

const NO_HAIR_VARIANTS: HairVariant[] = [];

export interface VariantProviderProps {
  product: Product;
  colors: HairColor[];
  children: React.ReactNode;
}

export function VariantProvider({ product, colors, children }: VariantProviderProps) {
  const colorsByCode = useMemo(
    () => new Map(colors.map((color) => [color.code, color] as const)),
    [colors],
  );
  const hairSelection = useHairSelection(
    product.kind === "hair" ? product.variants : NO_HAIR_VARIANTS,
  );

  const value: VariantContextValue =
    product.kind === "hair"
      ? {
          product,
          colorsByCode,
          selectedVariant: hairSelection.selectedVariant,
          hair: hairSelection,
        }
      : {
          product,
          colorsByCode,
          selectedVariant: product.variants.find((v) => v.inStock) ?? product.variants[0],
          hair: null,
        };

  return <VariantContext.Provider value={value}>{children}</VariantContext.Provider>;
}

export function useVariantSelection(): VariantContextValue {
  const ctx = useContext(VariantContext);
  if (!ctx) {
    throw new Error("useVariantSelection должен использоваться внутри <VariantProvider>");
  }
  return ctx;
}
