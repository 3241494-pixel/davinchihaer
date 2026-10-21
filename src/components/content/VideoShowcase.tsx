import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Video } from "@/components/ui/Video";
import { cn } from "@/components/ui/cn";
import { IMAGES } from "@/content/images";
import { VIDEOS, type VideoKey } from "@/content/videos";
import { pickLocale } from "@/lib/content/locale";
import type { Locale } from "@/i18n/routing";

export interface VideoShowcaseProps {
  names: VideoKey[];
  locale: Locale;
  eyebrow: string;
  heading: string;
  text?: string;
  /** Кнопки под текстом: заявка и мессенджер. */
  actions?: ReactNode;
}

const GRID_COLUMNS: Record<number, string> = {
  1: "md:grid-cols-2",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

/**
 * Чёрная секция с вертикальными роликами клиента. Слева заголовок и кнопки,
 * справа ролики; на мобильном ролики листаются по горизонтали внутри секции.
 */
export function VideoShowcase({
  names,
  locale,
  eyebrow,
  heading,
  text,
  actions,
}: VideoShowcaseProps) {
  if (names.length === 0) return null;
  return (
    <section className="bg-ink text-bg">
      <Container className="grid gap-10 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-5">
          <p className="caps text-bg/60">{eyebrow}</p>
          <h2 className="font-heading text-[32px] leading-tight md:text-[48px]">
            {heading}
          </h2>
          {text && (
            <p className="max-w-md leading-relaxed text-bg/75">{text}</p>
          )}
          {actions && (
            <div className="mt-2 flex flex-col gap-3 sm:flex-row lg:max-w-xs lg:flex-col">
              {actions}
            </div>
          )}
        </div>

        <div
          className={cn(
            "-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:gap-4 md:overflow-visible md:px-0",
            GRID_COLUMNS[Math.min(names.length, 3)],
          )}
        >
          {names.slice(0, 3).map((name) => {
            const label = pickLocale(IMAGES[VIDEOS[name].poster].alt, locale);
            return (
              <figure
                key={name}
                className="flex w-[62%] shrink-0 snap-start flex-col gap-3 sm:w-[40%] md:w-auto"
              >
                <Video name={name} label={label} className="bg-ink-strong" />
                <figcaption className="caps text-[12px] text-bg/60">
                  {label}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
