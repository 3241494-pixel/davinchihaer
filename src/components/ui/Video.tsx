"use client";

import { useEffect, useRef } from "react";
import { IMAGES } from "@/content/images";
import { VIDEOS, type VideoKey } from "@/content/videos";
import { cn } from "./cn";

export interface VideoProps {
  name: VideoKey;
  /** Подпись для скринридеров; берётся из alt постера, если не передана. */
  label: string;
  className?: string;
  /** Для hero: начинаем грузить сразу, а не при приближении к экрану. */
  priority?: boolean;
  /** Tailwind-класс соотношения сторон; по умолчанию вертикальное 9:16. */
  aspectClass?: string;
}

/**
 * Короткий ролик без звука: muted, loop, playsinline, постер-кадр.
 * Грузится и играет только в зоне видимости; при prefers-reduced-motion
 * остаётся постер, без автопроигрывания.
 */
export function Video({ name, label, className, priority, aspectClass = "aspect-[9/16]" }: VideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const entry = VIDEOS[name];
  const poster = IMAGES[entry.poster].path;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([item]) => {
        if (item.isIntersecting) {
          if (video.preload === "none") video.preload = "auto";
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={cn(aspectClass, "w-full bg-surface-alt object-cover", className)}
      src={entry.src}
      poster={poster}
      muted
      loop
      playsInline
      preload={priority ? "auto" : "none"}
      aria-label={label}
    />
  );
}
