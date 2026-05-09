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
      <span className="inline-block rounded-[var(--radius-pill)] bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-bright uppercase tracking-wider">
        Featured
      </span>
    );
  }
  return (
    <span className="inline-block rounded-[var(--radius-pill)] bg-earth-soft border border-gold/20 px-3 py-1 text-xs text-mute-soft uppercase tracking-wider">
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
    <div className="overflow-x-auto rounded-[var(--radius-card)] border border-gold/15">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gold/10 bg-earth-soft/50">
            <th className="px-5 py-4 text-start text-xs uppercase tracking-wider text-mute-soft font-semibold w-16">
              {labels.thumb}
            </th>
            <th className="px-5 py-4 text-start text-xs uppercase tracking-wider text-mute-soft font-semibold">
              {labels.title}
            </th>
            <th className="px-5 py-4 text-start text-xs uppercase tracking-wider text-mute-soft font-semibold">
              {labels.status}
            </th>
            <th className="px-5 py-4 text-end text-xs uppercase tracking-wider text-mute-soft font-semibold">
              {labels.views}
            </th>
            <th className="px-5 py-4 text-end text-xs uppercase tracking-wider text-mute-soft font-semibold">
              {labels.inquiries}
            </th>
            <th className="px-5 py-4 text-end text-xs uppercase tracking-wider text-mute-soft font-semibold">
              {labels.actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing, i) => {
            const title = locale === "ar" ? listing.titleAr : listing.titleEn;
            const views = viewsByListingId[listing.id] ?? 0;
            const inquiries = inquiriesByListingId[listing.id] ?? 0;

            return (
              <tr
                key={listing.id}
                className={[
                  "border-b border-gold/10 last:border-0 transition-colors hover:bg-earth-soft/40",
                  i % 2 === 0 ? "bg-transparent" : "bg-earth-soft/20",
                ].join(" ")}
              >
                {/* Thumbnail */}
                <td className="px-5 py-4">
                  <div className="card-watermark w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                    <SukanMark size={28} monochrome="gold" className="opacity-20" />
                  </div>
                </td>

                {/* Title */}
                <td className="px-5 py-4 max-w-[200px]">
                  <p className="text-parchment font-medium line-clamp-2 leading-snug">
                    {title}
                  </p>
                  <p className="text-xs text-mute-soft mt-0.5">
                    {locale === "ar" ? listing.cityAr : listing.city}
                  </p>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <StatusPill tier={listing.tier} />
                </td>

                {/* Views */}
                <td className="px-5 py-4 text-end font-display text-lg text-parchment">
                  {views.toLocaleString()}
                </td>

                {/* Inquiries */}
                <td className="px-5 py-4 text-end font-display text-lg text-parchment">
                  {inquiries}
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-end">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        console.log("edit stub", listing.id)
                      }
                      className="px-3 py-1.5 rounded-lg text-xs border border-gold/30 text-parchment hover:bg-gold/10 transition-colors"
                    >
                      {labels.edit}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        console.log("renew stub", listing.id)
                      }
                      className="px-3 py-1.5 rounded-lg text-xs border border-gold/30 text-mute-soft hover:text-parchment hover:bg-earth-soft transition-colors"
                    >
                      {labels.renew}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        console.log("archive stub", listing.id)
                      }
                      className="px-3 py-1.5 rounded-lg text-xs border border-terracotta/30 text-terracotta hover:bg-terracotta/10 transition-colors"
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
