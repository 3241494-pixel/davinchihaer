import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { GalleryFilter } from "@/components/content/GalleryFilter";
import { VideoStrip } from "@/components/content/VideoStrip";
import { publicImageExists } from "@/lib/image-exists";
import { getTypedMessages } from "@/i18n/get-messages";
import { setRequestLocale } from "next-intl/server";
import type { AttachmentType } from "@/lib/content/types";
import { buildLanguageAlternates } from "@/i18n/alternates";
import { IMAGES } from "@/content/images";
import { pickLocale } from "@/lib/content/locale";
import type { Locale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  return {
  alternates: buildLanguageAlternates("/gallery"),
  title: `${ru.pages.gallery.title} | Da Vinchi Hair`,
  description: ru.pages.gallery.description,
};
}

const TECHNIQUE_KEYS: AttachmentType[] = [
  "tape-classic",
  "imitation-1",
  "imitation-2",
  "bio-tape",
  "ring-star",
];
/** Фото из комплекта клиента по каждой технике (public/images/technology). */
const TECHNIQUE_PHOTOS: Record<AttachmentType, string[]> = {
  "tape-classic": ["classic-1", "classic-2", "classic-3", "classic-4"],
  "imitation-1": ["imitation-1-1", "imitation-1-2", "imitation-1-3", "imitation-1-4", "imitation-1-5"],
  "imitation-2": ["imitation-2-1", "imitation-2-3"],
  "bio-tape": ["bio-1", "bio-2"],
  "ring-star": ["ringstar-1", "ringstar-2", "ringstar-3", "ringstar-4", "ringstar-5"],
};

const FEATURED_KEYS = ["longHairBrunette", "weftClipsBrunette"] as const;

export default async function GalleryPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  const techniques = TECHNIQUE_KEYS.map((value) => ({ value, label: ru.attachments[value] }));

  // Реальные фото пока не разбиты по технике — только 2 штуки, оба «gallery-only»
  // (см. CLAUDE.md, «Изображения»). Отдельная technique-метка "featured" держит
  // их вне фильтров по конкретной технике, но видимыми во вкладке «Все».
  const featured = FEATURED_KEYS.map((key) => ({
    src: IMAGES[key].path,
    alt: pickLocale(IMAGES[key].alt, locale),
    exists: true,
    technique: "featured",
  }));

  const techniquePhotos = TECHNIQUE_KEYS.flatMap((technique) =>
    TECHNIQUE_PHOTOS[technique].map((name) => {
      const src = `/images/technology/${name}.webp`;
      return {
        src,
        alt: ru.attachments[technique],
        exists: publicImageExists(src),
        technique,
      };
    }),
  );

  const items = [...techniquePhotos, ...featured];

  return (
    <ContentPageLayout
      title={ru.pages.gallery.title}
      description={ru.pages.gallery.description}
      breadcrumbs={[{ label: ru.pages.gallery.title }]}
      wide={
        <div className="flex flex-col gap-4">
          <GalleryFilter techniques={techniques} items={items} />
          <VideoStrip names={["darkPiece1", "darkPiece2", "bio2"]} locale={locale} />
          <p className="text-sm text-ink-muted">{ru.pages.gallery.note}</p>
        </div>
      }
    />
  );
}
