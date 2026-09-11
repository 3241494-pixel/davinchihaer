import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TelegramFloatingButton } from "@/components/layout/TelegramFloatingButton";
import { ru } from "@/i18n/messages";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Da Vinchi Hair",
  description: "Волосы и системы для ленточного наращивания Tape-In",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${cormorant.variable} ${inter.variable} antialiased`}>
        <a
          href="#main-content"
          className="fixed top-2 left-2 z-50 -translate-y-16 rounded-base bg-ink px-4 py-2 text-sm font-medium text-bg transition-transform duration-200 focus:translate-y-0"
        >
          {ru.common.skipToContent}
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <TelegramFloatingButton />
      </body>
    </html>
  );
}
