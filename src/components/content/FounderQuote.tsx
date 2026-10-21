import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getTypedMessages } from "@/i18n/get-messages";
import type { Locale } from "@/i18n/routing";
import { getFounder } from "@/lib/content/founder";
import { pickLocale } from "@/lib/content/locale";

export interface FounderQuoteProps {
  /** Ссылка на историю бренда: нужна на главной, в /about читатель уже там. */
  storyLink?: boolean;
}

/** Цитата основателя (референс belairbeauty.com): на главной и в /about. */
export async function FounderQuote({ storyLink = false }: FounderQuoteProps) {
  const ru = await getTypedMessages();
  const locale = (await getLocale()) as Locale;
  const founder = getFounder();

  return (
    <figure className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
      <span
        aria-hidden
        className="font-heading text-[72px] leading-[0.5] text-ink-muted"
      >
        “
      </span>
      <blockquote className="font-heading text-[26px] leading-snug text-ink-strong md:text-[36px]">
        {pickLocale(founder.quote, locale)}
      </blockquote>
      <figcaption className="flex flex-col items-center gap-1">
        <span className="caps text-ink-strong">
          {pickLocale(founder.name, locale)}
        </span>
        <span className="text-sm text-ink-muted">
          {pickLocale(founder.role, locale)}
        </span>
      </figcaption>
      {storyLink && (
        <Link
          href="/about"
          className="caps text-ink underline decoration-ink/40 underline-offset-4 transition-colors duration-200 hover:decoration-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {ru.founderQuote.storyLink}
        </Link>
      )}
    </figure>
  );
}
