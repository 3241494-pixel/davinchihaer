import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { Media } from "@/components/ui/Media";
import { getPageContent } from "@/lib/content/pages";
import { setRequestLocale } from "next-intl/server";
import { getTypedMessages } from "@/i18n/get-messages";
import { buildLanguageAlternates } from "@/i18n/alternates";
import { IMAGES } from "@/content/images";
import { pickLocale } from "@/lib/content/locale";
import type { Locale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  return {
  alternates: buildLanguageAlternates("/technology/imitation"),
  title: `${ru.pages.technology.imitation.title} | Da Vinchi Hair`,
  description: ru.pages.technology.imitation.description,
};
}

export default async function ImitationPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  const page = await getPageContent("technology/imitation", locale);
  const Content = page?.default;
  const { comparisonHeading, comparisonTable, whoFitsHeading, whoFits } =
    ru.pages.technology.imitation;

  return (
    <ContentPageLayout
      title={ru.pages.technology.imitation.title}
      description={ru.pages.technology.imitation.description}
      breadcrumbs={[
        { label: ru.nav.technology, href: "/technology" },
        { label: ru.pages.technology.imitation.title },
      ]}
      wide={
        <Media
          path="tapeAttachmentCloseup"
          alt={pickLocale(IMAGES.tapeAttachmentCloseup.alt, locale)}
          aspect="16/9"
          sizes="(min-width: 1024px) 960px, 100vw"
          className="rounded-base bg-ink-strong"
        />
      }
      after={
        <div className="flex flex-col gap-10 border-t border-border pt-10">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl text-ink-strong">{comparisonHeading}</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="px-3 py-2 font-medium text-ink-strong">
                      {comparisonTable.featureHeader}
                    </th>
                    <th className="px-3 py-2 font-medium text-ink-strong">
                      {comparisonTable.v1Header}
                    </th>
                    <th className="px-3 py-2 font-medium text-ink-strong">
                      {comparisonTable.v2Header}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.rows.map((row) => (
                    <tr key={row.feature} className="border-b border-border">
                      <th scope="row" className="px-3 py-2 font-medium text-ink-strong">
                        {row.feature}
                      </th>
                      <td className="px-3 py-2 text-ink-muted">{row.v1}</td>
                      <td className="px-3 py-2 text-ink-muted">{row.v2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl text-ink-strong">{whoFitsHeading}</h2>
            <ul className="flex flex-col gap-2 pl-5 text-ink">
              {whoFits.map((item) => (
                <li key={item} className="list-disc pl-1 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
    >
      {Content && <Content />}
    </ContentPageLayout>
  );
}
