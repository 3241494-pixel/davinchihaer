import { cn } from "@/components/ui/cn";
import { ru } from "@/i18n/messages";

const LOCALES = ["ru", "en", "ka"] as const;

/**
 * Заглушка переключателя языка — заработает на этапе 9 (next-intl + [locale]).
 * Сейчас активна только ru, остальные визуально отключены.
 */
export function LanguageSwitcher() {
  return (
    <div
      role="group"
      aria-label={ru.languageSwitcher.label}
      className="inline-flex items-center gap-1 rounded-base border border-border p-0.5"
    >
      {LOCALES.map((locale) => {
        const isActive = locale === "ru";
        return (
          <button
            key={locale}
            type="button"
            disabled={!isActive}
            aria-current={isActive || undefined}
            title={isActive ? undefined : ru.languageSwitcher.unavailable}
            className={cn(
              "rounded-base px-2 py-1 text-xs font-medium uppercase transition-colors duration-200",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
              isActive
                ? "bg-ink text-bg"
                : "text-ink-muted disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {locale}
          </button>
        );
      })}
    </div>
  );
}
