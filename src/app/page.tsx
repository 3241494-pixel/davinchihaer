import type { Metadata } from "next";
import { DEFAULT_LOCALE } from "@/i18n/routing";

/**
 * Хостинг без поддержки public/_redirects (см. корневой _redirects для
 * Cloudflare Pages) всё равно должен уводить с "/" на локаль по умолчанию —
 * отсюда meta-refresh и клиентский переход на случай, если оба не сработают.
 * Сама эта страница в поиск не попадает.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

const target = `/${DEFAULT_LOCALE}/`;

export default function RootPage() {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `location.replace(${JSON.stringify(target)});`,
          }}
        />
        <p>
          Redirecting to <a href={target}>{target}</a>…
        </p>
      </body>
    </html>
  );
}
