"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { cn } from "@/components/ui/cn";
import { pickLocale } from "@/lib/content/locale";
import { useTypedMessages } from "@/i18n/use-messages";
import { useVariantSelection } from "./variant-context";

export const PRODUCT_ACTIONS_ID = "product-actions";

/**
 * Нижняя панель с кнопкой заявки на мобильном. Появляется, когда основные
 * кнопки ушли вверх за экран, и прячется у формы заявки, чтобы не дублировать её.
 */
export function ProductStickyBar() {
  const ru = useTypedMessages();
  const locale = useLocale();
  const { product, selectedVariant } = useVariantSelection();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    function update() {
      ticking = false;
      const actions = document.getElementById(PRODUCT_ACTIONS_ID);
      const form = document.getElementById("lead-form");
      if (!actions || !form) return;
      const actionsGone = actions.getBoundingClientRect().bottom < 0;
      const formAhead = form.getBoundingClientRect().top > window.innerHeight;
      setVisible(actionsGone && formAhead);
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    document
      .getElementById("lead-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      data-sticky-cta={visible ? "visible" : "hidden"}
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur transition duration-300 md:hidden",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="caps truncate text-[11px] text-ink-muted">
            {pickLocale(product.title, locale)}
          </span>
          {selectedVariant?.price !== undefined ? (
            <Price
              cents={selectedVariant.price}
              className="text-[15px] font-medium tabular-nums text-ink"
            />
          ) : (
            <span className="text-[15px] font-medium text-ink">
              {ru.product.priceOnRequest}
            </span>
          )}
        </div>
        <Button asChild variant="primary" size="md" className="shrink-0">
          <a
            href="#lead-form"
            onClick={handleClick}
            tabIndex={visible ? 0 : -1}
          >
            {ru.product.cta.leadForm}
          </a>
        </Button>
      </div>
    </div>
  );
}
