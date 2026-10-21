import { Video } from "@/components/ui/Video";
import { IMAGES } from "@/content/images";
import { VIDEOS, type VideoKey } from "@/content/videos";
import { pickLocale } from "@/lib/content/locale";
import type { Locale } from "@/i18n/routing";

/** Ряд вертикальных роликов: 2 в ряд на мобильном, до 3 на десктопе. */
export function VideoStrip({ names, locale }: { names: VideoKey[]; locale: Locale }) {
  return (
    <div className="grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6">
      {names.map((name) => (
        <Video
          key={name}
          name={name}
          label={pickLocale(IMAGES[VIDEOS[name].poster].alt, locale)}
          className="rounded-base"
        />
      ))}
    </div>
  );
}
