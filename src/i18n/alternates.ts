import type { Metadata } from "next";
import { getPathname } from "./navigation";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "./routing";

/**
 * canonical на саму страницу в текущей локали и hreflang-альтернативы для
 * того же пути (без локали) во всех языках, плюс x-default на ru. Абсолютные
 * адреса Next собирает из metadataBase (siteConfig.url).
 */
export function buildLanguageAlternates(
  pathname: string,
  locale: Locale,
): Metadata["alternates"] {
  const languages: Record<string, string> = {};

  for (const lang of LOCALES) {
    languages[lang] = getPathname({ locale: lang, href: pathname });
  }
  languages["x-default"] = getPathname({
    locale: DEFAULT_LOCALE,
    href: pathname,
  });

  return { canonical: getPathname({ locale, href: pathname }), languages };
}
