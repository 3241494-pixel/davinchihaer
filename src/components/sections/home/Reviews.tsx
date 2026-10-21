import { getLocale } from "next-intl/server";
import { getTypedMessages } from "@/i18n/get-messages";
import type { Locale } from "@/i18n/routing";
import { pickLocale } from "@/lib/content/locale";
import { getReviews } from "@/lib/content/reviews";

/**
 * Отзывы клиентов из переписки (content/reviews.json). На телефоне карточки
 * листаются по горизонтали, на планшете и десктопе стоят колонками разной высоты.
 * На en и ka — перевод с русского, подпись под заголовком это объясняет.
 */
export async function Reviews() {
  const ru = await getTypedMessages();
  const locale = (await getLocale()) as Locale;
  const t = ru.home.reviews;
  const reviews = getReviews();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="caps text-ink-muted">{t.eyebrow}</p>
        <h2 className="font-heading text-[32px] leading-tight text-ink-strong md:text-[44px]">
          {t.heading}
        </h2>
        <p className="max-w-xl text-sm text-ink-muted">{t.note}</p>
      </div>

      <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 items-start gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:block md:columns-2 md:gap-4 md:overflow-visible md:px-0 lg:columns-3">
        {reviews.map((review) => (
          <li
            key={review.id}
            lang={locale}
            className="flex w-[85%] shrink-0 snap-start break-inside-avoid flex-col gap-3 rounded-base border border-border bg-bg p-6 sm:w-[60%] md:mb-4 md:w-auto"
          >
            <span
              aria-hidden
              className="font-heading text-[56px] leading-[0.6] text-ink-muted"
            >
              “
            </span>
            <blockquote className="text-[15px] leading-relaxed whitespace-pre-line text-ink">
              {pickLocale(review.text, locale)}
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
}
