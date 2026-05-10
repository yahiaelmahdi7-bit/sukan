"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import type { Inquiry } from "../../_data/inquiry-types";

interface InquiryInboxListProps {
  inquiries: Inquiry[];
  locale: string;
  isReal: boolean;
  lastMessageMap: Record<string, { body: string | null; created_at: string }>;
  unreadCountMap: Record<string, number>;
  labels: {
    unread: string;
    from: string;
    about: string;
    message: string;
  };
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

export default function InquiryInboxList({
  inquiries,
  locale,
  isReal,
  lastMessageMap,
  unreadCountMap,
  labels,
}: InquiryInboxListProps) {
  const currentLocale = useLocale();

  if (inquiries.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-48 rounded-[var(--radius-card)] glass-warm border border-white/55 text-ink-mid text-sm"
        style={{ boxShadow: "var(--shadow-warm-sm)" }}
      >
        {locale === "ar" ? "لا توجد استفسارات بعد" : "No inquiries yet"}
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {inquiries.map((inq) => {
        const name =
          locale === "ar" ? inq.inquirer_name_ar : inq.inquirer_name_en;
        const listingTitle =
          locale === "ar" ? inq.listing_title_ar : inq.listing_title_en;

        // Use last message body if available (real inquiries), else fall back
        // to the original message field
        const preview = isReal
          ? (lastMessageMap[inq.id]?.body ?? (locale === "ar" ? inq.message_ar : inq.message_en))
          : (locale === "ar" ? inq.message_ar : inq.message_en);

        const unreadCount = unreadCountMap[inq.id] ?? 0;
        const hasUnread = unreadCount > 0;
        const dateIso = lastMessageMap[inq.id]?.created_at ?? inq.created_at;

        // For real inquiries, link to the thread page; mock ones fall through to same page
        const href = isReal
          ? `/${currentLocale}/dashboard/inquiries/${inq.id}`
          : `/${currentLocale}/dashboard/inquiries`;

        return (
          <li key={inq.id}>
            <Link
              href={href}
              className={[
                "smooth-fast block w-full text-start px-4 py-4 rounded-[var(--radius-card)] border",
                "glass-warm border-white/50 hover:bg-white/55 hover:border-white/70",
              ].join(" ")}
              style={{ boxShadow: "var(--shadow-warm-sm)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {hasUnread && (
                      <span
                        className="w-2 h-2 rounded-full bg-terracotta shrink-0"
                        aria-label={labels.unread}
                        style={{ boxShadow: "var(--shadow-terracotta-glow)" }}
                      />
                    )}
                    <span className="font-semibold text-sm truncate text-ink">
                      {name}
                    </span>
                    {unreadCount > 0 && (
                      <span
                        className="ms-auto flex-none text-[10px] font-semibold text-cream rounded-full px-1.5 py-0.5"
                        style={{
                          background:
                            "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-mid truncate">{listingTitle}</p>
                  {preview && (
                    <p className="text-xs text-ink-mid mt-1 line-clamp-1 opacity-80">
                      {preview}
                    </p>
                  )}
                </div>
                <span className="text-xs text-ink-mid whitespace-nowrap shrink-0 mt-0.5">
                  {formatDate(dateIso, locale)}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
