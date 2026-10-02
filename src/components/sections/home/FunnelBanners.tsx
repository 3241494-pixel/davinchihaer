import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Media } from "@/components/ui/Media";
import { IMAGES, type ImageKey } from "@/content/images";
import { pickLocale } from "@/lib/content/locale";
import { getTypedMessages } from "@/i18n/get-messages";
import type { Locale } from "@/i18n/routing";

/** Две фото-плитки: опт и обучение. Текст белым поверх затемнённого кадра. */
export async function FunnelBanners() {
  const ru = await getTypedMessages();
  const locale = (await getLocale()) as Locale;
  const BANNERS: {
    copy: typeof ru.home.banners.wholesale;
    href: string;
    image: ImageKey;
  }[] = [
    {
      copy: ru.home.banners.wholesale,
      href: "/wholesale",
      image: "paletteWide2",
    },
    {
      copy: ru.home.banners.academy,
      href: "/academy",
      image: "posterInstallOnModel",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
      {BANNERS.map(({ copy, href, image }) => (
        <Link
          key={href}
          href={href}
          className="group relative flex min-h-[440px] flex-col justify-end overflow-hidden bg-ink text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-strong md:min-h-[560px]"
        >
          <Media
            path={image}
            alt={pickLocale(IMAGES[image].alt, locale)}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="absolute inset-0 size-full transition-opacity duration-300 group-hover:opacity-90"
          />
          <div aria-hidden className="absolute inset-0 bg-ink/45" />
          <div className="relative flex flex-col gap-3 p-6 md:p-10">
            <h3 className="font-heading text-[30px] leading-tight md:text-[40px]">
              {copy.title}
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-bg/85">
              {copy.description}
            </p>
            <span className="caps mt-3 inline-flex h-11 items-center self-start border border-bg/70 px-5 transition-colors duration-200 group-hover:border-bg group-hover:bg-bg group-hover:text-ink">
              {copy.cta}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
