import { Link } from "@/i18n/navigation";
import { getCategories } from "@/lib/content/products";
import { siteConfig } from "@/config/site";
import { getTypedMessages } from "@/i18n/get-messages";
import { IconInstagram, IconTelegram } from "@/components/ui/icons";
import { cn } from "@/components/ui/cn";
import { LanguageSwitcher } from "./LanguageSwitcher";

const iconLinkClasses = cn(
  "inline-flex size-9 items-center justify-center rounded-base border border-border text-ink transition-colors duration-200 hover:bg-surface",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
);

const footerLinkClasses = cn(
  "text-sm text-ink-muted transition-colors duration-200 hover:text-ink",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
);

export async function Footer() {
  const ru = await getTypedMessages();
  const categories = getCategories().map((category) => ({
    value: category,
    label: ru.categories[category],
  }));
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-12 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-lg text-ink-strong">{ru.footer.catalogTitle}</h2>
            <ul className="flex flex-col gap-2">
              {categories.map((category) => (
                <li key={category.value}>
                  <Link href={`/catalog/${category.value}`} className={footerLinkClasses}>
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-lg text-ink-strong">{ru.footer.infoTitle}</h2>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/about" className={footerLinkClasses}>
                  {ru.footer.info.about}
                </Link>
              </li>
              <li>
                <Link href="/delivery" className={footerLinkClasses}>
                  {ru.footer.info.delivery}
                </Link>
              </li>
              <li>
                <Link href="/faq" className={footerLinkClasses}>
                  {ru.footer.info.faq}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className={footerLinkClasses}>
                  {ru.footer.info.gallery}
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-lg text-ink-strong">{ru.footer.businessTitle}</h2>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/wholesale" className={footerLinkClasses}>
                  {ru.footer.business.wholesale}
                </Link>
              </li>
              <li>
                <Link href="/academy" className={footerLinkClasses}>
                  {ru.footer.business.academy}
                </Link>
              </li>
              <li>
                <Link href="/academy/online" className={footerLinkClasses}>
                  {ru.footer.business.academyOnline}
                </Link>
              </li>
              <li>
                <Link href="/academy/offline" className={footerLinkClasses}>
                  {ru.footer.business.academyOffline}
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-lg text-ink-strong">{ru.footer.contactsTitle}</h2>
            <p className="text-sm text-ink-muted">
              <span className="sr-only">{ru.footer.addressLabel}: </span>
              {siteConfig.address.street && `${siteConfig.address.street}, `}
              {siteConfig.address.city}, {siteConfig.address.country}
            </p>
            <Link href="/contacts" className={footerLinkClasses}>
              {ru.nav.contacts}
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-sm text-ink-muted">{ru.footer.socialLabel}</span>
              <div className="flex items-center gap-2">
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className={iconLinkClasses}
                >
                  <IconInstagram className="size-4" />
                </a>
                <a
                  href={siteConfig.telegramBotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ru.header.telegramLink}
                  className={iconLinkClasses}
                >
                  <IconTelegram className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-ink-muted">
            {ru.footer.copyright.replace("{year}", String(year))}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className={cn(footerLinkClasses, "text-xs")}>
              {ru.footer.legal.privacy}
            </Link>
            <Link href="/terms" className={cn(footerLinkClasses, "text-xs")}>
              {ru.footer.legal.terms}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
