"use client";

import Image from "next/image";
import { useRef, useState, type UIEvent } from "react";
import { cn } from "@/components/ui/cn";
import { Modal } from "@/components/ui/Modal";
import { Video } from "@/components/ui/Video";
import {
  IconArrowLeft,
  IconArrowRight,
  IconPlay,
  IconZoomIn,
} from "@/components/ui/icons";
import { IMAGES } from "@/content/images";
import { VIDEOS, type VideoKey } from "@/content/videos";
import { formatMessage } from "@/lib/format-message";
import { useTypedMessages } from "@/i18n/use-messages";

export interface GalleryImage {
  src: string;
  alt: string;
  exists: boolean;
}

export interface GalleryVideo {
  name: VideoKey;
  label: string;
}

export interface GalleryProps {
  images: GalleryImage[];
  placeholderLabel: string;
  /** Ролик вторым слайдом: в карусели на мобильном и в сетке на десктопе. */
  video?: GalleryVideo;
}

type Slide =
  | ({ kind: "image"; photoIndex: number } & GalleryImage)
  | ({ kind: "video" } & GalleryVideo);

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="flex size-full items-center justify-center bg-surface-alt px-4 text-center text-xs text-ink-muted">
      {label}
    </div>
  );
}

export function Gallery({ images, placeholderLabel, video }: GalleryProps) {
  const ru = useTypedMessages();
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const photos =
    images.length > 0
      ? images
      : [{ src: "", alt: placeholderLabel, exists: false }];
  const imageSlides: Slide[] = photos.map((image, photoIndex) => ({
    kind: "image",
    photoIndex,
    ...image,
  }));
  const slides: Slide[] = video
    ? [imageSlides[0], { kind: "video", ...video }, ...imageSlides.slice(1)]
    : imageSlides;
  // Увеличение работает только для фото: модалка листает photos, без ролика.

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

  function renderSlide(slide: Slide, index: number, sizes: string) {
    if (slide.kind === "video") {
      return (
        <Video
          name={slide.name}
          label={slide.label}
          aspectClass="aspect-[3/4]"
          className="size-full"
        />
      );
    }
    return (
      <button
        type="button"
        onClick={() => setZoomIndex(slide.photoIndex)}
        aria-label={ru.product.gallery.zoomLabel}
        className="group/zoom relative block size-full cursor-zoom-in"
      >
        {slide.exists ? (
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes={sizes}
            priority={index === 0}
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder label={placeholderLabel} />
        )}
        <span className="absolute right-3 bottom-3 inline-flex size-9 items-center justify-center rounded-full bg-bg/90 text-ink opacity-100 transition-opacity duration-200 lg:opacity-0 lg:group-hover/zoom:opacity-100">
          <IconZoomIn className="size-4" />
        </span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Мобильный и планшет: карусель со свайпом и миниатюрами. */}
      <div className="flex flex-col gap-3 lg:hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto"
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative aspect-[3/4] w-full shrink-0 snap-center bg-surface-alt"
            >
              {renderSlide(slide, index, "100vw")}
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {slides.map((slide, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={formatMessage(ru.product.gallery.thumbnailAlt, {
                  index: index + 1,
                })}
                aria-current={activeIndex === index}
                className={cn(
                  "relative size-16 shrink-0 overflow-hidden border transition-colors duration-200",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
                  activeIndex === index
                    ? "border-ink-strong"
                    : "border-transparent",
                )}
              >
                {slide.kind === "video" ? (
                  <>
                    <Image
                      src={IMAGES[VIDEOS[slide.name].poster].path}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-ink/30 text-bg">
                      <IconPlay className="size-5" />
                    </span>
                  </>
                ) : slide.exists ? (
                  <Image
                    src={slide.src}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <ImagePlaceholder label="" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Десктоп: редакционная сетка, первый кадр во всю ширину, остальные парами. */}
      <div className="hidden grid-cols-2 gap-3 lg:grid">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "relative aspect-[3/4] overflow-hidden bg-surface-alt",
              index === 0 && "col-span-2",
            )}
          >
            {renderSlide(slide, index, index === 0 ? "55vw" : "28vw")}
          </div>
        ))}
      </div>

      <Modal open={zoomIndex !== null} onClose={() => setZoomIndex(null)}>
        {zoomIndex !== null && (
          <div className="relative flex aspect-[3/4] w-full items-center justify-center bg-surface-alt sm:aspect-square">
            {photos[zoomIndex].exists ? (
              <Image
                src={photos[zoomIndex].src}
                alt={photos[zoomIndex].alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            ) : (
              <ImagePlaceholder label={placeholderLabel} />
            )}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label={ru.product.gallery.prev}
                  onClick={() =>
                    setZoomIndex((i) =>
                      i === null ? i : (i - 1 + photos.length) % photos.length,
                    )
                  }
                  className="absolute top-1/2 left-2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-bg/90 text-ink"
                >
                  <IconArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={ru.product.gallery.next}
                  onClick={() =>
                    setZoomIndex((i) =>
                      i === null ? i : (i + 1) % photos.length,
                    )
                  }
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
