"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/components/ui/cn";
import { Modal } from "@/components/ui/Modal";
import { IconZoomIn } from "@/components/ui/icons";
import { ru } from "@/i18n/messages";

export interface GalleryTechnique {
  value: string;
  label: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  exists: boolean;
  technique: string;
}

export interface GalleryFilterProps {
  techniques: GalleryTechnique[];
  items: GalleryItem[];
}

export function GalleryFilter({ techniques, items }: GalleryFilterProps) {
  const [activeTechnique, setActiveTechnique] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visibleItems = useMemo(
    () => (activeTechnique ? items.filter((item) => item.technique === activeTechnique) : items),
    [items, activeTechnique],
  );

  return (
    <div className="flex flex-col gap-6">
      <div
        role="group"
        aria-label={ru.pages.gallery.filterLabel}
        className="flex flex-wrap gap-2"
      >
        <button
          type="button"
          aria-pressed={activeTechnique === null}
          onClick={() => setActiveTechnique(null)}
          className={cn(
            "rounded-base border px-3 py-1.5 text-sm font-medium transition-colors duration-200",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
            activeTechnique === null
              ? "border-ink bg-ink text-bg"
              : "border-border bg-bg text-ink hover:border-ink-strong",
          )}
        >
          {ru.pages.gallery.filterAll}
        </button>
        {techniques.map((technique) => (
          <button
            key={technique.value}
            type="button"
            aria-pressed={activeTechnique === technique.value}
            onClick={() => setActiveTechnique(technique.value)}
            className={cn(
              "rounded-base border px-3 py-1.5 text-sm font-medium transition-colors duration-200",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
              activeTechnique === technique.value
                ? "border-ink bg-ink text-bg"
                : "border-border bg-bg text-ink hover:border-ink-strong",
            )}
          >
            {technique.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visibleItems.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={ru.product.gallery.zoomLabel}
            className="relative aspect-square overflow-hidden rounded-base border border-border bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
          >
            {item.exists ? (
              <Image src={item.src} alt={item.alt} fill sizes="25vw" className="object-cover" />
            ) : (
              <span className="flex size-full items-center justify-center px-2 text-center text-xs text-ink-muted">
                {item.alt}
              </span>
            )}
            <span className="absolute right-2 bottom-2 inline-flex size-8 items-center justify-center rounded-full bg-bg/90 text-ink">
              <IconZoomIn className="size-4" />
            </span>
          </button>
        ))}
      </div>

      <Modal open={openIndex !== null} onClose={() => setOpenIndex(null)}>
        {openIndex !== null && visibleItems[openIndex] && (
          <div className="relative flex aspect-square w-full items-center justify-center bg-surface-alt">
            {visibleItems[openIndex].exists ? (
              <Image
                src={visibleItems[openIndex].src}
                alt={visibleItems[openIndex].alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            ) : (
              <span className="px-6 text-center text-sm text-ink-muted">
                {visibleItems[openIndex].alt}
              </span>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
