import "./globals.css";

/**
 * Корневой layout только пропускает children. html/body рендерит
 * src/app/[locale]/layout.tsx с lang текущей локали, а "/" и общая 404 —
 * свои (src/app/page.tsx, src/app/not-found.tsx). Если рендерить html и здесь,
 * на каждой странице окажется два <html>, и браузер с поисковиком возьмут
 * lang="ru" от внешнего даже на en и ka.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
