"use client";

import SukanMark from "@/components/sukan-mark";
import type { Listing } from "@/lib/sample-listings";

interface DashboardTableProps {
  listings: Listing[];
  locale: string;
  labels: {
    thumb: string;
    title: string;
    status: string;
    views: string;
    inquiries: string;
    actions: string;
    edit: string;
    renew: string;
    archive: string;
  };
  /** Mock view counts per listing id */
  viewsByListingId: Record<string, number>;
  /** Mock inquiry counts per listing id */
  inquiriesByListingId: Record<string, number>;
}

function StatusPill({ tier }: { tier: Listing["tier"] }) {
  if (tier === "featured") {
    return (
      <span
        className="inline-block rounded-[var(--radius-pill)] px-3 py-1 text-[10px] font-semibold text-earth uppercase tracking-wider"
        style={{
          background: "linear-gradient(135deg, #e0a857 0%, #c8873a 100%)",
          boxShadow: "0 2px 8px rgba(200, 135, 58, 0.30)",
        }}
      >
        Featured
      </span>
    );
  }
  return (
    <span className="inline-block rounded-[var(--radius-pill)] border border-white/60 bg-white/50 px-3 py-1 text-[10px] text-ink-mid uppercase tracking-wider backdrop-blur-sm">
      Active
    </span>
  );
}

export default function DashboardTable({
  listings,
  locale,
  labels,
  viewsByListingId,
  inquiriesByListingId,
}: DashboardTableProps) {
  return (
    <div
      className="overflow-x-auto glass-warm glass-highlight rounded-[var(--radius-card)]"
      style={{ boxShadow: "var(--shadow-glass)" }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/40 bg-white/20">
            <th className="px-5 py-4 text-start text-[10px] uppercase tracking-widest text-gold-dk font-semibold w-16">
              {labels.thumb}
            </th>
            <th className="px-5 py-4 text-start text-[10px] uppercase tracking-widest text-gold-dk font-semibold">
              {labels.title}
            </th>
            <th className="px-5 py-4 text-start text-[10px] uppercase tracking-widest text-gold-dk font-semibold">
              {labels.status}
            </th>
            <th className="px-5 py-4 text-end text-[10px] uppercase tracking-widest text-gold-dk font-semibold">
              {labels.views}
            </th>
            <th className="px-5 py-4 text-end text-[10px] uppercase tracking-widest text-gold-dk font-semibold">
              {labels.inquiries}
            </th>
            <th className="px-5 py-4 text-end text-[10px] uppercase tracking-widest text-gold-dk font-semibold">
              {labels.actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => {
            const title = locale === "ar" ? listing.titleAr : listing.titleEn;
            const views = viewsByListingId[listing.id] ?? 0;
            const inquiries = inquiriesByListingId[listing.id] ?? 0;

            return (
              <tr
                key={listing.id}
                className="smooth-fast border-b border-white/30 last:border-0 hover:bg-white/35 group"
                style={{ ["--hover-shadow" as string]: "var(--shadow-gold-glow)" }}
              >
                {/* Thumbnail */}
                <td className="px-5 py-4">
                  <div className="card-watermark w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                    <SukanMark size={26} className="opacity-25" />
                  </div>
                </td>

                {/* Title */}
                <td className="px-5 py-4 max-w-[200px]">
                  <p className="text-ink font-medium line-clamp-2 leading-snug">
                    {title}
                  </p>
                  <p className="text-xs text-ink-mid mt-0.5">
                    {locale === "ar" ? listing.cityAr : listing.city}
                  </p>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <StatusPill tier={listing.tier} />
                </td>

                {/* Views */}
                <td className="px-5 py-4 text-end font-display text-xl text-ink">
                  {views.toLocaleString()}
                </td>

                {/* Inquiries */}
                <td className="px-5 py-4 text-end font-display text-xl text-ink">
                  {inquiries}
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-end">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => console.log("edit stub", listing.id)}
                      className="smooth-fast px-3 py-1.5 rounded-[var(--radius-pill)] text-xs border border-gold/40 bg-white/45 text-ink-soft hover:border-gold/70 hover:bg-gold/10 hover:text-terracotta backdrop-blur-sm"
                    >
                      {labels.edit}
                    </button>
                    <button
                      type="button"
                      onClick={() => console.log("renew stub", listing.id)}
                      className="smooth-fast px-3 py-1.5 rounded-[var(--radius-pill)] text-xs border border-white/60 bg-white/40 text-ink-mid hover:border-gold/40 hover:text-ink backdrop-blur-sm"
                    >
                      {labels.renew}
                    </button>
                    <button
                      type="button"
                      onClick={() => console.log("archive stub", listing.id)}
                      className="smooth-fast px-3 py-1.5 rounded-[var(--radius-pill)] text-xs border border-terracotta/30 text-terracotta hover:bg-terracotta/10 backdrop-blur-sm"
                    >
                      {labels.archive}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
