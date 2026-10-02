import { Button } from "@/components/ui/Button";
import { IconTelegram } from "@/components/ui/icons";
import { buildTelegramLink } from "@/lib/messenger";
import type { Locale } from "@/i18n/routing";

export interface LeadActionsProps {
  locale: Locale;
  leadLabel: string;
  telegramLabel: string;
  /** Якорь формы заявки на этой же странице. */
  leadHref?: string;
}

/** Пара кнопок для тёмных секций: заявка (белая заливка) и Telegram (белый контур). */
export function LeadActions({
  locale,
  leadLabel,
  telegramLabel,
  leadHref = "#lead-form",
}: LeadActionsProps) {
  return (
    <>
      <Button asChild variant="inverse" size="lg">
        <a href={leadHref}>{leadLabel}</a>
      </Button>
      <Button asChild variant="outline-inverse" size="lg">
        <a
          href={buildTelegramLink({ locale })}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconTelegram className="size-5" />
          {telegramLabel}
        </a>
      </Button>
    </>
  );
}
