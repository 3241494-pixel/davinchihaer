import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { GalleryFilter } from "@/components/content/GalleryFilter";
import { publicImageExists } from "@/lib/image-exists";
import { ru } from "@/i18n/messages";
import type { ProductCategory } from "@/lib/content/types";

export const metadata: Metadata = {
  title: `${ru.pages.gallery.title} | Da Vinchi Hair`,
  description: ru.pages.gallery.description,
};

const TECHNIQUE_KEYS: ProductCategory[] = ["tape-classic", "tape-imitation-1", "tape-imitation-2"];
const ITEMS_PER_TECHNIQUE = 3;

export default function GalleryPage() {
  const techniques = TECHNIQUE_KEYS.map((value) => ({ value, label: ru.categories[value] }));

  const items = TECHNIQUE_KEYS.flatMap((technique) =>
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
