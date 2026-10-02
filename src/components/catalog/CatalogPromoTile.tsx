"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buildTelegramLink } from "@/lib/messenger";
import { useTypedMessages } from "@/i18n/use-messages";
import type { Locale } from "@/i18n/routing";

/** Чёрная плитка в сетке каталога: подбор оттенка по фото в Telegram. */
export function CatalogPromoTile() {
  const ru = useTypedMessages();
  const locale = useLocale() as Locale;
  const copy = ru.catalog.promo;

  return (
    <div className="flex h-full min-h-[320px] flex-col justify-between gap-6 bg-ink p-5 text-bg md:p-6">
      <div className="flex flex-col gap-3">
        <p className="caps text-[12px] text-bg/60">{copy.eyebrow}</p>
        <p className="font-heading text-[26px] leading-tight md:text-[30px]">
          {copy.heading}
        </p>
        <p className="text-sm leading-relaxed text-bg/75">{copy.text}</p>
      </div>
      <div className="flex flex-col gap-3">
        <a
          href={buildTelegramLink({ locale })}
          target="_blank"
          rel="noopener noreferrer"
          className="caps inline-flex h-11 items-center justify-center bg-bg px-4 text-ink transition-colors duration-200 hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg"
        >
          {copy.cta}
        </a>
        <Link
          href="/guides/color-match"
          className="caps text-center text-bg underline decoration-bg/40 underline-offset-4 hover:decoration-bg"
        >
          {copy.guide}
        </Link>
      </div>
    </div>
  );
}
