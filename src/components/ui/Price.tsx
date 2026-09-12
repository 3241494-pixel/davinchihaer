"use client";

import { useLocale } from "next-intl";
import { formatPrice } from "@/lib/format-price";

export interface PriceProps {
  /** целое число евроцентов, см. lib/content/types */
  cents: number;
  /**
   * Значение для подписи «≈ N ₾» под локаль ka. Конвертера в проекте нет
   * (см. CLAUDE.md, раздел «Деньги») — слот зарезервирован на будущее и
   * рендерится, только если значение явно передано.
   */
  gelApprox?: string;
  className?: string;
}

export function Price({ cents, gelApprox, className }: PriceProps) {
  const locale = useLocale();

  return (
    <span className={className}>
      {formatPrice(cents, locale)}
      {gelApprox && <span className="ml-1.5 text-sm text-ink-muted">≈ {gelApprox} ₾</span>}
    </span>
  );
}
