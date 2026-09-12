import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { getPageContent } from "@/lib/content/pages";
import { ru } from "@/i18n/messages";

export const metadata: Metadata = {
  title: `${ru.pages.legal.terms.title} | Da Vinchi Hair`,
};

export default async function TermsPage() {
  const page = await getPageContent("terms");
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
