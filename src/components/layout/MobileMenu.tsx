"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/components/ui/cn";
import { IconChevronDown, IconClose, IconTelegram } from "@/components/ui/icons";
import { ru } from "@/i18n/messages";
import { NAV_ITEMS } from "./nav-items";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { CategoryLink } from "./CatalogMenu";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  categories: CategoryLink[];
  telegramHref: string;
}

export function MobileMenu({ open, onClose, categories, telegramHref }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    (focusable?.[0] ?? panelRef.current)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={ru.header.mobileMenuLabel}
      tabIndex={-1}
      className="animate-fade-in fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg focus:outline-none md:hidden"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        <span className="font-heading text-xl text-ink-strong">Da Vinchi Hair</span>
        <button
          type="button"
          onClick={onClose}
          aria-label={ru.header.closeMenu}
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-base text-ink transition-colors duration-200 hover:bg-surface",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
          )}
        >
          <IconClose className="size-5" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
        <div>
          <button
            type="button"
            aria-expanded={catalogOpen}
            onClick={() => setCatalogOpen((value) => !value)}
            className={cn(
              "flex w-full items-center justify-between rounded-base px-2 py-3 text-left text-lg font-medium text-ink",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
            )}
          >
            {ru.nav.catalog}
            <IconChevronDown
              className={cn("size-4 transition-transform duration-200", catalogOpen && "rotate-180")}
            />
          </button>
          {catalogOpen && (
            <ul className="animate-fade-in flex flex-col gap-1 py-1 pl-4">
              {categories.map((category) => (
                <li key={category.value}>
                  <Link
                    href={`/catalog/${category.value}`}
                    onClick={onClose}
                    className="block rounded-base px-2 py-2 text-base text-ink-muted transition-colors duration-200 hover:text-ink"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/catalog"
                  onClick={onClose}
                  className="block rounded-base px-2 py-2 text-base font-medium text-ink"
                >
                  {ru.header.allCatalogLink}
                </Link>
              </li>
            </ul>
          )}
        </div>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "rounded-base px-2 py-3 text-lg font-medium text-ink transition-colors duration-200 hover:bg-surface",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-4 border-t border-border px-4 py-6">
        <LanguageSwitcher />
        <a
          href={telegramHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className={cn(
            "inline-flex items-center gap-2 text-sm font-medium text-ink",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
          )}
        >
          <IconTelegram className="size-5" />
          {ru.header.telegramLink}
        </a>
      </div>
    </div>
  );
}
