"use client";

import Image from "next/image";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { IconZoomIn } from "@/components/ui/icons";
import { useTypedMessages } from "@/i18n/use-messages";

export interface BeforeAfterImage {
  src: string;
  alt: string;
  exists: boolean;
}

export function BeforeAfterLightbox({ images }: { images: BeforeAfterImage[] }) {
  const ru = useTypedMessages();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={ru.product.gallery.zoomLabel}
            className="relative aspect-square overflow-hidden rounded-base border border-border bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
          >
            {image.exists ? (
              <Image src={image.src} alt={image.alt} fill sizes="33vw" className="object-cover" />
            ) : (
              <span className="flex size-full items-center justify-center px-2 text-center text-xs text-ink-muted">
                {image.alt}
              </span>
            )}
            <span className="absolute right-2 bottom-2 inline-flex size-8 items-center justify-center rounded-full bg-bg/90 text-ink">
              <IconZoomIn className="size-4" />
            </span>
          </button>
        ))}
      </div>

      <Modal open={openIndex !== null} onClose={() => setOpenIndex(null)}>
        {openIndex !== null && (
          <div className="relative flex aspect-square w-full items-center justify-center bg-surface-alt">
            {images[openIndex].exists ? (
              <Image
                src={images[openIndex].src}
                alt={images[openIndex].alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            ) : (
              <span className="px-6 text-center text-sm text-ink-muted">{images[openIndex].alt}</span>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
