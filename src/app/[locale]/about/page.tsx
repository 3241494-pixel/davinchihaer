import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
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
        <div className="flex flex-col gap-6 border-t border-border pt-10">
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl text-ink-strong">{copy.historyHeading}</h2>
            <p className="text-sm text-ink-muted">{copy.historyTodo}</p>
          </div>
          <p className="text-sm text-ink-muted">{copy.photoTodo}</p>
        </div>
      }
    >
      {Content && <Content />}
    </ContentPageLayout>
  );
}
