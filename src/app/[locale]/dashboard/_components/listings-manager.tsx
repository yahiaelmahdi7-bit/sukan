"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import type { Listing } from "@/lib/sample-listings";
import ListingRow from "./listing-row";

type SortKey = "newest" | "views" | "inquiries" | "price-asc" | "price-desc";
type FilterStatus = "all" | "active" | "draft" | "pending";

// Deterministic seed helpers for per-listing stats
function seeded(seed: string, min: number, max: number): number {
  const hash = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return min + (hash % (max - min + 1));
}

function viewsForListing(listing: Listing, baseViews: number): number {
  return baseViews > 0 ? baseViews : seeded(listing.id, 8, 120);
}

function savesForListing(listing: Listing): number {
  return seeded(listing.id + "sv", 1, 22);
}

function relativeTime(createdAt: string | undefined): string {
  if (!createdAt) return "—";
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const mins = Math.floor(diffMs / 60e3);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(diffMs / 3600e3);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diffMs / 86400e3);
  return `${days}d ago`;
}

interface ListingsManagerProps {
  listings: Listing[];
  locale: string;
  viewsByListingId: Record<string, number>;
  inquiriesByListingId: Record<string, number>;
  labels: {
    filterAll: string;
    filterActive: string;
    filterDraft: string;
    filterPending: string;
    sortNewest: string;
    sortViews: string;
    sortInquiries: string;
    sortPriceLow: string;
    sortPriceHigh: string;
    searchPlaceholder: string;
    active: string;
    draft: string;
    pending: string;
    featured: string;
    edit: string;
    pause: string;
    boost: string;
    duplicate: string;
    delete: string;
    viewsLabel: string;
    inquiriesLabel: string;
    savesLabel: string;
    lastActivity: string;
    noResults: string;
  };
}

export default function ListingsManager({
  listings,
  locale,
  viewsByListingId,
  inquiriesByListingId,
  labels,
}: ListingsManagerProps) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [query, setQuery] = useState("");

  const rowLabels = {
    active: labels.active,
    draft: labels.draft,
    pending: labels.pending,
    featured: labels.featured,
    edit: labels.edit,
    pause: labels.pause,
    boost: labels.boost,
    duplicate: labels.duplicate,
    delete: labels.delete,
    viewsLabel: labels.viewsLabel,
    inquiriesLabel: labels.inquiriesLabel,
    savesLabel: labels.savesLabel,
    lastActivity: labels.lastActivity,
  };

  const filtered = useMemo(() => {
    let result = [...listings];

    // Status filter (simplified: we use tier as proxy for now)
    if (filterStatus === "active") {
      result = result.filter((l) => l.tier === "standard" || l.tier === "featured");
    } else if (filterStatus === "draft") {
      result = [];
    } else if (filterStatus === "pending") {
      result = [];
    }

    // Text search
    if (query.trim().length > 0) {
      const q = query.toLowerCase();
      result = result.filter(
        (l) =>
          l.titleEn.toLowerCase().includes(q) ||
          l.titleAr.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.cityAr.toLowerCase().includes(q),
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortKey === "views") {
        return (
          viewsForListing(b, viewsByListingId[b.id] ?? 0) -
          viewsForListing(a, viewsByListingId[a.id] ?? 0)
        );
      }
      if (sortKey === "inquiries") {
        return (
          (inquiriesByListingId[b.id] ?? 0) -
          (inquiriesByListingId[a.id] ?? 0)
        );
      }
      if (sortKey === "price-asc") return a.priceUsd - b.priceUsd;
      if (sortKey === "price-desc") return b.priceUsd - a.priceUsd;
      // default: newest (by createdAt or stable id order)
      const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tB - tA;
    });

    return result;
  }, [listings, filterStatus, sortKey, query, viewsByListingId, inquiriesByListingId]);

  const filterPills: { key: FilterStatus; label: string }[] = [
    { key: "all", label: labels.filterAll },
    { key: "active", label: labels.filterActive },
    { key: "draft", label: labels.filterDraft },
    { key: "pending", label: labels.filterPending },
  ];

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "newest", label: labels.sortNewest },
    { key: "views", label: labels.sortViews },
    { key: "inquiries", label: labels.sortInquiries },
    { key: "price-asc", label: labels.sortPriceLow },
    { key: "price-desc", label: labels.sortPriceHigh },
  ];

  const activeSortLabel =
    sortOptions.find((o) => o.key === sortKey)?.label ?? labels.sortNewest;

  return (
    <div className="flex flex-col gap-5">
      {/* Filter + sort bar */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        {/* Status filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          {filterPills.map((pill) => (
            <button
              key={pill.key}
              type="button"
              onClick={() => setFilterStatus(pill.key)}
              aria-pressed={filterStatus === pill.key}
              className={[
                "smooth-fast rounded-[var(--radius-pill)] px-4 py-1.5 text-xs font-semibold border",
                filterStatus === pill.key
                  ? "border-terracotta/60 bg-terracotta/10 text-terracotta"
                  : "border-white/60 bg-white/45 text-ink-mid hover:border-gold/50 hover:text-ink backdrop-blur-sm",
              ].join(" ")}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="smooth-fast appearance-none cursor-pointer rounded-[var(--radius-pill)] border border-white/60 bg-white/45 py-1.5 ps-4 pe-8 text-xs font-semibold text-ink-mid hover:border-gold/50 hover:text-ink backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-gold/40"
            >
              {sortOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2 text-ink-mid"
              aria-hidden
            />
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={13}
              className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-ink-mid"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.searchPlaceholder}
              aria-label={labels.searchPlaceholder}
              className="smooth-fast rounded-[var(--radius-pill)] border border-white/60 bg-white/45 py-1.5 ps-8 pe-4 text-xs text-ink placeholder:text-ink-mid/60 hover:border-gold/50 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-gold/40 w-40 sm:w-52"
            />
          </div>
        </div>
      </div>

      {/* Listing rows */}
      <div
        className="overflow-hidden glass-warm glass-highlight rounded-[var(--radius-glass)]"
        style={{ boxShadow: "var(--shadow-glass)" }}
      >
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-mid">{labels.noResults}</p>
        ) : (
          filtered.map((listing) => {
            const v = viewsForListing(listing, viewsByListingId[listing.id] ?? 0);
            const inq = inquiriesByListingId[listing.id] ?? 0;
            const sv = savesForListing(listing);
            const lastAct = relativeTime(listing.createdAt);
            return (
              <ListingRow
                key={listing.id}
                listing={listing}
                locale={locale}
                views={v}
                inquiries={inq}
                saves={sv}
                lastActivity={lastAct}
                labels={rowLabels}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
