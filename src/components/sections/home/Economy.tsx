import { Fragment } from "react";
import { getLocale } from "next-intl/server";
import { cn } from "@/components/ui/cn";
import { getTypedMessages } from "@/i18n/get-messages";
import type { Locale } from "@/i18n/routing";
import {
  costTotals,
  getCostComparison,
  yearlyCost,
} from "@/lib/content/economy";
import { pickLocale } from "@/lib/content/locale";
import type { CostItem, CostOption, Currency } from "@/lib/content/types";
import { formatMessage } from "@/lib/format-message";
import { formatMoney } from "@/lib/format-price";

interface CostCardProps {
  option: CostOption;
  currency: Currency;
  locale: Locale;
  /** Чёрная карточка — вариант, который сайт продаёт (ленты). */
  featured: boolean;
  orLabel: string;
  timesTemplate: string;
  totalLabel: string;
}

function CostRow({
  item,
  currency,
  locale,
  timesTemplate,
  featured,
  lead,
}: {
  item: CostItem;
  currency: Currency;
  locale: Locale;
  timesTemplate: string;
  featured: boolean;
  /** Подпись над строкой, например «или» у второго способа обслуживания. */
  lead?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="text-sm leading-snug">
        {lead && (
          <span
            className={cn(
              "caps mb-1 block text-[11px]",
              featured ? "text-bg/60" : "text-ink-muted",
            )}
          >
            {lead}
          </span>
        )}
        {pickLocale(item.label, locale)}
      </dt>
      <dd className="flex shrink-0 flex-col items-end text-right tabular-nums">
        <span className="font-medium">
          {formatMoney(yearlyCost(item), currency, locale)}
        </span>
        {item.timesPerYear > 1 && (
          <span
            className={cn(
              "text-xs",
              featured ? "text-bg/60" : "text-ink-muted",
            )}
          >
            {formatMessage(timesTemplate, {
              price: formatMoney(item.price, currency, locale),
              count: item.timesPerYear,
            })}
          </span>
        )}
      </dd>
    </div>
  );
}

function CostCard({
  option,
  currency,
  locale,
  featured,
  orLabel,
  timesTemplate,
  totalLabel,
}: CostCardProps) {
  const totals = costTotals(option);
  const rowProps = { currency, locale, timesTemplate, featured };
  const divide = featured
    ? "divide-bg/15 border-bg/15"
    : "divide-border border-border";

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-base p-5 md:p-6",
        featured ? "bg-ink text-bg" : "border border-border bg-bg text-ink",
      )}
    >
      <h4 className={cn("text-lg font-medium", !featured && "text-ink-strong")}>
        {pickLocale(option.title, locale)}
      </h4>

      <dl className={cn("flex flex-col divide-y border-y", divide)}>
        {option.items.map((item) => (
          <CostRow key={item.label.ru} item={item} {...rowProps} />
        ))}
        {option.variants.map((variant, variantIndex) => (
          <Fragment key={variant.id}>
            {variant.items.map((item, itemIndex) => (
              <CostRow
                key={item.label.ru}
                item={item}
                lead={variantIndex > 0 && itemIndex === 0 ? orLabel : undefined}
                {...rowProps}
              />
            ))}
          </Fragment>
        ))}
      </dl>

      <div className="mt-auto flex flex-col gap-2">
        <p
          className={cn(
            "caps text-[12px]",
            featured ? "text-bg/60" : "text-ink-muted",
          )}
        >
          {totalLabel}
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {totals.map(({ variantId, total }) => {
            const variant = option.variants.find(
              (entry) => entry.id === variantId,
            );
            return (
              <div key={variantId ?? option.id} className="flex flex-col">
                {variant && (
                  <span
                    className={cn(
                      "text-sm",
                      featured ? "text-bg/75" : "text-ink-muted",
                    )}
                  >
                    {pickLocale(variant.title, locale)}
                  </span>
                )}
                <span
                  className={cn(
                    "font-heading text-[36px] leading-none lining-nums md:text-[44px]",
                    !featured && "text-ink-strong",
                  )}
                >
                  {formatMoney(total, currency, locale)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

export async function Economy() {
  const ru = await getTypedMessages();
  const locale = (await getLocale()) as Locale;
  const t = ru.home.economy;
  const { currency, options } = getCostComparison();

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-16">
        <h2 className="font-heading text-[32px] leading-tight text-ink-strong md:text-[44px]">
          {t.heading}
        </h2>
        <p className="text-base text-ink-muted lg:pt-2">{t.description}</p>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="caps text-ink-strong">{t.comparisonTitle}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {options.map((option, index) => (
            <CostCard
              key={option.id}
              option={option}
              currency={currency}
              locale={locale}
              featured={index === 0}
              orLabel={t.or}
              timesTemplate={t.times}
              totalLabel={t.totalLabel}
            />
          ))}
        </div>
        <p className="mt-2 font-heading text-[28px] leading-tight text-ink-strong md:text-[36px]">
          {t.verdict}
        </p>
        <p className="text-xs text-ink-muted">{t.disclaimer}</p>
      </div>
    </div>
  );
}
