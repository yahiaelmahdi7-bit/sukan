"use client";

import { useState } from "react";
import InquiryList from "./inquiry-list";
import InquiryDetail from "./inquiry-detail";
import type { MockInquiry } from "../_data/mock-inquiries";

interface InquiryInboxProps {
  inquiries: MockInquiry[];
  locale: string;
  listingTitles: Record<string, string>;
  labels: {
    unread: string;
    from: string;
    about: string;
    message: string;
    respondedAt: string;
    replyWhatsapp: string;
    replyPhone: string;
  };
}

export default function InquiryInbox({
  inquiries,
  locale,
  listingTitles,
  labels,
}: InquiryInboxProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    inquiries[0]?.id ?? null
  );

  const selected = inquiries.find((i) => i.id === selectedId) ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
      {/* Left: list */}
      <div className="lg:col-span-2">
        <InquiryList
          inquiries={inquiries}
          locale={locale}
          selectedId={selectedId}
          onSelect={setSelectedId}
          labels={labels}
          listingTitles={listingTitles}
        />
      </div>

      {/* Right: detail */}
      <div className="lg:col-span-3">
        {selected ? (
          <InquiryDetail
            inquiry={selected}
            locale={locale}
            listingTitle={listingTitles[selected.listing_id] ?? selected.listing_id}
            labels={labels}
          />
        ) : (
          <div
            className="flex items-center justify-center h-48 rounded-[var(--radius-card)] glass-warm border border-white/55 text-ink-mid text-sm"
            style={{ boxShadow: "var(--shadow-warm-sm)" }}
          >
            Select an inquiry to read
          </div>
        )}
      </div>
    </div>
  );
}
