import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Cormorant_Garamond, Inter, Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TelegramFloatingButton } from "@/components/layout/TelegramFloatingButton";
import { getTypedMessages } from "@/i18n/get-messages";
import { buildLanguageAlternates } from "@/i18n/alternates";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSerifGeorgian = Noto_Serif_Georgian({
  variable: "--font-noto-serif-ka",
  subsets: ["georgian"],
  weight: ["400", "500", "600", "700"],
});

const notoSansGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-sans-ka",
  subsets: ["georgian"],
});

const OG_LOCALE: Record<Locale, string> = {
  ru: "ru_RU",
  en: "en_US",
  ka: "ka_GE",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: "Da Vinchi Hair",
      template: "%s | Da Vinchi Hair",
    },
    description: "Волосы и системы для ленточного наращивания Tape-In",
    alternates: buildLanguageAlternates("/"),
    openGraph: {
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      siteName: "Da Vinchi Hair",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getTypedMessages();

  return (
    <html lang={locale} data-locale={locale} className="scroll-smooth">
      <body
        className={`${cormorant.variable} ${inter.variable} ${notoSerifGeorgian.variable} ${notoSansGeorgian.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <a
            href="#main-content"
            className="fixed top-2 left-2 z-50 -translate-y-16 rounded-base bg-ink px-4 py-2 text-sm font-medium text-bg transition-transform duration-200 focus:translate-y-0"
          >
            {messages.common.skipToContent}
          </a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <TelegramFloatingButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
