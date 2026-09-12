import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { publicImageExists } from "@/lib/image-exists";
import { getTypedMessages } from "@/i18n/get-messages";

export async function FunnelBanners() {
  const ru = await getTypedMessages();
  const BANNERS = [
    { ...ru.home.banners.wholesale, href: "/wholesale", image: "/images/home/wholesale.jpg" },
    { ...ru.home.banners.academy, href: "/academy", image: "/images/home/academy.jpg" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {BANNERS.map((banner) => {
        const exists = publicImageExists(banner.image);
        return (
          <div
            key={banner.href}
            className="flex flex-col overflow-hidden rounded-base border border-border bg-surface"
          >
            <div className="relative aspect-[16/9] bg-surface-alt">
              {exists ? (
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center px-4 text-center text-xs text-ink-muted">
                  {banner.title}
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <h3 className="font-heading text-xl text-ink-strong">{banner.title}</h3>
              <p className="text-sm text-ink-muted">{banner.description}</p>
              <Button asChild variant="secondary" className="mt-auto self-start">
                <Link href={banner.href}>{banner.cta}</Link>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
