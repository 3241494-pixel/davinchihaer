import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getPathname } from "@/i18n/navigation";
import { DEFAULT_LOCALE, LOCALES } from "@/i18n/routing";
import { getAllProducts } from "@/lib/content/products";

export const dynamic = "force-static";

/** Все публичные страницы без локали; служебные /dev сюда не входят. */
const STATIC_PATHS = [
  "/",
  "/catalog",
  "/catalog/hair",
  "/catalog/materials",
  "/technology",
  "/technology/tape-in",
  "/technology/imitation",
  "/technology/bio-tape",
  "/technology/ring-star",
  "/guides",
  "/guides/choose-length",
  "/guides/color-match",
  "/guides/self-correction",
  "/care",
  "/academy",
  "/academy/online",
  "/academy/offline",
  "/wholesale",
  "/gallery",
  "/about",
  "/faq",
  "/delivery",
  "/contacts",
  "/privacy",
  "/terms",
];

function absoluteUrl(path: string): string {
  const withSlash = path.endsWith("/") ? path : `${path}/`;
  return new URL(withSlash, siteConfig.url).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_PATHS,
    ...getAllProducts().map((product) => `/product/${product.slug}`),
  ];

  return paths.flatMap((href) => {
    const languages: Record<string, string> = {};
    for (const locale of LOCALES) {
      languages[locale] = absoluteUrl(getPathname({ locale, href }));
    }
    languages["x-default"] = absoluteUrl(
      getPathname({ locale: DEFAULT_LOCALE, href }),
    );

    return LOCALES.map((locale) => ({
      url: absoluteUrl(getPathname({ locale, href })),
      alternates: { languages },
    }));
  });
}
