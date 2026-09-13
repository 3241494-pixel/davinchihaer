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
  alternates: buildLanguageAlternates("/delivery"),
  title: `${ru.pages.delivery.title} | Da Vinchi Hair`,
};
}

export default async function DeliveryPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  const page = await getPageContent("delivery", locale);
  const Content = page?.default;
  const copy = ru.pages.delivery;

  return (
    <ContentPageLayout
      title={copy.title}
      breadcrumbs={[{ label: copy.title }]}
      after={<p className="text-sm text-ink-muted">{copy.todo}</p>}
    >
      {Content && <Content />}
    </ContentPageLayout>
  );
}
