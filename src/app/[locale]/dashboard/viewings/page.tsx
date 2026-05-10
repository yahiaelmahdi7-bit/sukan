import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import GlassPanel from "@/components/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";

// ── Types ───────────────────────────────────────────────────────────────────

type ViewingStatus = "pending" | "confirmed" | "cancelled";

type ViewingRequest = {
  id: string;
  listing_id: string;
  listing_title_en: string;
  listing_title_ar: string;
  requester_name: string;
  requester_phone: string;
  preferred_date: string;
  preferred_time: string;
  status: ViewingStatus;
  created_at: string;
};

// ── Server actions ──────────────────────────────────────────────────────────

async function confirmViewing(formData: FormData) {
  "use server";
  const viewingId = formData.get("viewingId") as string;
  if (!viewingId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  try {
    await supabase
      .from("viewing_requests")
      .update({ status: "confirmed" })
      .eq("id", viewingId);
    // RLS policy restricts updates to the listing owner
  } catch {
    // table not yet migrated — silently ignore
  }

  revalidatePath("/[locale]/dashboard/viewings", "page");
}

async function cancelViewing(formData: FormData) {
  "use server";
  const viewingId = formData.get("viewingId") as string;
  if (!viewingId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  try {
    await supabase
      .from("viewing_requests")
      .update({ status: "cancelled" })
      .eq("id", viewingId);
  } catch {
    // table not yet migrated — silently ignore
  }

  revalidatePath("/[locale]/dashboard/viewings", "page");
}

// ── Status badge ────────────────────────────────────────────────────────────

function StatusBadge({ status, locale }: { status: ViewingStatus; locale: string }) {
  const labels: Record<ViewingStatus, { en: string; ar: string; classes: string }> = {
    pending: {
      en: "Pending",
      ar: "قيد الانتظار",
      classes: "bg-gold/15 text-gold-dk border-gold/30",
    },
    confirmed: {
      en: "Confirmed",
      ar: "مؤكد",
      classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    cancelled: {
      en: "Cancelled",
      ar: "ملغى",
      classes: "bg-terracotta/10 text-terracotta border-terracotta/30",
    },
  };
  const { en, ar, classes } = labels[status];
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-pill)] border px-2.5 py-0.5 text-xs font-semibold ${classes}`}
    >
      {locale === "ar" ? ar : en}
    </span>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default async function ViewingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");
  const tv = await getTranslations("viewings");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/sign-in?next=/${locale}/dashboard/viewings`);

  // Fetch viewing_requests for listings owned by current user.
  // The RLS policy on viewing_requests restricts rows to the listing owner,
  // so no extra filter needed — but we join to get listing title.
  let viewings: ViewingRequest[] = [];
  try {
    const { data, error } = await supabase
      .from("viewing_requests")
      .select(
        `
        id,
        listing_id,
        requester_name,
        requester_phone,
        preferred_date,
        preferred_time,
        status,
        created_at,
        listings!inner(title_en, title_ar, owner_id)
      `,
      )
      .eq("listings.owner_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      viewings = (
        data as unknown as Array<{
          id: string;
          listing_id: string;
          requester_name: string | null;
          requester_phone: string | null;
          preferred_date: string | null;
          preferred_time: string | null;
          status: string | null;
          created_at: string;
          listings: {
            title_en: string;
            title_ar: string;
            owner_id: string;
          } | null;
        }>
      ).map((row) => ({
        id: row.id,
        listing_id: row.listing_id,
        listing_title_en: row.listings?.title_en ?? "",
        listing_title_ar: row.listings?.title_ar ?? "",
        requester_name: row.requester_name ?? "Unknown",
        requester_phone: row.requester_phone ?? "",
        preferred_date: row.preferred_date ?? "",
        preferred_time: row.preferred_time ?? "",
        status: (row.status ?? "pending") as ViewingStatus,
        created_at: row.created_at,
      }));
    }
  } catch {
    // viewing_requests table not yet migrated — empty state
  }

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk mb-2">
          {t("title")}
        </p>
        <h1 className="font-display text-4xl text-ink">{t("viewingsTab")}</h1>
      </div>

      {viewings.length === 0 ? (
        <GlassPanel variant="warm" radius="card" highlight className="p-10 text-center">
          <p className="font-display text-2xl text-ink mb-3">
            {t("viewingsTab")}
          </p>
          <p className="text-sm text-ink-mid">
            {locale === "ar"
              ? "لا توجد طلبات معاينة بعد."
              : "No viewing requests yet."}
          </p>
        </GlassPanel>
      ) : (
        <ul className="flex flex-col gap-4">
          {viewings.map((v) => {
            const listingTitle =
              locale === "ar" ? v.listing_title_ar : v.listing_title_en;
            const formattedDate = v.preferred_date
              ? new Date(v.preferred_date).toLocaleDateString(
                  locale === "ar" ? "ar-SD" : "en-GB",
                  { weekday: "short", day: "numeric", month: "short" },
                )
              : "";

            return (
              <li key={v.id}>
                <GlassPanel variant="warm" radius="card" highlight className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* Left — info */}
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-semibold text-ink text-sm">
                          {v.requester_name}
                        </p>
                        <StatusBadge status={v.status} locale={locale} />
                      </div>
                      <p className="text-sm text-ink-mid">{v.requester_phone}</p>
                      <p className="text-xs text-ink-mid truncate">{listingTitle}</p>
                      {formattedDate && (
                        <p className="text-xs font-medium text-gold-dk">
                          {formattedDate}
                          {v.preferred_time ? ` · ${v.preferred_time}` : ""}
                        </p>
                      )}
                    </div>

                    {/* Right — actions (only shown when pending) */}
                    {v.status === "pending" && (
                      <div className="flex items-center gap-3 shrink-0">
                        <form action={confirmViewing}>
                          <input type="hidden" name="viewingId" value={v.id} />
                          <GlassButton type="submit" variant="gold" size="sm">
                            {tv("submit")}
                          </GlassButton>
                        </form>
                        <form action={cancelViewing}>
                          <input type="hidden" name="viewingId" value={v.id} />
                          <GlassButton type="submit" variant="danger" size="sm">
                            {locale === "ar" ? "إلغاء" : "Cancel"}
                          </GlassButton>
                        </form>
                      </div>
                    )}
                  </div>
                </GlassPanel>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
