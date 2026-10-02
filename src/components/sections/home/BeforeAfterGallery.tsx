import { Link } from "@/i18n/navigation";
import { publicImageExists } from "@/lib/image-exists";
import { getTypedMessages } from "@/i18n/get-messages";
import { BeforeAfterLightbox } from "./BeforeAfterLightbox";

const SLOTS = 6;

function slotPaths(): string[] {
  return Array.from({ length: SLOTS }, (_, index) => `/images/gallery/before-after-${index + 1}.jpg`);
}

/**
 * Пока фото «до/после» нет (TODO_CLIENT), секцию на главной не показываем:
 * шесть серых заглушек выглядят как недоделка. Появится сама с первым фото.
 */
export function hasBeforeAfterPhotos(): boolean {
  return slotPaths().some((src) => publicImageExists(src));
}

export async function BeforeAfterGallery() {
  const ru = await getTypedMessages();
  const images = slotPaths().map((src) => ({ src, alt: ru.home.gallery.heading, exists: publicImageExists(src) }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-[32px] leading-tight md:text-[44px] text-ink-strong">{ru.home.gallery.heading}</h2>
        <Link
          href="/gallery"
          className="text-sm font-medium text-ink underline-offset-4 hover:underline"
        >
          {ru.home.gallery.cta}
        </Link>
      </div>
      <p className="text-sm text-ink-muted">{ru.home.gallery.note}</p>
      <BeforeAfterLightbox images={images} />
    </div>
  );
}
