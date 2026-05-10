import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import InquiryInbox from "../_components/inquiry-inbox";
import { getMockInquiries } from "../_data/mock-inquiries";
import { getInquiriesForUser } from "../_data/inquiries";

export default async function InquiriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  // Auth guard double-check (layout already guards, but good practice)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Real inquiries — fall back to mock when empty (pre-launch demo)
  const realInquiries = user ? await getInquiriesForUser(user.id) : [];
  const mockInquiries = getMockInquiries();
  const inquiries = realInquiries.length > 0 ? realInquiries : mockInquiries;

  // Build listing title lookup from the inquiries themselves
  const listingTitles: Record<string, string> = {};
  for (const inq of inquiries) {
    listingTitles[inq.listing_id] =
      locale === "ar" ? inq.listing_title_ar : inq.listing_title_en;
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
