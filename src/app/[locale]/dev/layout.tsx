import type { Metadata } from "next";

/** Служебные страницы дизайн-системы: открыты по ссылке, но не для поиска. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DevLayout({ children }: { children: React.ReactNode }) {
  return children;
}
