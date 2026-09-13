import type { Metadata } from "next";
import "./globals.css";

/**
 * Отдельный root layout только для "/" (см. src/app/page.tsx). Все остальные
 * маршруты живут под src/app/[locale]/layout.tsx со своим html/body.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
