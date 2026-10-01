import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { Button } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { VideoStrip } from "@/components/content/VideoStrip";
import { IMAGES } from "@/content/images";
import { pickLocale } from "@/lib/content/locale";
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
    alternates: buildLanguageAlternates("/technology/ring-star"),
    title: `${ru.pages.technology.ringStar.title} | Da Vinchi Hair`,
    description: ru.pages.technology.ringStar.description,
  };
}

export default async function RingStarPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  const page = ru.pages.technology.ringStar;
  const mdx = await getPageContent("technology/ring-star", locale);
  const Content = mdx?.default;

  return (
    <ContentPageLayout
      title={page.title}
      description={page.description}
      breadcrumbs={[{ label: ru.nav.technology, href: "/technology" }, { label: page.title }]}
      wide={
        <div className="flex flex-col gap-6">
          <Media
            path="techRingstar4"
            alt={pickLocale(IMAGES.techRingstar4.alt, locale)}
            aspect="4/5"
            sizes="(min-width: 1024px) 480px, 100vw"
            className="max-w-md rounded-base bg-surface-alt"
          />
          <VideoStrip names={["ringstar1"]} locale={locale} />
        </div>
      }
      after={
        <div className="flex flex-col gap-4 border-t border-border pt-10">
          <Button asChild variant="secondary" className="self-start">
            <Link href="/catalog/hair?attachment=ring-star">{page.catalogLink}</Link>
          </Button>
        </div>
      }
    >
      {Content && <Content />}
    </ContentPageLayout>
  );
}
