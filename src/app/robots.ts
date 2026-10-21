import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

/**
 * Пока siteConfig.indexable = false, страницы закрыты через noindex, а не
 * через Disallow: поисковик должен видеть запрет на самих страницах.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/ru/dev/", "/en/dev/", "/ka/dev/"],
    },
    ...(siteConfig.indexable
      ? { sitemap: new URL("/sitemap.xml", siteConfig.url).toString() }
      : {}),
  };
}
