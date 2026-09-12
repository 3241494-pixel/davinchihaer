import type { I18nString, Locale } from "./types";

/**
 * Незавершённый перевод в content/ помечается строкой, начинающейся с
 * TODO_CLIENT (см. CLAUDE.md, правило №2) — такое значение не должно
 * попадать на экран, поэтому считается отсутствующим переводом.
 */
function isTranslated(value: string): boolean {
  return value.trim().length > 0 && !value.startsWith("TODO_CLIENT");
}

/** Выбор локализованной строки из контента с фолбэком на ru, если перевода нет. */
export function pickLocale(value: I18nString, locale: Locale): string {
  if (locale === "ru") return value.ru;
  const translated = value[locale];
  return isTranslated(translated) ? translated : value.ru;
}
