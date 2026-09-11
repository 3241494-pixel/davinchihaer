"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/Button";
import { filterProducts } from "@/lib/content/filter-logic";
import { buildCatalogHref, emptyEditableFilters, type EditableFilters } from "@/lib/catalog/search-params";
import { ru } from "@/i18n/messages";
import { formatMessage } from "@/lib/format-message";
import { FilterControls } from "./FilterControls";
import type { HairColor, Product } from "@/lib/content/types";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface FiltersMobileProps {
  pathname: string;
  filters: EditableFilters;
  colors: HairColor[];
  products: Product[];
}

export function FiltersMobile({ pathname, filters, colors, products }: FiltersMobileProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<EditableFilters>(filters);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setPending(filters);
  }, [open, filters]);

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
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
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
  }, [open]);

  const pendingCount = useMemo(
    () => filterProducts(products, colors, pending).length,
    [products, colors, pending],
  );

  function apply() {
    router.push(buildCatalogHref(pathname, pending), { scroll: false });
    setOpen(false);
  }

  function reset() {
    setPending(emptyEditableFilters());
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)} className="lg:hidden">
        {ru.catalog.filters.openMobile}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="animate-fade-in absolute inset-0 bg-ink-strong/50"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={ru.catalog.filters.title}
            tabIndex={-1}
            className={cn(
              "animate-fade-in relative flex max-h-[85vh] flex-col rounded-t-base border-t border-border bg-bg",
              "focus:outline-none",
            )}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <h2 className="font-heading text-xl text-ink-strong">{ru.catalog.filters.title}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={ru.catalog.filters.closeMobile}
                className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline"
              >
                {ru.catalog.filters.closeMobile}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <FilterControls value={pending} onChange={setPending} colors={colors} idPrefix="mobile" />
            </div>

            <div className="flex items-center gap-3 border-t border-border px-4 py-4">
              <Button variant="ghost" onClick={reset} className="flex-1">
                {ru.catalog.filters.reset}
              </Button>
              <Button onClick={apply} className="flex-1">
                {formatMessage(ru.catalog.filters.showResults, { count: pendingCount })}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
