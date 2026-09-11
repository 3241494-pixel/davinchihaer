import { siteConfig } from "@/config/site";
import { ru } from "@/i18n/messages";
import { IconTelegram } from "@/components/ui/icons";
import { cn } from "@/components/ui/cn";

export function TelegramFloatingButton() {
  return (
    <a
      href={siteConfig.telegramBotUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ru.telegramFloating.label}
      className={cn(
        "fixed right-4 bottom-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-ink text-bg shadow-lg md:hidden",
        "transition-transform duration-200 hover:scale-105 active:scale-95",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
      )}
    >
      <IconTelegram className="size-6" />
    </a>
  );
}
