import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import InquiryInboxList from "./_components/inquiry-inbox-list";
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Real inquiries — fall back to mock when empty (pre-launch demo)
  const realInquiries = user ? await getInquiriesForUser(user.id) : [];
  const mockInquiries = getMockInquiries();
  const inquiries = realInquiries.length > 0 ? realInquiries : mockInquiries;
  const isReal = realInquiries.length > 0;

  // Batch-fetch last message per inquiry (single query, not N+1)
  let lastMessageMap: Record<string, { body: string | null; created_at: string }> = {};
  let unreadCountMap: Record<string, number> = {};

  if (user && isReal && inquiries.length > 0) {
    const inquiryIds = inquiries.map((i) => i.id);

    // All messages for these inquiries in one shot, then group in JS
    const { data: allMsgs } = await supabase
      .from("messages")
      .select("id, inquiry_id, sender_id, body, read_at, created_at")
      .in("inquiry_id", inquiryIds)
      .order("created_at", { ascending: false });

    if (allMsgs) {
      for (const msg of allMsgs) {
        const iid = msg.inquiry_id as string;
        // Last message per inquiry (first occurrence since sorted desc)
        if (!lastMessageMap[iid]) {
          lastMessageMap[iid] = {
            body: msg.body as string | null,
            created_at: msg.created_at as string,
          };
        }
        // Count unread from counterparty
        if (
          msg.sender_id !== user.id &&
          msg.read_at === null
        ) {
          unreadCountMap[iid] = (unreadCountMap[iid] ?? 0) + 1;
        }
      }
    }
  }

  const totalUnread = Object.values(unreadCountMap).reduce((s, n) => s + n, 0);

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk mb-2">
          {t("title")}
        </p>
        <div className="flex items-center gap-4">
          <h1 className="font-display text-4xl text-ink">{t("inquiries")}</h1>
          {totalUnread > 0 && (
            <span
              className="rounded-[var(--radius-pill)] px-3 py-1 text-xs font-semibold text-cream"
              style={{
                background: "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
                boxShadow: "var(--shadow-terracotta-glow)",
              }}
            >
              {totalUnread} {t("inquiry.unread")}
            </span>
          )}
        </div>
      </div>

      <InquiryInboxList
        inquiries={inquiries}
        locale={locale}
        isReal={isReal}
        lastMessageMap={lastMessageMap}
        unreadCountMap={unreadCountMap}
        labels={{
          unread: t("inquiry.unread"),
          from: t("inquiry.from"),
          about: t("inquiry.about"),
          message: t("inquiry.message"),
        }}
      />
    </div>
  );
}
