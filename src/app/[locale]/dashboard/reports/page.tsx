import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import GlassPanel from "@/components/glass-panel";

// Admin allow-list — extend here or move to env var
const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAIL
  ? [process.env.ADMIN_EMAIL]
  : [];

// ── Types ───────────────────────────────────────────────────────────────────

type ListingReport = {
  id: string;
  listing_id: string;
  listing_title_en: string;
  reason: string;
  details: string | null;
  reporter_email: string | null;
  created_at: string;
};

// ── Reason badge ────────────────────────────────────────────────────────────

function ReasonBadge({ reason }: { reason: string }) {
  const colorMap: Record<string, string> = {
    scam: "bg-terracotta/15 text-terracotta border-terracotta/30",
    fraud: "bg-terracotta/15 text-terracotta border-terracotta/30",
    wrong_info: "bg-gold/15 text-gold-dk border-gold/30",
    duplicate: "bg-sand/50 text-ink-mid border-sand",
    offensive: "bg-terracotta/20 text-terracotta-deep border-terracotta/40",
    other: "bg-white/60 text-ink-mid border-white/60",
  };
  const classes =
    colorMap[reason] ?? "bg-white/60 text-ink-mid border-white/60";
  const label = reason.replace(/_/g, " ");

  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-pill)] border px-2.5 py-0.5 text-xs font-semibold capitalize ${classes}`}
    >
      {label}
    </span>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");
  const tr = await getTranslations("report");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/sign-in?next=/${locale}/dashboard/reports`);

  // Gate: check is_agent on profile OR admin email allow-list
  let isAuthorized = ADMIN_EMAILS.includes(user.email ?? "");
  if (!isAuthorized) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_agent")
        .eq("id", user.id)
        .maybeSingle();
      isAuthorized = profile?.is_agent === true;
    } catch {
      // profiles table / column not yet migrated — deny access
    }
  }

  if (!isAuthorized) {
    return (
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <GlassPanel variant="warm" radius="card" highlight className="p-10 text-center">
          <p className="font-display text-2xl text-ink mb-3">
            {locale === "ar" ? "غير مصرح" : "Not Authorized"}
          </p>
          <p className="text-sm text-ink-mid">
            {locale === "ar"
              ? "هذه الصفحة مخصصة للمشرفين والوكلاء فقط."
              : "This page is for admins and agents only."}
          </p>
        </GlassPanel>
      </div>
    );
  }

  // Fetch listing_reports joined to listing title + reporter info
  let reports: ListingReport[] = [];
  try {
    const { data, error } = await supabase
      .from("listing_reports")
      .select(
        `
        id,
        listing_id,
        reason,
        details,
        reporter_email,
        created_at,
        listings!inner(title_en)
      `,
      )
      .order("created_at", { ascending: false });

    if (!error && data) {
      reports = (
        data as unknown as Array<{
          id: string;
          listing_id: string;
          reason: string | null;
          details: string | null;
          reporter_email: string | null;
          created_at: string;
          listings: { title_en: string } | null;
        }>
      ).map((row) => ({
        id: row.id,
        listing_id: row.listing_id,
        listing_title_en: row.listings?.title_en ?? row.listing_id,
        reason: row.reason ?? "other",
        details: row.details,
        reporter_email: row.reporter_email,
        created_at: row.created_at,
      }));
    }
  } catch {
    // listing_reports table not yet migrated — empty state
  }

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk mb-2">
          {t("title")}
        </p>
        <h1 className="font-display text-4xl text-ink">{t("reportsTab")}</h1>
      </div>

      {reports.length === 0 ? (
        <GlassPanel variant="warm" radius="card" highlight className="p-10 text-center">
          <p className="font-display text-2xl text-ink mb-3">{t("reportsTab")}</p>
          <p className="text-sm text-ink-mid">
            {locale === "ar"
              ? "لا توجد بلاغات بعد."
              : "No reports yet."}
          </p>
        </GlassPanel>
      ) : (
        <ul className="flex flex-col gap-4">
          {reports.map((report) => {
            const formattedDate = new Date(report.created_at).toLocaleString(
              locale === "ar" ? "ar-SD" : "en-GB",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              },
            );

            return (
              <li key={report.id}>
                <GlassPanel variant="warm" radius="card" highlight className="p-5">
                  <div className="flex flex-col gap-3">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3 flex-wrap">
                        <ReasonBadge reason={report.reason} />
                        <span className="text-xs text-ink-mid">{formattedDate}</span>
                      </div>
                      <Link
                        href={`/listings/${report.listing_id}`}
                        className="text-xs font-semibold text-terracotta hover:underline shrink-0"
                      >
                        {locale === "ar" ? "عرض الإعلان →" : "View listing →"}
                      </Link>
                    </div>

                    {/* Listing title */}
                    <p className="text-sm font-medium text-ink">
                      {report.listing_title_en}
                    </p>

                    {/* Details */}
                    {report.details && (
                      <div className="rounded-[10px] border border-white/60 bg-white/50 p-4">
                        <p className="text-xs text-ink-mid leading-relaxed">
                          {report.details}
                        </p>
                      </div>
                    )}

                    {/* Reporter */}
                    {report.reporter_email && (
                      <p className="text-xs text-ink-mid">
                        {locale === "ar" ? "المُبلِّغ: " : "Reporter: "}
                        <span className="font-medium">{report.reporter_email}</span>
                      </p>
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
