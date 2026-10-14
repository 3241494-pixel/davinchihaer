import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { cn } from "@/components/ui/cn";
import { Link } from "@/i18n/navigation";
import { getTypedMessages } from "@/i18n/get-messages";
import type { Locale } from "@/i18n/routing";
import { BEFORE_AFTER_PAIRS } from "@/content/before-after";
import { pickLocale } from "@/lib/content/locale";
import { BeforeAfterPairs, type RenderedPair } from "./BeforeAfterPairs";
import { LeadActions } from "./LeadActions";

export interface BeforeAfterSectionProps {
  locale: Locale;
  /** dark — отдельная чёрная секция на всю ширину (главная); light — блок внутри страницы (галерея). */
  tone?: "light" | "dark";
}

const SIZES = "(min-width: 1024px) 520px, 100vw";

/**
 * Слайдер «до/после» с подвижным разделителем. Пока клиент не прислал пары фото
 * (TODO_CLIENT, src/content/before-after.ts), показывает схему из двух серых полей,
 * чтобы было видно, как работает сравнение, и подпись о том, что фото появятся.
 */
export async function BeforeAfterSection({
  locale,
  tone = "dark",
}: BeforeAfterSectionProps) {
  const ru = await getTypedMessages();
  const t = ru.home.beforeAfter;
  const dark = tone === "dark";

  const pairs: RenderedPair[] =
    BEFORE_AFTER_PAIRS.length > 0
      ? BEFORE_AFTER_PAIRS.map((pair) => {
          const caption = pickLocale(pair.caption, locale);
          return {
            id: pair.id,
            caption,
            before: (
              <Media
                path={pair.before}
                alt={`${t.before}: ${caption}`}
                sizes={SIZES}
                className="absolute inset-0 size-full"
              />
            ),
            after: (
              <Media
                path={pair.after}
                alt={`${t.after}: ${caption}`}
                sizes={SIZES}
                className="absolute inset-0 size-full"
              />
            ),
          };
        })
      : [
          {
            id: "placeholder",
            caption: t.placeholderNote,
            before: (
              <div className="relative size-full bg-ink-muted">
                <span className="caps absolute top-1/3 left-0 w-1/2 px-3 text-center text-bg">
                  {t.placeholderBefore}
                </span>
              </div>
            ),
            after: (
              <div className="relative size-full bg-surface-alt">
                <span className="caps absolute top-1/3 right-0 w-1/2 px-3 text-center text-ink">
                  {t.placeholderAfter}
                </span>
              </div>
            ),
          },
        ];

  const content = (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
      <div className="flex flex-col gap-5">
        <p className={cn("caps", dark ? "text-bg/60" : "text-ink-muted")}>
          {t.eyebrow}
        </p>
        <h2
          className={cn(
            "font-heading text-[32px] leading-tight md:text-[48px]",
            !dark && "text-ink-strong",
          )}
        >
          {t.heading}
        </h2>
        <p
          className={cn(
            "max-w-md leading-relaxed",
            dark ? "text-bg/75" : "text-ink-muted",
          )}
        >
          {t.text}
        </p>
        {dark && (
          <>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row lg:max-w-xs lg:flex-col">
              <LeadActions
                locale={locale}
                leadLabel={ru.ctaBand.primary}
                telegramLabel={ru.ctaBand.telegram}
              />
            </div>
            <Link
              href="/gallery"
              className="caps self-start text-bg underline decoration-bg/40 underline-offset-4 transition-colors duration-200 hover:decoration-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg"
            >
              {t.galleryLink}
            </Link>
          </>
        )}
      </div>

      <div className="w-full lg:max-w-[520px] lg:justify-self-end">
        <BeforeAfterPairs
          pairs={pairs}
          beforeLabel={t.before}
          afterLabel={t.after}
          sliderLabel={t.sliderLabel}
          pairLabel={t.pairLabel}
          tone={tone}
        />
      </div>
    </div>
  );

  if (!dark) return content;

  return (
    <section className="bg-ink text-bg">
      <Container className="py-16 md:py-24">{content}</Container>
    </section>
  );
}
