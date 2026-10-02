import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Media } from "@/components/ui/Media";
import { IMAGES, type ImageKey } from "@/content/images";
import { pickLocale } from "@/lib/content/locale";
import { getTypedMessages } from "@/i18n/get-messages";
import type { Locale } from "@/i18n/routing";

export async function Techniques() {
  const ru = await getTypedMessages();
  const locale = (await getLocale()) as Locale;
  const t = ru.home.techniques;
  const CARDS: { copy: typeof t.classic; image: ImageKey }[] = [
    { copy: t.classic, image: "techClassic1" },
    { copy: t.imitation1, image: "techImitation1" },
    { copy: t.imitation2, image: "techImitation2" },
    { copy: t.bioTape, image: "techBio1" },
    { copy: t.ringStar, image: "techRingstar4" },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <p className="caps text-ink-muted">{t.eyebrow}</p>
        <h2 className="font-heading text-[32px] leading-tight text-ink-strong md:text-[52px]">
          {t.heading}
        </h2>
      </div>
      <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-5">
        {CARDS.map(({ copy, image }, index) => (
          <li
            key={copy.href}
            className="w-[72%] shrink-0 snap-start sm:w-[45%] md:w-auto"
          >
            <Link
              href={copy.href}
              className="group flex h-full flex-col gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-strong"
            >
              <div className="overflow-hidden bg-surface-alt">
                <Media
                  path={image}
                  alt={pickLocale(IMAGES[image].alt, locale)}
                  aspect="3/4"
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 72vw"
                  className="transition-opacity duration-300 group-hover:opacity-85"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <span className="caps text-[12px] text-ink-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-[24px] leading-tight text-ink-strong">
                  {copy.title}
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-ink-muted">
                  {copy.description}
                </p>
                <span className="caps mt-auto pt-2 text-ink underline decoration-border underline-offset-4 transition-colors duration-200 group-hover:decoration-ink">
                  {t.linkLabel}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
