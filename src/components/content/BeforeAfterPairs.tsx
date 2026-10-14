"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/components/ui/cn";
import { CompareSlider } from "./CompareSlider";

export interface RenderedPair {
  id: string;
  before: ReactNode;
  after: ReactNode;
  caption: string;
}

export interface BeforeAfterPairsProps {
  pairs: RenderedPair[];
  beforeLabel: string;
  afterLabel: string;
  sliderLabel: string;
  /** Подпись кнопок выбора пары, {index} — номер. */
  pairLabel: string;
  tone?: "light" | "dark";
}

/** Слайдер сравнения и, если пар несколько, номера для переключения между ними. */
export function BeforeAfterPairs({
  pairs,
  beforeLabel,
  afterLabel,
  sliderLabel,
  pairLabel,
  tone = "dark",
}: BeforeAfterPairsProps) {
  const [active, setActive] = useState(0);
  const pair = pairs[active];
  if (!pair) return null;
  const dark = tone === "dark";

  return (
    <figure className="flex flex-col gap-4">
      <CompareSlider
        key={pair.id}
        before={pair.before}
        after={pair.after}
        beforeLabel={beforeLabel}
        afterLabel={afterLabel}
        sliderLabel={sliderLabel}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <figcaption
          className={cn("text-sm", dark ? "text-bg/70" : "text-ink-muted")}
        >
          {pair.caption}
        </figcaption>
        {pairs.length > 1 && (
          <div className="flex gap-2">
            {pairs.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                aria-label={pairLabel.replace("{index}", String(index + 1))}
                aria-pressed={index === active}
                className={cn(
                  "caps inline-flex size-9 items-center justify-center border text-[12px] transition-colors duration-200",
                  dark
                    ? index === active
                      ? "border-bg bg-bg text-ink"
                      : "border-bg/40 text-bg hover:border-bg"
                    : index === active
                      ? "border-ink bg-ink text-bg"
                      : "border-border text-ink hover:border-ink",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        )}
      </div>
    </figure>
  );
}
