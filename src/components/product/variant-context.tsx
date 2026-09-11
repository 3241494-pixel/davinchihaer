"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { HairColor, HairLength, Product, ProductVariant } from "@/lib/content/types";

interface VariantContextValue {
  product: Product;
  colorsByCode: Map<string, HairColor>;
  selectedLength: HairLength;
  selectedColor: string;
  selectedVariant: ProductVariant | undefined;
  setSelectedLength: (length: HairLength) => void;
  setSelectedColor: (color: string) => void;
  availableLengths: HairLength[];
  availableColorCodes: string[];
  isLengthAvailable: (length: HairLength) => boolean;
  isColorAvailable: (color: string) => boolean;
}

const VariantContext = createContext<VariantContextValue | null>(null);

function pickDefaultVariant(product: Product): ProductVariant {
  return product.variants.find((variant) => variant.inStock) ?? product.variants[0];
}

export interface VariantProviderProps {
  product: Product;
  colors: HairColor[];
  children: React.ReactNode;
}

export function VariantProvider({ product, colors, children }: VariantProviderProps) {
  const defaultVariant = useMemo(() => pickDefaultVariant(product), [product]);
  const [selectedLength, setSelectedLength] = useState<HairLength>(defaultVariant.length);
  const [selectedColor, setSelectedColor] = useState<string>(defaultVariant.color);

  const colorsByCode = useMemo(
    () => new Map(colors.map((color) => [color.code, color] as const)),
    [colors],
  );

  const availableLengths = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.length))).sort((a, b) => a - b),
    [product],
  );
  const availableColorCodes = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.color))),
    [product],
  );

  const selectedVariant = useMemo(
    () =>
      product.variants.find(
        (variant) => variant.length === selectedLength && variant.color === selectedColor,
      ),
    [product, selectedLength, selectedColor],
  );

  function isLengthAvailable(length: HairLength): boolean {
    return product.variants.some((variant) => variant.length === length && variant.color === selectedColor);
  }

  function isColorAvailable(color: string): boolean {
    return product.variants.some((variant) => variant.color === color && variant.length === selectedLength);
  }

  const value: VariantContextValue = {
    product,
    colorsByCode,
    selectedLength,
    selectedColor,
    selectedVariant,
    setSelectedLength,
    setSelectedColor,
    availableLengths,
    availableColorCodes,
    isLengthAvailable,
    isColorAvailable,
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
