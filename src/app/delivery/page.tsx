import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { getPageContent } from "@/lib/content/pages";
import { ru } from "@/i18n/messages";

export const metadata: Metadata = {
  title: `${ru.pages.delivery.title} | Da Vinchi Hair`,
};

export default async function DeliveryPage() {
  const page = await getPageContent("delivery");
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
