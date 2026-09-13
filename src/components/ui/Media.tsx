import Image from "next/image";
import { IMAGES, type ImageKey } from "@/content/images";
import { getImage, hasImage } from "@/lib/images";
import { cn } from "./cn";

export type MediaAspect = "3/4" | "4/5" | "1/1" | "16/9" | "auto";

const ASPECT_CLASSES: Record<Exclude<MediaAspect, "auto">, string> = {
  "3/4": "aspect-[3/4]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "16/9": "aspect-video",
};

/** Серый прямоугольник 3:4 в цвете --color-surface — см. public/images/placeholder.webp. */
const PLACEHOLDER = {
  src: "/images/placeholder.webp",
  width: 900,
  height: 1200,
} as const;

export interface MediaProps {
  /** Ключ из реестра src/content/images.ts, не путь на диске. */
  path: ImageKey;
  /** Обязателен. Для декоративных изображений передавайте alt="" явно. */
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  aspect?: MediaAspect;
}

function resolveAsset(path: ImageKey) {
  const entry = IMAGES[path];
  if (hasImage(entry.path)) {
    return getImage(entry.path);
  }
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `Media: путь "${entry.path}" для ключа "${path}" отсутствует в blur-data.json — показана заглушка.`,
    );
  }
  return { src: PLACEHOLDER.src, width: PLACEHOLDER.width, height: PLACEHOLDER.height, blurDataURL: undefined };
}

/**
 * Единственная точка вставки изображений на сайте — компоненты не должны
 * импортировать next/image напрямую. Сама подставляет width/height и
 * placeholder="blur" из реестра; при отсутствующем/рассинхронизированном
 * пути показывает заглушку и предупреждает в dev-консоли, не роняя рендер.
 */
export function Media({ path, alt, sizes, priority, className, aspect = "auto" }: MediaProps) {
  const asset = resolveAsset(path);
  const blurProps = asset.blurDataURL
    ? ({ placeholder: "blur", blurDataURL: asset.blurDataURL } as const)
    : {};

  if (aspect === "auto") {
    return (
      <Image
        src={asset.src}
        alt={alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
        {...blurProps}
      />
    );
  }

  return (
    <div className={cn("relative overflow-hidden", ASPECT_CLASSES[aspect], className)}>
      <Image
        src={asset.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        {...blurProps}
      />
    </div>
  );
}
