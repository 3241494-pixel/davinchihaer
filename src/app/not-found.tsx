import type { Metadata } from "next";
import { LOCALES } from "@/i18n/routing";
import { MESSAGES_BY_LOCALE } from "@/i18n/request";

export const metadata: Metadata = {
  title: "404 | Da Vinchi Hair",
};

/**
 * Общая 404 для адресов вне локалей (Cloudflare Pages отдаёт её как 404.html).
 * Язык адреса неизвестен, поэтому ссылка на главную — на всех трёх языках.
 */
export default function NotFound() {
  return (
    <html lang="ru">
      <body className="bg-bg font-sans text-ink antialiased">
        <main className="mx-auto flex min-h-svh max-w-xl flex-col justify-center gap-8 px-4 py-16">
          <p className="font-heading text-6xl text-ink-strong">404</p>
          <ul className="flex flex-col gap-4">
            {LOCALES.map((locale) => {
              const copy = MESSAGES_BY_LOCALE[locale].notFound;
              return (
                <li key={locale} lang={locale} className="flex flex-col gap-1">
                  <span className="text-lg text-ink-strong">{copy.title}</span>
                  <a
                    href={`/${locale}/`}
                    className="self-start text-ink-muted underline underline-offset-4 hover:text-ink"
                  >
                    {copy.link}
                  </a>
                </li>
              );
            })}
          </ul>
        </main>
      </body>
    </html>
  );
}
