import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconTelegram } from "@/components/ui/icons";
import { cn } from "@/components/ui/cn";
import { Link } from "@/i18n/navigation";
import { buildTelegramLink } from "@/lib/messenger";
import { getLocale } from "next-intl/server";
import { getTypedMessages } from "@/i18n/get-messages";
import type { Locale } from "@/i18n/routing";

export interface CtaBandProps {
  /**
   * Страница с формой заявки (/contacts и т.п.). Без неё кнопка ведёт к форме
   * на этой же странице (#lead-form).
   */
  leadPage?: string;
  tone?: "light" | "dark";
}

/**
 * Повторный призыв к действию посреди страницы: подбор оттенка, длины и густоты.
 * Одна главная кнопка (заявка) и контурная (Telegram).
 */
export async function CtaBand({ leadPage, tone = "light" }: CtaBandProps) {
  const ru = await getTypedMessages();
  const locale = (await getLocale()) as Locale;
  const copy = ru.ctaBand;
  const dark = tone === "dark";

  return (
    <section className={dark ? "bg-ink text-bg" : "bg-surface-alt text-ink"}>
      <Container className="flex flex-col items-center gap-6 py-16 text-center md:py-20">
        <p className={cn("caps", dark ? "text-bg/60" : "text-ink-muted")}>
          {copy.eyebrow}
        </p>
        <h2
          className={cn(
            "max-w-3xl font-heading text-[32px] leading-tight md:text-[52px]",
            dark ? "text-bg" : "text-ink-strong",
          )}
        >
          {copy.heading}
        </h2>
        <p
          className={cn(
            "max-w-xl leading-relaxed",
            dark ? "text-bg/75" : "text-ink-muted",
          )}
        >
          {copy.text}
        </p>
        <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild variant={dark ? "inverse" : "primary"} size="lg">
            {leadPage ? (
              <Link href={{ pathname: leadPage, hash: "lead-form" }}>
                {copy.primary}
              </Link>
            ) : (
              <a href="#lead-form">{copy.primary}</a>
            )}
          </Button>
          <Button
            asChild
            variant={dark ? "outline-inverse" : "secondary"}
            size="lg"
          >
            <a
              href={buildTelegramLink({ locale })}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconTelegram className="size-5" />
              {copy.telegram}
            </a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
