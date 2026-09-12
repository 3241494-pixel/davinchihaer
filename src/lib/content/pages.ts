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
  "technology/tape-in": () => import("../../../content/pages/technology/tape-in.mdx"),
  "technology/imitation": () => import("../../../content/pages/technology/imitation.mdx"),
  "guides/color-match": () => import("../../../content/pages/guides/color-match.mdx"),
  "guides/choose-length": () => import("../../../content/pages/guides/choose-length.mdx"),
  "guides/self-correction": () => import("../../../content/pages/guides/self-correction.mdx"),
  care: () => import("../../../content/pages/care.mdx"),
  about: () => import("../../../content/pages/about.mdx"),
  delivery: () => import("../../../content/pages/delivery.mdx"),
  privacy: () => import("../../../content/pages/privacy.mdx"),
  terms: () => import("../../../content/pages/terms.mdx"),
};

/**
 * Переведённых MDX для en/ka пока нет — все ключи в loaders фактически
 * ru-контент. Когда появится перевод конкретной страницы, зарегистрируйте
 * его под ключом `${locale}/${slug}`; до тех пор всегда используется
 * фолбэк на ru (см. CLAUDE.md, «Деньги»/«TODO_CLIENT»).
 */
export async function getPageContent(
  slug: string,
  locale: Locale = "ru",
): Promise<PageMdxModule | undefined> {
  const localizedLoader = locale !== "ru" ? loaders[`${locale}/${slug}`] : undefined;
  const loader = localizedLoader ?? loaders[slug];
  if (!loader) return undefined;
  return loader();
}
