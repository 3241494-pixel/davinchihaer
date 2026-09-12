import type { Metadata } from "next";
import { getPathname } from "./navigation";
import { LOCALES, DEFAULT_LOCALE } from "./routing";

/**
 * hreflang-альтернативы для конкретного пути (без локали), плюс x-default на ru.
 * Пока применяется на уровне layout (корректно для "/"): для остальных страниц —
 * см. заметку в ответе по этапу 9, доведение до каждой страницы — этап 10.
 */
export function buildLanguageAlternates(pathname: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};

  for (const locale of LOCALES) {
    languages[locale] = getPathname({ locale, href: pathname });
  }
  languages["x-default"] = getPathname({ locale: DEFAULT_LOCALE, href: pathname });

  return { languages };
}
