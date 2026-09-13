import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { Techniques } from "@/components/sections/home/Techniques";
import { Media } from "@/components/ui/Media";
import { getTypedMessages } from "@/i18n/get-messages";
import { getLocale } from "next-intl/server";
import { buildLanguageAlternates } from "@/i18n/alternates";
import { IMAGES } from "@/content/images";
import { pickLocale } from "@/lib/content/locale";

export async function generateMetadata(): Promise<Metadata> {
  const ru = await getTypedMessages();
  return {
  alternates: buildLanguageAlternates("/technology"),
  title: `${ru.pages.technology.hub.title} | Da Vinchi Hair`,
  description: ru.pages.technology.hub.description,
};
}

export default async function TechnologyHubPage() {
  const ru = await getTypedMessages();
  const locale = await getLocale();
  return (
    <ContentPageLayout
      title={ru.pages.technology.hub.title}
      description={ru.pages.technology.hub.description}
      breadcrumbs={[{ label: ru.nav.technology }]}
      wide={
        <div className="flex flex-col gap-10">
          <Media
            path="extensionTypes"
            alt={pickLocale(IMAGES.extensionTypes.alt, locale)}
            aspect="16/9"
            sizes="(min-width: 1024px) 960px, 100vw"
            className="rounded-base bg-surface-alt"
          />
          <Techniques />
        </div>
      }
    />
  );
}
