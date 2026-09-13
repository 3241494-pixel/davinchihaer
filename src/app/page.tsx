import type { Metadata } from "next";
import { DEFAULT_LOCALE } from "@/i18n/routing";

/**
 * Хостинг без поддержки public/_redirects (см. корневой _redirects для
 * Cloudflare Pages) всё равно должен уводить с "/" на локаль по умолчанию —
 * отсюда meta-refresh и клиентский переход на случай, если оба не сработают.
 */
export const metadata: Metadata = {
  alternates: { canonical: `/${DEFAULT_LOCALE}` },
};

export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=/${DEFAULT_LOCALE}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `location.replace(${JSON.stringify(`/${DEFAULT_LOCALE}`)});`,
        }}
      />
      <p>
        Redirecting to <a href={`/${DEFAULT_LOCALE}`}>/{DEFAULT_LOCALE}</a>…
      </p>
    </>
  );
}
