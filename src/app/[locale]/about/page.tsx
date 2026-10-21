import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { FounderQuote } from "@/components/content/FounderQuote";
import { FounderStory } from "@/components/content/FounderStory";
import { getPageContent } from "@/lib/content/pages";
import { setRequestLocale } from "next-intl/server";
import { getTypedMessages } from "@/i18n/get-messages";
import { buildLanguageAlternates } from "@/i18n/alternates";
import type { Locale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  return {
  alternates: buildLanguageAlternates("/about"),
  title: `${ru.pages.about.title} | Da Vinchi Hair`,
  description: ru.pages.about.intro,
};
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  const page = await getPageContent("about", locale);
  const Content = page?.default;
  const copy = ru.pages.about;

  return (
    <ContentPageLayout
      title={copy.title}
      breadcrumbs={[{ label: ru.nav.about }]}
      after={
        <div className="flex flex-col gap-14 border-t border-border pt-10 md:gap-20 md:pt-14">
          <FounderStory locale={locale} />
          <div className="border-t border-border pt-14 md:pt-20">
            <FounderQuote />
          </div>
        </div>
      }
    >
      {Content && <Content />}
    </ContentPageLayout>
  );
}
