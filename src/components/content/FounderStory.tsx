import { Media } from "@/components/ui/Media";
import { getTypedMessages } from "@/i18n/get-messages";
import type { Locale } from "@/i18n/routing";
import { IMAGES } from "@/content/images";
import { getFounder } from "@/lib/content/founder";
import { pickLocale } from "@/lib/content/locale";

export interface FounderStoryProps {
  locale: Locale;
}

/**
 * Основатель и история бренда для /about: портрет с коротким знакомством,
 * затем лента по годам из сторис Светланы (content/founder.json).
 */
export async function FounderStory({ locale }: FounderStoryProps) {
  const ru = await getTypedMessages();
  const copy = ru.pages.about;
  const founder = getFounder();

  return (
    <div className="flex flex-col gap-14 md:gap-20">
      <section
        aria-labelledby="founder-heading"
        className="grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:gap-12 lg:gap-16"
      >
        <Media
          path="founderPortrait"
          alt={pickLocale(IMAGES.founderPortrait.alt, locale)}
          aspect="4/5"
          sizes="(min-width: 768px) 40vw, 100vw"
          className="w-full max-w-[420px]"
        />
        <div className="flex flex-col gap-4">
          <p className="caps text-ink-muted">{copy.founderEyebrow}</p>
          <h2
            id="founder-heading"
            className="font-heading text-[32px] leading-tight text-ink-strong md:text-[44px]"
          >
            {pickLocale(founder.name, locale)}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-ink">
            {pickLocale(founder.intro, locale)}
          </p>
        </div>
      </section>

      <section
        aria-labelledby="history-heading"
        className="flex flex-col gap-8"
      >
        <h2
          id="history-heading"
          className="font-heading text-[32px] leading-tight text-ink-strong md:text-[44px]"
        >
          {copy.historyHeading}
        </h2>
        <ol className="flex flex-col border-l border-border">
          {founder.timeline.map((item) => (
            <li
              key={item.year}
              className="relative flex flex-col gap-2 pb-10 pl-6 last:pb-0 md:grid md:grid-cols-[112px_minmax(0,1fr)] md:gap-8 md:pl-10"
            >
              <span
                aria-hidden
                className="absolute top-2.5 -left-[5px] size-[9px] rounded-base bg-ink"
              />
              <h3 className="font-heading text-[28px] leading-none text-ink-strong lining-nums md:text-[32px]">
                <time dateTime={String(item.year)}>{item.year}</time>
              </h3>
              <p className="max-w-2xl text-base leading-relaxed text-ink">
                {pickLocale(item.text, locale)}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
