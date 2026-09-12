import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { Techniques } from "@/components/sections/home/Techniques";
import { ru } from "@/i18n/messages";

export const metadata: Metadata = {
  title: `${ru.pages.technology.hub.title} | Da Vinchi Hair`,
  description: ru.pages.technology.hub.description,
};

export default function TechnologyHubPage() {
  return (
    <ContentPageLayout
      title={ru.pages.technology.hub.title}
      description={ru.pages.technology.hub.description}
      breadcrumbs={[{ label: ru.nav.technology }]}
      wide={<Techniques />}
    />
  );
}
