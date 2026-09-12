"use client";

import { cn } from "@/components/ui/cn";
import { useTypedMessages } from "@/i18n/use-messages";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { LOCALES } from "@/i18n/routing";

export function LanguageSwitcher() {
  const ru = useTypedMessages();
  const activeLocale = useLocale();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label={ru.languageSwitcher.label}
      className="inline-flex items-center gap-1 rounded-base border border-border p-0.5"
    >
      {LOCALES.map((locale) => {
        const isActive = locale === activeLocale;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            aria-current={isActive || undefined}
            className={cn(
              "rounded-base px-2 py-1 text-xs font-medium uppercase transition-colors duration-200",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
              isActive ? "bg-ink text-bg" : "text-ink-muted hover:text-ink-strong",
            )}
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}
