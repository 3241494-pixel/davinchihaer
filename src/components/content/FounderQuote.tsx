import { getTypedMessages } from "@/i18n/get-messages";

/** Цитата основателя (референс belairbeauty.com): на главной и в /about. */
export async function FounderQuote() {
  const ru = await getTypedMessages();
  const copy = ru.founderQuote;
  return (
    <figure className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
      <blockquote className="font-heading text-[28px] leading-snug text-ink-strong md:text-[40px]">
        {copy.text}
      </blockquote>
      <figcaption className="caps text-ink-muted">{copy.author}</figcaption>
    </figure>
  );
}
