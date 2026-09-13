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
  alternates: buildLanguageAlternates("/guides/choose-length"),
  title: `${ru.pages.guides.chooseLength.title} | Da Vinchi Hair`,
  description: ru.pages.guides.chooseLength.description,
};
}

export default async function ChooseLengthPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  const page = await getPageContent("guides/choose-length", locale);
  const Content = page?.default;
  const copy = ru.pages.guides.chooseLength;

  return (
    <ContentPageLayout
      title={copy.title}
      description={copy.description}
      breadcrumbs={[
        { label: ru.nav.guides, href: "/guides" },
        { label: copy.title },
      ]}
      after={
        <div className="flex flex-col gap-4 border-t border-border pt-10">
          <h2 className="font-heading text-2xl text-ink-strong">{copy.tableHeading}</h2>
          <div className="overflow-x-auto">
            <table className="w-full max-w-xl border-collapse text-left text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="px-3 py-2 font-medium text-ink-strong">{copy.table.volumeHeader}</th>
                  <th className="px-3 py-2 font-medium text-ink-strong">{copy.table.tapesHeader}</th>
                </tr>
              </thead>
              <tbody>
                {copy.table.rows.map((row) => (
                  <tr key={row.volume} className="border-b border-border">
                    <th scope="row" className="px-3 py-2 font-medium text-ink-strong">
                      {row.volume}
                    </th>
                    <td className="px-3 py-2 text-ink-muted">{row.tapes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink-muted">{copy.disclaimer}</p>
        </div>
      }
    >
      {Content && <Content />}
    </ContentPageLayout>
  );
}
