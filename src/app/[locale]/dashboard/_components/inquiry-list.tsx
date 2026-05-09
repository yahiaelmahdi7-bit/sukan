"use client";

import type { MockInquiry } from "../_data/mock-inquiries";

interface InquiryListProps {
  inquiries: MockInquiry[];
  locale: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  labels: {
    unread: string;
    from: string;
    about: string;
  };
  listingTitles: Record<string, string>;
}

function formatDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(locale === "ar" ? "ar-SD" : "en-GB", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

export default function InquiryList({
  inquiries,
  locale,
  selectedId,
  onSelect,
  labels,
  listingTitles,
}: InquiryListProps) {
  return (
    <ul className="flex flex-col gap-1">
      {inquiries.map((inq) => {
        const isSelected = inq.id === selectedId;
        const name =
          locale === "ar" ? inq.inquirer_name_ar : inq.inquirer_name_en;
        const listingTitle = listingTitles[inq.listing_id] ?? inq.listing_id;

        return (
          <li key={inq.id}>
            <button
              type="button"
              onClick={() => onSelect(inq.id)}
              className={[
                "w-full text-start px-4 py-4 rounded-[var(--radius-card)] border transition-colors",
                isSelected
                  ? "border-gold/40 bg-gold/8 text-parchment"
                  : "border-gold/10 bg-earth-soft hover:border-gold/25 hover:bg-earth-soft/80 text-parchment",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {!inq.is_read && (
                      <span className="w-2 h-2 rounded-full bg-terracotta shrink-0" aria-label={labels.unread} />
                    )}
                    <span className="font-semibold text-sm truncate">{name}</span>
                  </div>
                  <p className="text-xs text-mute-soft truncate">{listingTitle}</p>
                  <p className="text-xs text-mute-soft mt-1 line-clamp-1">
                    {locale === "ar" ? inq.message_ar : inq.message_en}
                  </p>
                </div>
                <span className="text-xs text-mute-soft whitespace-nowrap shrink-0 mt-0.5">
                  {formatDate(inq.created_at, locale)}
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
