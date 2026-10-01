import { getTypedMessages } from "@/i18n/get-messages";

const REPEAT = 4;

/**
 * Бегущая строка под hero (референс belairbeauty.com). Декоративная, поэтому
 * aria-hidden. Две одинаковые половины сдвигаются на -50%, шов не виден;
 * при prefers-reduced-motion строка стоит на месте (см. .animate-marquee).
 */
export async function Marquee() {
  const ru = await getTypedMessages();
  const half = Array.from({ length: REPEAT }, () => ru.home.marquee);

  return (
    <div aria-hidden className="overflow-hidden border-y border-border bg-bg py-4">
      <div className="animate-marquee flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {half.map((text, index) => (
              <span
                key={index}
                className="caps px-6 text-[13px] whitespace-nowrap text-ink-strong md:text-[15px]"
              >
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
