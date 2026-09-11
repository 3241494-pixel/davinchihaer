import { RetailLeadForm } from "@/components/forms/RetailLeadForm";
import { siteConfig } from "@/config/site";
import { ru } from "@/i18n/messages";

export function ContactLeadSection() {
  return (
    <div id="lead-form" className="grid scroll-mt-24 gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col gap-4">
        <h2 className="font-heading text-3xl text-ink-strong">{ru.home.contact.heading}</h2>
        <p className="text-base text-ink-muted">{ru.home.contact.description}</p>
        <RetailLeadForm submitVariant="secondary" />
      </div>

      <div className="flex flex-col gap-3 rounded-base border border-border bg-surface p-6">
        <h3 className="font-heading text-xl text-ink-strong">{ru.home.contact.addressHeading}</h3>
        <p className="text-sm text-ink-muted">
          {siteConfig.address.street && `${siteConfig.address.street}, `}
          {siteConfig.address.city}, {siteConfig.address.country}
        </p>
        <a
          href={siteConfig.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-ink underline-offset-4 hover:underline"
        >
          Instagram
        </a>
        <a
          href={siteConfig.telegramBotUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-ink underline-offset-4 hover:underline"
        >
          {ru.header.telegramLink}
        </a>
      </div>
    </div>
  );
}
