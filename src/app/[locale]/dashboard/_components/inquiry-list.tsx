"use client";

import type { Inquiry } from "../_data/inquiry-types";

interface InquiryListProps {
  inquiries: Inquiry[];
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
    <ul className="flex flex-col gap-1.5">
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
                "smooth-fast w-full text-start px-4 py-4 rounded-[var(--radius-card)] border",
                isSelected
                  ? "border-white/70 bg-white/70 backdrop-blur-md"
                  : "glass-warm border-white/50 hover:bg-white/55",
              ].join(" ")}
              style={
                isSelected
                  ? { boxShadow: "var(--shadow-gold-glow)" }
                  : { boxShadow: "var(--shadow-warm-sm)" }
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {!inq.is_read && (
                      <span
                        className="w-2 h-2 rounded-full bg-terracotta shrink-0"
                        aria-label={labels.unread}
                        style={{ boxShadow: "var(--shadow-terracotta-glow)" }}
                      />
                    )}
                    <span className="font-semibold text-sm truncate text-ink">{name}</span>
                  </div>
                  <p className="text-xs text-ink-mid truncate">{listingTitle}</p>
                  <p className="text-xs text-ink-mid mt-1 line-clamp-1">
                    {locale === "ar" ? inq.message_ar : inq.message_en}
                  </p>
                </div>
                <span className="text-xs text-ink-mid whitespace-nowrap shrink-0 mt-0.5">
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
