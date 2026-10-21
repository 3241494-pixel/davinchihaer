import type { ComponentType } from "react";
import type { Locale } from "@/i18n/routing";

export interface PageMeta {
  title: string;
  description: string;
}

export interface PageMdxModule {
  default: ComponentType<Record<string, unknown>>;
  meta?: PageMeta;
}

/**
 * Статические import() на конкретные MDX-файлы — так webpack корректно
 * код-сплитит каждую страницу. Ключ — тот же slug, что и в src/app/**.
 */
const loaders: Record<string, () => Promise<PageMdxModule>> = {
  "technology/tape-in": () =>
    import("../../../content/pages/technology/tape-in.mdx"),
  "technology/imitation": () =>
    import("../../../content/pages/technology/imitation.mdx"),
  "technology/bio-tape": () =>
    import("../../../content/pages/technology/bio-tape.mdx"),
  "technology/ring-star": () =>
    import("../../../content/pages/technology/ring-star.mdx"),
  "guides/color-match": () =>
    import("../../../content/pages/guides/color-match.mdx"),
  "guides/choose-length": () =>
    import("../../../content/pages/guides/choose-length.mdx"),
  "guides/self-correction": () =>
    import("../../../content/pages/guides/self-correction.mdx"),
  care: () => import("../../../content/pages/care.mdx"),
  about: () => import("../../../content/pages/about.mdx"),
  "en/about": () => import("../../../content/pages/en/about.mdx"),
  "ka/about": () => import("../../../content/pages/ka/about.mdx"),
  "en/care": () => import("../../../content/pages/en/care.mdx"),
  "en/guides/choose-length": () =>
    import("../../../content/pages/en/guides/choose-length.mdx"),
  "en/guides/self-correction": () =>
    import("../../../content/pages/en/guides/self-correction.mdx"),
  "en/technology/tape-in": () =>
    import("../../../content/pages/en/technology/tape-in.mdx"),
  "en/technology/imitation": () =>
    import("../../../content/pages/en/technology/imitation.mdx"),
  "en/technology/bio-tape": () =>
    import("../../../content/pages/en/technology/bio-tape.mdx"),
  "ka/care": () => import("../../../content/pages/ka/care.mdx"),
  "ka/guides/choose-length": () =>
    import("../../../content/pages/ka/guides/choose-length.mdx"),
  "ka/guides/self-correction": () =>
    import("../../../content/pages/ka/guides/self-correction.mdx"),
  "ka/technology/tape-in": () =>
    import("../../../content/pages/ka/technology/tape-in.mdx"),
  "ka/technology/imitation": () =>
    import("../../../content/pages/ka/technology/imitation.mdx"),
  "ka/technology/bio-tape": () =>
    import("../../../content/pages/ka/technology/bio-tape.mdx"),
  delivery: () => import("../../../content/pages/delivery.mdx"),
  privacy: () => import("../../../content/pages/privacy.mdx"),
  terms: () => import("../../../content/pages/terms.mdx"),
};

/**
 * Ключи без префикса — ru-контент. Перевод страницы регистрируется под ключом
 * `${locale}/${slug}` (переведены about, care, technology/* кроме ring-star,
 * guides/choose-length и guides/self-correction); для остальных страниц
 * используется фолбэк на ru.
 */
export async function getPageContent(
  slug: string,
  locale: Locale = "ru",
): Promise<PageMdxModule | undefined> {
  const localizedLoader =
    locale !== "ru" ? loaders[`${locale}/${slug}`] : undefined;
  const loader = localizedLoader ?? loaders[slug];
  if (!loader) return undefined;
  return loader();
}
