import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
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
  alternates: buildLanguageAlternates("/terms"),
  title: `${ru.pages.legal.terms.title} | Da Vinchi Hair`,
};
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  const page = await getPageContent("terms", locale);
  const Content = page?.default;

  return (
    <ContentPageLayout
      title={ru.pages.legal.terms.title}
      breadcrumbs={[{ label: ru.pages.legal.terms.title }]}
    >
      <div className="mb-6 flex items-start gap-2">
        <Badge variant="outline" tone="danger">
          TODO_CLIENT
        </Badge>
        <p className="text-sm text-ink-muted">{ru.pages.legal.disclaimer}</p>
      </div>
      {Content && <Content />}
    </ContentPageLayout>
  );
}
