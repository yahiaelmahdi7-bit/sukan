import { setRequestLocale, getTranslations } from "next-intl/server";
import { sampleListings } from "@/lib/sample-listings";
import InquiryInbox from "../_components/inquiry-inbox";
import { getMockInquiries } from "../_data/mock-inquiries";

export default async function InquiriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  const inquiries = getMockInquiries();

  // Build listing title lookup for the inbox
  const listingTitles: Record<string, string> = {};
  for (const listing of sampleListings) {
    listingTitles[listing.id] =
      locale === "ar" ? listing.titleAr : listing.titleEn;
  }

  const unreadCount = inquiries.filter((i) => !i.is_read).length;

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk mb-2">
          {t("title")}
        </p>
        <div className="flex items-center gap-4">
          <h1 className="font-display text-4xl text-ink">{t("inquiries")}</h1>
          {unreadCount > 0 && (
            <span
              className="rounded-[var(--radius-pill)] px-3 py-1 text-xs font-semibold text-cream"
              style={{
                background: "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
                boxShadow: "var(--shadow-terracotta-glow)",
              }}
            >
              {unreadCount} {t("inquiry.unread")}
            </span>
          )}
        </div>
      </div>

      <InquiryInbox
        inquiries={inquiries}
        locale={locale}
        listingTitles={listingTitles}
        labels={{
          unread: t("inquiry.unread"),
          from: t("inquiry.from"),
          about: t("inquiry.about"),
          message: t("inquiry.message"),
          respondedAt: t("inquiry.respondedAt"),
          replyWhatsapp: t("inquiry.replyWhatsapp"),
          replyPhone: t("inquiry.replyPhone"),
        }}
      />
    </div>
  );
}
