import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconTelegram } from "@/components/ui/icons";
import { buildTelegramLink } from "@/lib/messenger";
import { ru } from "@/i18n/messages";

export function Hero() {
  const telegramHref = buildTelegramLink();

  return (
    <Container className="flex flex-col gap-6 py-10 md:py-16">
      <h1 className="max-w-3xl font-heading text-4xl text-ink-strong md:text-5xl">
        {ru.wholesale.hero.title}
      </h1>
      <p className="max-w-2xl text-lg text-ink-muted">{ru.wholesale.hero.subtitle}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="primary" size="lg">
          <Link href="#lead-form">{ru.wholesale.hero.ctaPrimary}</Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <a href={telegramHref} target="_blank" rel="noopener noreferrer">
            <IconTelegram className="size-5" />
            {ru.wholesale.hero.ctaSecondary}
          </a>
        </Button>
      </div>
    </Container>
  );
}
