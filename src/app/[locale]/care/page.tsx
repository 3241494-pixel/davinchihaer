import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { getPageContent } from "@/lib/content/pages";
import { getLocale } from "next-intl/server";
import { getTypedMessages } from "@/i18n/get-messages";
import { buildLanguageAlternates } from "@/i18n/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const ru = await getTypedMessages();
  return {
  alternates: buildLanguageAlternates("/care"),
  title: `${ru.pages.care.title} | Da Vinchi Hair`,
  description: ru.pages.care.description,
};
}

export default async function CarePage() {
  const ru = await getTypedMessages();
  const locale = await getLocale();
  const page = await getPageContent("care", locale);
  const Content = page?.default;
  const copy = ru.pages.care;

  return (
    <ContentPageLayout
      title={copy.title}
      description={copy.description}
      breadcrumbs={[{ label: copy.title }]}
      after={
        <div className="flex flex-col gap-4 border-t border-border pt-10">
          <h2 className="font-heading text-2xl text-ink-strong">{copy.lifespanHeading}</h2>
          <ul className="flex flex-col gap-2 pl-5 text-ink">
            {copy.lifespanItems.map((item) => (
              <li key={item} className="list-disc pl-1 leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink-muted">{copy.disclaimer}</p>
        </div>
      }
    >
      {Content && <Content />}
    </ContentPageLayout>
  );
}
