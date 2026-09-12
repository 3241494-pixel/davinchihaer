import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { Techniques } from "@/components/sections/home/Techniques";
import { getTypedMessages } from "@/i18n/get-messages";

export async function generateMetadata(): Promise<Metadata> {
  const ru = await getTypedMessages();
  return {
  title: `${ru.pages.technology.hub.title} | Da Vinchi Hair`,
  description: ru.pages.technology.hub.description,
};
}

export default async function TechnologyHubPage() {
  const ru = await getTypedMessages();
  return (
    <ContentPageLayout
      title={ru.pages.technology.hub.title}
      description={ru.pages.technology.hub.description}
      breadcrumbs={[{ label: ru.nav.technology }]}
      wide={<Techniques />}
    />
  );
}
