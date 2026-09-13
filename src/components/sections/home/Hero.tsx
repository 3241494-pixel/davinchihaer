import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { IconTelegram } from "@/components/ui/icons";
import { buildTelegramLink } from "@/lib/messenger";
import { getTypedMessages } from "@/i18n/get-messages";

export async function Hero() {
  const ru = await getTypedMessages();
  const telegramHref = buildTelegramLink();

  return (
    <Container className="grid gap-8 py-10 md:py-16 lg:grid-cols-2 lg:items-center lg:gap-16">
      <div className="flex flex-col gap-6">
        <h1 className="font-heading text-4xl text-ink-strong md:text-5xl">{ru.home.hero.title}</h1>
        <p className="max-w-lg text-lg text-ink-muted">{ru.home.hero.subtitle}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="primary" size="lg">
            <a href="#lead-form">{ru.home.hero.ctaPrimary}</a>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <a href={telegramHref} target="_blank" rel="noopener noreferrer">
              <IconTelegram className="size-5" />
              {ru.home.hero.ctaSecondary}
            </a>
          </Button>
        </div>
      </div>

      <Media
        path="tapeClassicRolls"
        alt={ru.home.hero.imageAlt}
        aspect="4/5"
        priority
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="rounded-base bg-surface-alt lg:aspect-square"
      />
    </Container>
  );
}
