import { defineRouting } from "next-intl/routing";

export const LOCALES = ["ru", "en", "ka"] as const;
export const DEFAULT_LOCALE = "ru" as const;
export type Locale = (typeof LOCALES)[number];

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  // ru живёт на "/", без префикса — стабильные URL, без редиректа с корня.
  localePrefix: "as-needed",
});

// Типизирует useLocale()/getLocale() как Locale вместо string по всему проекту.
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
  }
}
