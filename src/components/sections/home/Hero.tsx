import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Video } from "@/components/ui/Video";
import { IconTelegram } from "@/components/ui/icons";
import { buildTelegramLink } from "@/lib/messenger";
import { getTypedMessages } from "@/i18n/get-messages";
import type { Locale } from "@/i18n/routing";

/**
 * Чёрный hero: на мобильном ролик во весь экран под затемнением и текст поверх,
 * на десктопе текст слева и два вертикальных ролика справа. Ролики вертикальные
 * (9:16), поэтому на широком экране их не растягиваем на всю ширину.
 */
export async function Hero() {
  const ru = await getTypedMessages();
  const locale = (await getLocale()) as Locale;
  const copy = ru.home.hero;
  const telegramHref = buildTelegramLink({ locale });

  const text = (
    <>
      <p className="caps text-bg/70">{copy.eyebrow}</p>
      <h1 className="font-heading text-[44px] leading-[1.02] md:text-[64px] xl:text-[84px]">
        {copy.title}
      </h1>
      <p className="max-w-md leading-relaxed text-bg/80">{copy.subtitle}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="inverse" size="lg">
          <Link href="/catalog/hair">{copy.ctaPrimary}</Link>
        </Button>
        <Button asChild variant="outline-inverse" size="lg">
          <a href={telegramHref} target="_blank" rel="noopener noreferrer">
            <IconTelegram className="size-5" />
            {copy.ctaSecondary}
          </a>
        </Button>
      </div>
    </>
  );

  return (
    <section className="bg-ink text-bg">
      {/* Мобильный и планшет */}
      <div
        className="relative flex min-h-[640px] flex-col justify-end lg:hidden"
        style={{ height: "calc(100svh - 96px)" }}
      >
        <Video
          name="heroLoop1"
          label={copy.imageAlt}
          aspectClass=""
          className="absolute inset-0 size-full bg-ink"
        />
        <div aria-hidden className="absolute inset-0 bg-ink/50" />
        <div className="relative flex flex-col gap-5 px-4 pt-24 pb-10 sm:px-8">
          {text}
        </div>
      </div>

      {/* Десктоп */}
      <div className="mx-auto hidden w-full max-w-[1440px] grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-center gap-12 px-8 py-12 lg:grid xl:px-12">
        <div className="flex flex-col gap-7">{text}</div>
        <div className="grid grid-cols-2 gap-3">
          <Video
            name="heroLoop1"
            label={copy.imageAlt}
            className="bg-ink-strong"
          />
          <Video
            name="bio2"
            label={copy.imageAlt}
            className="mt-16 bg-ink-strong"
          />
        </div>
      </div>
    </section>
  );
}
