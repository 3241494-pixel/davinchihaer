import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { getPageContent } from "@/lib/content/pages";
import { ru } from "@/i18n/messages";

export const metadata: Metadata = {
  title: `${ru.pages.care.title} | Da Vinchi Hair`,
  description: ru.pages.care.description,
};

export default async function CarePage() {
  const page = await getPageContent("care");
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
