import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { Button } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { IconBolt, IconEyeOff, IconHand, IconRefresh, IconShield } from "@/components/ui/icons";
import { getPageContent } from "@/lib/content/pages";
import { setRequestLocale } from "next-intl/server";
import { getTypedMessages } from "@/i18n/get-messages";
import { buildLanguageAlternates } from "@/i18n/alternates";
import { IMAGES } from "@/content/images";
import { pickLocale } from "@/lib/content/locale";
import type { Locale } from "@/i18n/routing";

const ICONS = [IconBolt, IconEyeOff, IconShield, IconRefresh, IconHand];

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  return {
  alternates: buildLanguageAlternates("/technology/tape-in"),
  title: `${ru.pages.technology.tapeIn.title} | Da Vinchi Hair`,
  description: ru.pages.technology.tapeIn.description,
};
}

export default async function TapeInPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  const page = await getPageContent("technology/tape-in", locale);
  const Content = page?.default;

  return (
    <ContentPageLayout
      title={ru.pages.technology.tapeIn.title}
      description={ru.pages.technology.tapeIn.description}
      breadcrumbs={[
        { label: ru.nav.technology, href: "/technology" },
        { label: ru.pages.technology.tapeIn.title },
      ]}
      wide={
        <Media
          path="tapeClassicRolls"
          alt={pickLocale(IMAGES.tapeClassicRolls.alt, locale)}
          aspect="16/9"
          sizes="(min-width: 1024px) 960px, 100vw"
          className="rounded-base bg-surface-alt"
        />
      }
      after={
        <div className="flex flex-col gap-6 border-t border-border pt-10">
          <h2 className="font-heading text-2xl text-ink-strong">
            {ru.pages.technology.tapeIn.benefitsHeading}
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {ru.home.why.items.map((item, index) => {
              const Icon = ICONS[index];
              return (
                <li key={item.title} className="flex flex-col gap-2">
                  <Icon className="size-6 text-ink-strong" />
                  <span className="font-medium text-ink-strong">{item.title}</span>
                  <span className="text-sm text-ink-muted">{item.description}</span>
                </li>
              );
            })}
          </ul>
          <Button asChild variant="secondary" className="self-start">
            <Link href="/#lead-form">{ru.product.cta.leadForm}</Link>
          </Button>
        </div>
      }
    >
      {Content && <Content />}
    </ContentPageLayout>
  );
}
