"use client";

import type { MockInquiry } from "../_data/mock-inquiries";

interface InquiryDetailProps {
  inquiry: MockInquiry;
  locale: string;
  listingTitle: string;
  labels: {
    from: string;
    about: string;
    message: string;
    respondedAt: string;
    replyWhatsapp: string;
    replyPhone: string;
  };
}

function formatDateTime(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleString(locale === "ar" ? "ar-SD" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function InquiryDetail({
  inquiry,
  locale,
  listingTitle,
  labels,
}: InquiryDetailProps) {
  const name =
    locale === "ar"
      ? inquiry.inquirer_name_ar
      : inquiry.inquirer_name_en;
  const message =
    locale === "ar" ? inquiry.message_ar : inquiry.message_en;

  const waLink = `https://wa.me/${inquiry.inquirer_phone.replace(/\D/g, "")}?text=${encodeURIComponent(
    locale === "ar"
      ? `مرحباً ${name}، شكراً على استفسارك عن ${listingTitle}.`
      : `Hi ${name}, thanks for your inquiry about ${listingTitle}.`
  )}`;

  return (
    <div
      className="glass-warm glass-highlight rounded-[var(--radius-card)] border border-white/55 p-7 flex flex-col gap-6 h-full"
      style={{ boxShadow: "var(--shadow-glass)" }}
    >
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-gold-dk font-semibold mb-1">
          {labels.from}
        </p>
        <p className="text-xl font-display text-ink">{name}</p>
        <p className="text-sm text-ink-mid mt-1">
          {inquiry.inquirer_phone}
        </p>
      </div>

      {/* About listing */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-gold-dk font-semibold mb-1">
          {labels.about}
        </p>
        <p className="text-sm text-ink">{listingTitle}</p>
      </div>

      {/* Message */}
      <div className="flex-1">
        <p className="text-[10px] uppercase tracking-widest text-gold-dk font-semibold mb-3">
          {labels.message}
        </p>
        <div
          className="rounded-[10px] border border-white/60 bg-white/50 p-5 backdrop-blur-sm"
          style={{ boxShadow: "var(--shadow-warm-sm)" }}
        >
          <p className="text-sm text-ink leading-relaxed">{message}</p>
        </div>
      </div>

      {/* Date */}
      <p className="text-xs text-ink-mid">
        {labels.respondedAt}:{" "}
        {formatDateTime(inquiry.created_at, locale)}
      </p>

      {/* CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="smooth flex-1 flex items-center justify-center gap-2 rounded-[var(--radius-pill)] text-cream px-5 py-3 text-sm font-semibold"
          style={{
            background: "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
            boxShadow: "0 8px 22px rgba(200, 64, 26, 0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
          }}
        >
          {labels.replyWhatsapp}
        </a>
        <a
          href={`tel:${inquiry.inquirer_phone}`}
          className="smooth-fast flex-1 flex items-center justify-center gap-2 rounded-[var(--radius-pill)] border border-gold/40 bg-white/45 text-ink-soft px-5 py-3 text-sm hover:border-gold/70 hover:bg-gold/10 hover:text-terracotta backdrop-blur-sm"
        >
          {labels.replyPhone}
        </a>
      </div>
    </div>
  );
}
