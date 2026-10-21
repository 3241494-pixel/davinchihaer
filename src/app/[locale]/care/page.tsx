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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  return {
    alternates: buildLanguageAlternates("/care", locale),
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
        <div className="flex flex-col gap-10 border-t border-border pt-10">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl text-ink-strong">
              {copy.rulesHeading}
            </h2>
            <ol className="flex flex-col gap-4">
              {copy.rules.map((rule, index) => (
                <li key={rule} className="flex gap-4">
                  <span className="font-heading text-2xl leading-none text-ink-muted lining-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed text-ink">{rule}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex max-w-2xl flex-col gap-3">
            <p className="caps text-ink-muted">Da Vinchi Hair</p>
            {copy.closing.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-ink">
                {paragraph}
              </p>
            ))}
          </div>
          <SelfCorrectionBridge
            text={copy.selfCorrectionBridge.text}
            links={[
              {
                href: "/guides/self-correction",
                label: copy.selfCorrectionBridge.guideLink,
              },
              {
                href: "/academy",
                label: copy.selfCorrectionBridge.academyLink,
              },
            ]}
          />
        </div>
      }
    >
      {Content && <Content />}
    </ContentPageLayout>
  );
}
