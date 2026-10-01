import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { SelfCorrectionBridge } from "@/components/content/SelfCorrectionBridge";
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
  alternates: buildLanguageAlternates("/care"),
  title: `${ru.pages.care.title} | Da Vinchi Hair`,
  description: ru.pages.care.description,
};
}

export default async function CarePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  const page = await getPageContent("care", locale);
  const Content = page?.default;
  const copy = ru.pages.care;

  return (
    <ContentPageLayout
      title={copy.title}
      description={copy.description}
      breadcrumbs={[{ label: copy.title }]}
      wide={
        <Media
          path="techClassic1"
          alt={pickLocale(IMAGES.techClassic1.alt, locale)}
          aspect="4/5"
          sizes="(min-width: 1024px) 480px, 100vw"
          className="mx-auto max-w-sm rounded-base bg-surface-alt"
        />
      }
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
          <SelfCorrectionBridge
            text={copy.selfCorrectionBridge.text}
            links={[
              { href: "/guides/self-correction", label: copy.selfCorrectionBridge.guideLink },
              { href: "/academy", label: copy.selfCorrectionBridge.academyLink },
            ]}
          />
          <p className="text-xs text-ink-muted">{copy.disclaimer}</p>
        </div>
      }
    >
      {Content && <Content />}
    </ContentPageLayout>
  );
}
