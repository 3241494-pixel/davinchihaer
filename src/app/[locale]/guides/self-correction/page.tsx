import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { Media } from "@/components/ui/Media";
import { getPageContent } from "@/lib/content/pages";
import { getLocale } from "next-intl/server";
import { getTypedMessages } from "@/i18n/get-messages";
import { buildLanguageAlternates } from "@/i18n/alternates";
import { IMAGES } from "@/content/images";
import { pickLocale } from "@/lib/content/locale";

export async function generateMetadata(): Promise<Metadata> {
  const ru = await getTypedMessages();
  return {
  alternates: buildLanguageAlternates("/guides/self-correction"),
  title: `${ru.pages.guides.selfCorrection.title} | Da Vinchi Hair`,
  description: ru.pages.guides.selfCorrection.description,
};
}

export default async function SelfCorrectionPage() {
  const ru = await getTypedMessages();
  const locale = await getLocale();
  const page = await getPageContent("guides/self-correction", locale);
  const Content = page?.default;
  const copy = ru.pages.guides.selfCorrection;

  return (
    <ContentPageLayout
      title={copy.title}
      description={copy.description}
      breadcrumbs={[
        { label: ru.nav.guides, href: "/guides" },
        { label: copy.title },
      ]}
      wide={
        <Media
          path="tapeInHand"
          alt={pickLocale(IMAGES.tapeInHand.alt, locale)}
          aspect="4/5"
          sizes="(min-width: 1024px) 480px, 100vw"
          className="mx-auto max-w-sm rounded-base bg-surface-alt"
        />
      }
      after={
        <div className="flex flex-col gap-8 border-t border-border pt-10">
          <div className="rounded-base border border-danger px-4 py-3">
            <p className="text-sm font-medium text-danger">{copy.warningTitle}</p>
            <p className="mt-1 text-sm text-ink-muted">{copy.warningText}</p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl text-ink-strong">{copy.stepsHeading}</h2>
            <ol className="flex flex-col gap-4">
              {copy.steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="font-heading text-2xl text-ink-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-ink-strong">{step.title}</span>
                    <span className="text-sm text-ink-muted">{step.description}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <p className="text-xs text-ink-muted">{copy.disclaimer}</p>
        </div>
      }
    >
      {Content && <Content />}
    </ContentPageLayout>
  );
}
