"use client";

import { useState, useEffect } from "react";
import { Scale, X, BedDouble, Bath, Maximize2 } from "lucide-react";
import Image from "next/image";
import EmptyState from "@/components/empty-state";
import {
  getCompareItems,
  removeFromCompare,
  subscribeCompare,
  type CompareItem,
} from "@/lib/compare";

// ── Constants ──────────────────────────────────────────────────────────────

const SDG_PER_USD = 600;

// ── Column ─────────────────────────────────────────────────────────────────

function CompareColumn({ item }: { item: CompareItem }) {
  const sdgMonthly = item.priceUsd * SDG_PER_USD;

  return (
    <div
      className="flex flex-col overflow-hidden rounded-[var(--radius-glass)] border border-sand-dk"
      style={{ boxShadow: "var(--shadow-warm-sm)" }}
    >
      {/* Photo */}
      <div className="relative" style={{ height: 240 }}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
          priority
        />
        {/* gradient overlay */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/30 via-ink/5 to-ink/0"
        />
      </div>

      {/* Attributes */}
      <div className="flex flex-1 flex-col gap-0 divide-y divide-sand-dk bg-card">
        {/* Title */}
        <div className="p-4">
          <h3 className="line-clamp-2 font-display text-xl leading-snug text-ink">
            {item.title}
          </h3>
        </div>

        {/* Price */}
        <div className="px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-ink-mid/70">
            Price {/* TODO: i18n */}
          </p>
          <p className="mt-1 font-display text-2xl text-terracotta">
            ${item.priceUsd.toLocaleString()}
          </p>
          <p className="mt-0.5 text-[11px] text-ink-mid">
            ≈ {sdgMonthly.toLocaleString()} SDG/mo {/* TODO: i18n */}
          </p>
        </div>

        {/* State */}
        <div className="px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-ink-mid/70">
            State {/* TODO: i18n */}
          </p>
          <p className="mt-1 text-sm font-medium text-ink">{item.state}</p>
        </div>

        {/* Beds */}
        <div className="px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-ink-mid/70">
            Bedrooms {/* TODO: i18n */}
          </p>
          {item.bedrooms !== undefined ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink">
              <BedDouble size={14} className="text-gold" />
              {item.bedrooms}
            </p>
          ) : (
            <p className="mt-1 text-sm text-ink-mid/50">—</p>
          )}
        </div>

        {/* Baths */}
        <div className="px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-ink-mid/70">
            Bathrooms {/* TODO: i18n */}
          </p>
          {item.bathrooms !== undefined ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink">
              <Bath size={14} className="text-gold" />
              {item.bathrooms}
            </p>
          ) : (
            <p className="mt-1 text-sm text-ink-mid/50">—</p>
          )}
        </div>

        {/* Area */}
        <div className="px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-ink-mid/70">
            Area {/* TODO: i18n */}
          </p>
          {item.areaSqm !== undefined ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink">
              <Maximize2 size={14} className="text-gold" />
              {item.areaSqm.toLocaleString()} m²
            </p>
          ) : (
            <p className="mt-1 text-sm text-ink-mid/50">—</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 p-4">
          <a
            href={`/listings/${item.id}`}
            className="inline-flex w-full items-center justify-center rounded-[var(--radius-pill)] px-4 py-2 text-sm font-semibold text-cream transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
              boxShadow:
                "0 4px 14px rgba(200,64,26,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            View listing → {/* TODO: i18n */}
          </a>
          <button
            type="button"
            onClick={() => removeFromCompare(item.id)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-pill)] border border-sand-dk py-2 text-sm text-ink-mid transition-colors hover:border-terracotta/40 hover:text-terracotta"
          >
            <X size={13} />
            Remove {/* TODO: i18n */}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function CompareSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-[var(--radius-glass)] border border-sand-dk"
          style={{ height: 520, background: "rgba(240,230,208,0.4)" }}
        />
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function ComparePage() {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getCompareItems());
    return subscribeCompare(() => setItems(getCompareItems()));
  }, []);

  // Grid class based on item count
  const gridClass =
    items.length === 1
      ? "grid-cols-1 max-w-sm"
      : items.length === 2
      ? "grid-cols-1 sm:grid-cols-2 max-w-2xl"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dk">
          Side by side {/* TODO: i18n */}
        </p>
        <h1 className="font-display text-4xl text-ink">
          Compare properties {/* TODO: i18n */}
        </h1>
        {mounted && items.length > 0 && (
          <p className="text-sm text-ink-mid">
            {items.length} of 3 selected {/* TODO: i18n */}
          </p>
        )}
      </div>

      {/* SSR loading skeleton */}
      {!mounted && <CompareSkeleton />}

      {/* Empty state */}
      {mounted && items.length === 0 && (
        <EmptyState
          icon={<Scale size={26} />}
          title="Nothing to compare yet" // TODO: i18n
          body="Browse listings and tap the scale icon on any card to add it here. You can compare up to 3 properties side by side." // TODO: i18n
          primaryCta={{ label: "Browse listings", href: "/listings" }} // TODO: i18n
        />
      )}

      {/* Comparison grid */}
      {mounted && items.length > 0 && (
        <>
          <div className={`grid gap-6 ${gridClass}`}>
            {items.map((item) => (
              <CompareColumn key={item.id} item={item} />
            ))}
          </div>

          {/* Browse more CTA — shown when fewer than 3 */}
          {items.length < 3 && (
            <div className="mt-10 flex flex-col items-center gap-3 text-center">
              <p className="text-sm text-ink-mid">
                Add {3 - items.length} more propert{items.length === 2 ? "y" : "ies"} to fill the comparison {/* TODO: i18n */}
              </p>
              <a
                href="/listings"
                className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-gold/40 bg-white/45 px-6 py-2.5 text-sm font-semibold text-gold-dk backdrop-blur-md transition-colors hover:border-gold/70 hover:bg-gold/10 hover:text-terracotta"
              >
                Browse more listings {/* TODO: i18n */}
              </a>
            </div>
          )}
        </>
      )}
    </main>
  );
}
