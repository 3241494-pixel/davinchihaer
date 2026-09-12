import { IconInstagram, IconTelegram } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { getTypedMessages } from "@/i18n/get-messages";

export async function ContactNote() {
  const ru = await getTypedMessages();
  return (
    <div className="flex flex-col gap-4 rounded-base border border-border bg-surface p-6">
      <h2 className="font-heading text-xl text-ink-strong">{ru.wholesale.contact.heading}</h2>
      <p className="max-w-xl text-sm text-ink-muted">{ru.wholesale.contact.description}</p>
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
        <p className="text-sm text-ink-muted">
          {siteConfig.address.street && `${siteConfig.address.street}, `}
          {siteConfig.address.city}, {siteConfig.address.country}
        </p>
      </div>
    </div>
  );
}
