import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { RetailLeadForm } from "@/components/forms/RetailLeadForm";
import { IconInstagram, IconTelegram } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { getTypedMessages } from "@/i18n/get-messages";

export async function generateMetadata(): Promise<Metadata> {
  const ru = await getTypedMessages();
  return {
  title: `${ru.pages.contacts.title} | Da Vinchi Hair`,
  description: ru.pages.contacts.description,
};
}

const MAP_EMBED_SRC = "https://www.google.com/maps?q=Tbilisi%2C+Georgia&output=embed";

export default async function ContactsPage() {
  const ru = await getTypedMessages();
  const copy = ru.pages.contacts;

  return (
    <ContentPageLayout
      title={copy.title}
      description={copy.description}
      breadcrumbs={[{ label: ru.nav.contacts }]}
      wide={
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-xl text-ink-strong">{copy.addressHeading}</h2>
              <p className="text-sm text-ink-muted">
                {siteConfig.address.street && `${siteConfig.address.street}, `}
                {siteConfig.address.city}, {siteConfig.address.country}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-xl text-ink-strong">{copy.mapHeading}</h2>
              <div className="aspect-video overflow-hidden rounded-base border border-border">
                <iframe
                  src={MAP_EMBED_SRC}
                  title={copy.mapHeading}
                  loading="lazy"
                  className="size-full border-0"
                />
              </div>
              <p className="text-xs text-ink-muted">{copy.mapTodo}</p>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-xl text-ink-strong">{copy.socialHeading}</h2>
              <div className="flex flex-col gap-2">
                <a
                  href={siteConfig.telegramBotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-ink underline-offset-4 hover:underline"
                >
                  <IconTelegram className="size-4" />
                  {ru.header.telegramLink}
                </a>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-ink underline-offset-4 hover:underline"
                >
                  <IconInstagram className="size-4" />
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div id="lead-form" className="flex scroll-mt-24 flex-col gap-4">
            <h2 className="font-heading text-xl text-ink-strong">{copy.formHeading}</h2>
            <RetailLeadForm />
          </div>
        </div>
      }
    />
  );
}
