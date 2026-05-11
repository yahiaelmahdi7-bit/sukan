"use client";

import { useFormatter, useTranslations, useLocale } from "next-intl";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

export interface PriceHistoryEntry {
  price: number;
  date: string;
  currency: "USD" | "SDG";
}

interface PriceHistoryTimelineProps {
  history: PriceHistoryEntry[];
}

export function PriceHistoryTimeline({ history }: PriceHistoryTimelineProps) {
  const t = useTranslations();
  const format = useFormatter();
  const locale = useLocale();

  if (history.length < 2) return null;

  // Render oldest → newest left-to-right (history is stored newest-first).
  const ordered = [...history].reverse();

  return (
    <div
      aria-label={t("listing.priceHistory")}
      className="mt-2 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-cream-deep px-3 py-1.5 text-xs text-ink-mid"
    >
      <span className="font-medium uppercase tracking-[0.12em] text-[10px]">
        {t("listing.priceHistory")}
      </span>
      {ordered.map((entry, i) => {
        const prev = i > 0 ? ordered[i - 1] : undefined;
        const direction =
          prev === undefined
            ? "first"
            : entry.price < prev.price
            ? "down"
            : entry.price > prev.price
            ? "up"
            : "flat";

        const arrowIcon =
          direction === "down" ? (
            <TrendingDown size={11} className="text-emerald-600" aria-hidden />
          ) : direction === "up" ? (
            <TrendingUp size={11} className="text-rose-500" aria-hidden />
          ) : direction === "flat" ? (
            <Minus size={11} aria-hidden />
          ) : null;

        const dateLabel = format.dateTime(new Date(entry.date), {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        const priceLabel =
          entry.currency === "USD"
            ? format.number(entry.price, {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              })
            : `${format.number(entry.price, { maximumFractionDigits: 0 })} ${
                locale === "ar" ? "ج.س" : "SDG"
              }`;

        return (
          <span key={`${entry.date}-${entry.price}`} className="inline-flex items-center gap-1">
            {arrowIcon}
            <span className="font-medium text-ink">{priceLabel}</span>
            <span className="opacity-70">· {dateLabel}</span>
            {i < ordered.length - 1 && <span aria-hidden className="opacity-50">→</span>}
          </span>
        );
      })}
    </div>
  );
}
