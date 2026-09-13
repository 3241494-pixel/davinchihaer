import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { Card } from "@/components/ui/Card";
import { getTypedMessages } from "@/i18n/get-messages";
import { setRequestLocale } from "next-intl/server";
import { buildLanguageAlternates } from "@/i18n/alternates";
import type { Locale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  return {
  alternates: buildLanguageAlternates("/guides"),
  title: `${ru.pages.guides.hub.title} | Da Vinchi Hair`,
  description: ru.pages.guides.hub.description,
};
}

export default async function GuidesHubPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  return (
    <ContentPageLayout
      title={ru.pages.guides.hub.title}
      description={ru.pages.guides.hub.description}
      breadcrumbs={[{ label: ru.nav.guides }]}
      wide={
        <div className="grid gap-4 sm:grid-cols-3">
          {ru.pages.guides.hub.items.map((item) => (
            <Card key={item.href} className="flex flex-col gap-3">
              <h2 className="font-heading text-xl text-ink-strong">{item.title}</h2>
              <p className="text-sm text-ink-muted">{item.description}</p>
              <Link
                href={item.href}
                className="mt-auto text-sm font-medium text-ink underline-offset-4 hover:underline"
              >
                {ru.home.techniques.linkLabel}
              </Link>
            </Card>
          ))}
        </div>
      }
    />
  );
}
