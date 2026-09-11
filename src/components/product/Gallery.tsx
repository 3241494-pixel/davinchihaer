"use client";

import Image from "next/image";
import { useRef, useState, type UIEvent } from "react";
import { cn } from "@/components/ui/cn";
import { Modal } from "@/components/ui/Modal";
import {
  IconArrowLeft,
  IconArrowRight,
  IconZoomIn,
} from "@/components/ui/icons";
import { formatMessage } from "@/lib/format-message";
import { ru } from "@/i18n/messages";

export interface GalleryImage {
  src: string;
  alt: string;
  exists: boolean;
}

export interface GalleryProps {
  images: GalleryImage[];
  placeholderLabel: string;
}

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="flex size-full items-center justify-center bg-surface-alt px-4 text-center text-xs text-ink-muted">
      {label}
    </div>
  );
}

export function Gallery({ images, placeholderLabel }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const slides = images.length > 0 ? images : [{ src: "", alt: placeholderLabel, exists: false }];

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const el = event.currentTarget;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(Math.min(Math.max(index, 0), slides.length - 1));
  }

  function scrollToIndex(index: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-base border border-border"
      >
        {slides.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setZoomIndex(index)}
            aria-label={ru.product.gallery.zoomLabel}
            className="relative aspect-[3/4] w-full shrink-0 snap-center"
          >
            {image.exists ? (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                priority={index === 0}
                className="object-cover"
              />
            ) : (
              <ImagePlaceholder label={placeholderLabel} />
            )}
            <span className="absolute right-3 bottom-3 inline-flex size-9 items-center justify-center rounded-full bg-bg/90 text-ink">
              <IconZoomIn className="size-4" />
            </span>
          </button>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {slides.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={formatMessage(ru.product.gallery.thumbnailAlt, { index: index + 1 })}
              aria-current={activeIndex === index}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-base border transition-colors duration-200",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
                activeIndex === index ? "border-ink-strong" : "border-border",
              )}
            >
              {image.exists ? (
                <Image src={image.src} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <ImagePlaceholder label="" />
              )}
            </button>
          ))}
        </div>
      )}

      <Modal open={zoomIndex !== null} onClose={() => setZoomIndex(null)}>
        {zoomIndex !== null && (
          <div className="relative flex aspect-[3/4] w-full items-center justify-center bg-surface-alt sm:aspect-square">
            {slides[zoomIndex].exists ? (
              <Image
                src={slides[zoomIndex].src}
                alt={slides[zoomIndex].alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            ) : (
              <ImagePlaceholder label={placeholderLabel} />
            )}
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label={ru.product.gallery.prev}
                  onClick={() => setZoomIndex((i) => (i === null ? i : (i - 1 + slides.length) % slides.length))}
                  className="absolute top-1/2 left-2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-bg/90 text-ink"
                >
                  <IconArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={ru.product.gallery.next}
                  onClick={() => setZoomIndex((i) => (i === null ? i : (i + 1) % slides.length))}
                  className="absolute top-1/2 right-2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-bg/90 text-ink"
                >
                  <IconArrowRight className="size-4" />
                </button>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
