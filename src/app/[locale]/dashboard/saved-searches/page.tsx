import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import GlassPanel from "@/components/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";

// ── Types ───────────────────────────────────────────────────────────────────

type PriceAlert = {
  id: string;
  user_id: string;
  filters: Record<string, string | number | null>;
  email: string | null;
  created_at: string;
};

// ── Server action ───────────────────────────────────────────────────────────

async function deleteAlert(formData: FormData) {
  "use server";
  const alertId = formData.get("alertId") as string;
  if (!alertId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  try {
    await supabase
      .from("price_alerts")
      .delete()
      .eq("id", alertId)
      .eq("user_id", user.id); // enforce ownership
  } catch {
    // table may not exist yet — silently swallow
  }

  revalidatePath("/[locale]/dashboard/saved-searches", "page");
}

// ── Filter chip helper ──────────────────────────────────────────────────────

function FilterChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-[var(--radius-pill)] border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold-dk">
      {label}
    </span>
  );
}

function filterChips(
  filters: Record<string, string | number | null>,
): string[] {
  const chips: string[] = [];
  const fieldLabels: Record<string, string> = {
    state: "State",
    property_type: "Type",
    purpose: "Purpose",
    min_price: "Min $",
    max_price: "Max $",
    bedrooms: "Beds",
  };
  for (const [key, value] of Object.entries(filters)) {
    if (value !== null && value !== undefined && value !== "") {
      const label = fieldLabels[key] ?? key;
      chips.push(`${label}: ${value}`);
    }
  }
  return chips;
}

// ── Page ────────────────────────────────────────────────────────────────────

export default async function SavedSearchesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");
  const ta = await getTranslations("alerts");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/sign-in?next=/${locale}/dashboard/saved-searches`);

  // Fetch saved searches (price_alerts) — fail soft if table not yet migrated
  let alerts: PriceAlert[] = [];
  try {
    const { data, error } = await supabase
      .from("price_alerts")
      .select("id, user_id, filters, email, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      alerts = data as PriceAlert[];
    }
  } catch {
    // migration pending — render empty state
  }

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk mb-2">
          {t("title")}
        </p>
        <h1 className="font-display text-4xl text-ink">{ta("savedSearches")}</h1>
      </div>

      {alerts.length === 0 ? (
        <GlassPanel variant="warm" radius="card" highlight className="p-10 text-center">
          <p className="font-display text-2xl text-ink mb-3">{ta("savedSearches")}</p>
          <p className="text-sm text-ink-mid">{ta("modalDesc")}</p>
        </GlassPanel>
      ) : (
        <ul className="flex flex-col gap-4">
          {alerts.map((alert) => {
            const chips = filterChips(
              (alert.filters ?? {}) as Record<string, string | number | null>,
            );
            const createdDate = new Date(alert.created_at).toLocaleDateString(
              locale === "ar" ? "ar-SD" : "en-GB",
              { day: "numeric", month: "short", year: "numeric" },
            );
            return (
              <li key={alert.id}>
                <GlassPanel
                  variant="warm"
                  radius="card"
                  highlight
                  className="p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-col gap-3 flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2">
                      {chips.length > 0 ? (
                        chips.map((chip) => (
                          <FilterChip key={chip} label={chip} />
                        ))
                      ) : (
                        <FilterChip label="All listings" />
                      )}
                    </div>
                    <p className="text-xs text-ink-mid">
                      {createdDate}
                      {alert.email ? ` · ${alert.email}` : ""}
                    </p>
                  </div>

                  {/* Delete form */}
                  <form action={deleteAlert} className="shrink-0">
                    <input type="hidden" name="alertId" value={alert.id} />
                    <GlassButton
                      type="submit"
                      variant="danger"
                      size="sm"
                    >
                      {ta("deleteAlert")}
                    </GlassButton>
                  </form>
                </GlassPanel>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
