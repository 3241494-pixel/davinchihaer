import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { IMAGES } from "@/content/images";
import { pickLocale } from "@/lib/content/locale";
import { getTypedMessages } from "@/i18n/get-messages";
import { buildLanguageAlternates } from "@/i18n/alternates";
import type { CatalogSection } from "@/lib/content/types";
import type { Locale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: Locale }> };

const SECTIONS: { section: CatalogSection; image: "tapeAshBlonde" | "tapeRed" }[] = [
  { section: "hair", image: "tapeAshBlonde" },
  { section: "materials", image: "tapeRed" },
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  return {
    title: `${ru.catalog.heading} | Da Vinchi Hair`,
    description: ru.catalog.hubDescription,
    alternates: buildLanguageAlternates("/catalog"),
  };
}

export default async function CatalogPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();

  return (
    <Container className="pb-16">
      <header className="flex flex-col gap-4 py-8 md:py-12">
        <h1 className="font-heading text-4xl text-ink-strong">{ru.catalog.heading}</h1>
        <p className="max-w-3xl text-base text-ink-muted">{ru.catalog.hubDescription}</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-6">
        {SECTIONS.map(({ section, image }) => (
          <Link
            key={section}
            href={`/catalog/${section}`}
            className="group flex flex-col gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
          >
            <Media
              path={image}
              alt={pickLocale(IMAGES[image].alt, locale)}
              aspect="4/5"
              sizes="(min-width: 640px) 50vw, 100vw"
              className="bg-surface"
            />
            <span className="text-sm font-medium tracking-[0.08em] text-ink uppercase group-hover:underline">
              {ru.catalogSections[section]}
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
