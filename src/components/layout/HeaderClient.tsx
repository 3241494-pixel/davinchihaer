"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/components/ui/cn";
import { IconMenu, IconTelegram } from "@/components/ui/icons";
import { useTypedMessages } from "@/i18n/use-messages";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import { CatalogMenu, type CategoryLink } from "./CatalogMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { getNavItems } from "./nav-items";

const SCROLL_THRESHOLD = 8;

export interface HeaderClientProps {
  categories: CategoryLink[];
}

export function HeaderClient({ categories }: HeaderClientProps) {
  const ru = useTypedMessages();
  const navItems = getNavItems(ru);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    function update() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      ticking = false;
    }
    function handleScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-[padding,background-color,box-shadow] duration-200",
          scrolled ? "bg-bg py-2 shadow-sm" : "bg-transparent py-4",
        )}
      >
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 md:px-8">
          <Logo />

          <nav className="hidden items-center gap-6 md:flex">
            <CatalogMenu categories={categories} />
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-ink transition-colors duration-200 hover:text-ink-strong",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <a
              href={siteConfig.telegramBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ru.header.telegramLink}
              className={cn(
                "hidden size-9 items-center justify-center rounded-base text-ink transition-colors duration-200 hover:bg-surface md:inline-flex",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
              )}
            >
              <IconTelegram className="size-5" />
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={ru.header.openMenu}
              aria-haspopup="dialog"
              aria-expanded={mobileOpen}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-base text-ink transition-colors duration-200 hover:bg-surface md:hidden",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
              )}
            >
              <IconMenu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={categories}
        telegramHref={siteConfig.telegramBotUrl}
      />
    </>
  );
}
