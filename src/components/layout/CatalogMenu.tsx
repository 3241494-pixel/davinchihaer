"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/components/ui/cn";
import { IconChevronDown } from "@/components/ui/icons";
import { useTypedMessages } from "@/i18n/use-messages";

export interface CategoryLink {
  value: string;
  label: string;
}

export interface CatalogMenuProps {
  categories: CategoryLink[];
}

export function CatalogMenu({ categories }: CatalogMenuProps) {
  const ru = useTypedMessages();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={ru.header.catalogMenuLabel}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex items-center gap-1 text-sm font-medium text-ink transition-colors duration-200 hover:text-ink-strong",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
        )}
      >
        {ru.nav.catalog}
        <IconChevronDown
          className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open && (
        <div
          role="group"
          aria-label={ru.nav.catalog}
          className="animate-fade-in absolute top-full left-0 z-30 mt-2 min-w-56 rounded-base border border-border bg-bg p-2 shadow-lg"
        >
          <ul className="flex flex-col">
            {categories.map((category) => (
              <li key={category.value}>
                <Link
                  href={`/catalog/${category.value}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-base px-3 py-2 text-sm text-ink transition-colors duration-200 hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-1 border-t border-border pt-1">
            <Link
              href="/catalog"
              onClick={() => setOpen(false)}
              className="block rounded-base px-3 py-2 text-sm font-medium text-ink transition-colors duration-200 hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
            >
              {ru.header.allCatalogLink}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
