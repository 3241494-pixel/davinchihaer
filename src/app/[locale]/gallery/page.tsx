import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { GalleryFilter } from "@/components/content/GalleryFilter";
import { publicImageExists } from "@/lib/image-exists";
import { getTypedMessages } from "@/i18n/get-messages";
import { getLocale } from "next-intl/server";
import type { ProductCategory } from "@/lib/content/types";
import { buildLanguageAlternates } from "@/i18n/alternates";
import { IMAGES } from "@/content/images";
import { pickLocale } from "@/lib/content/locale";

export async function generateMetadata(): Promise<Metadata> {
  const ru = await getTypedMessages();
  return {
  alternates: buildLanguageAlternates("/gallery"),
  title: `${ru.pages.gallery.title} | Da Vinchi Hair`,
  description: ru.pages.gallery.description,
};
}

const TECHNIQUE_KEYS: ProductCategory[] = ["tape-classic", "tape-imitation-1", "tape-imitation-2"];
const ITEMS_PER_TECHNIQUE = 3;

const FEATURED_KEYS = ["longHairBrunette", "weftClipsBrunette"] as const;

export default async function GalleryPage() {
  const ru = await getTypedMessages();
  const locale = await getLocale();
  const techniques = TECHNIQUE_KEYS.map((value) => ({ value, label: ru.categories[value] }));

  // Реальные фото пока не разбиты по технике — только 2 штуки, оба «gallery-only»
  // (см. CLAUDE.md, «Изображения»). Отдельная technique-метка "featured" держит
  // их вне фильтров по конкретной технике, но видимыми во вкладке «Все».
  const featured = FEATURED_KEYS.map((key) => ({
    src: IMAGES[key].path,
    alt: pickLocale(IMAGES[key].alt, locale),
    exists: true,
    technique: "featured",
  }));

  const placeholders = TECHNIQUE_KEYS.flatMap((technique) =>
    Array.from({ length: ITEMS_PER_TECHNIQUE }, (_, index) => {
      const src = `/images/gallery/${technique}-${index + 1}.jpg`;
      return {
        src,
        alt: ru.categories[technique],
        exists: publicImageExists(src),
        technique,
      };
    }),
  );

  const items = [...featured, ...placeholders];

  return (
    <ContentPageLayout
      title={ru.pages.gallery.title}
      description={ru.pages.gallery.description}
      breadcrumbs={[{ label: ru.pages.gallery.title }]}
      wide={
        <div className="flex flex-col gap-4">
          <GalleryFilter techniques={techniques} items={items} />
          <p className="text-sm text-ink-muted">{ru.pages.gallery.note}</p>
        </div>
      }
    />
  );
}
