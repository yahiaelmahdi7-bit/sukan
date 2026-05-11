import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GlassPanel from "@/components/glass-panel";
import { VerifiedBadge } from "@/components/verified-badge";
import VerifyRow from "./_verify-row";

// ── Types ────────────────────────────────────────────────────────────────────

type ProfileRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  is_verified: boolean;
  is_agent: boolean;
  created_at: string;
  verification_requested_at: string | null;
  listing_count: number;
};

// ── Role badge ───────────────────────────────────────────────────────────────

function RoleBadge({ role, isAgent }: { role: string | null; isAgent: boolean }) {
  const label = isAgent ? "Agent" : role === "landlord" ? "Landlord" : role ?? "—";
  const cls = isAgent
    ? "bg-gold/15 text-gold-dk border-gold/30"
    : role === "landlord"
      ? "bg-terracotta/10 text-terracotta border-terracotta/25"
      : "bg-sand/50 text-ink-mid border-sand";

  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-pill)] border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${cls}`}
    >
      {label}
    </span>
  );
}

// ── Stats row ────────────────────────────────────────────────────────────────

function StatsRow({
  verified,
  pending,
  total,
  labels,
}: {
  verified: number;
  pending: number;
  total: number;
  labels: { verified: string; pending: string; total: string };
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap text-sm">
      <span className="font-semibold text-ink">
        {verified}
        <span className="font-normal text-ink-mid"> {labels.verified}</span>
      </span>
      <span className="text-ink-light">·</span>
      <span className="font-semibold text-terracotta">
        {pending}
        <span className="font-normal text-ink-mid"> {labels.pending}</span>
      </span>
      <span className="text-ink-light">·</span>
      <span className="font-semibold text-ink">
        {total}
        <span className="font-normal text-ink-mid"> {labels.total}</span>
      </span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminVerifyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("adminVerify");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth guard
  if (!user) {
    redirect(`/${locale}/sign-in?next=/${locale}/admin/verify`);
  }

  // Admin guard
  let isAdmin = false;
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();
    isAdmin = profile?.is_admin === true;
  } catch {
    // column not yet migrated — deny access
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <GlassPanel variant="warm" radius="card" highlight className="p-10 text-center max-w-sm w-full">
          <p className="font-display text-3xl text-ink mb-3">403</p>
          <p className="font-semibold text-ink mb-2">{t("notAuthorizedTitle")}</p>
          <p className="text-sm text-ink-mid">{t("notAuthorizedBody")}</p>
        </GlassPanel>
      </div>
    );
  }

  // Fetch profiles queue — sorted by verification_requested_at (newest requests
  // first), then by created_at so the table is deterministic.
  let profiles: ProfileRow[] = [];
  let fetchError = false;

  try {
    // Fetch profiles
    const { data: profileData, error: profileErr } = await supabase
      .from("profiles")
      .select(
        "id, full_name, avatar_url, role, is_verified, is_agent, created_at, verification_requested_at",
      )
      .order("verification_requested_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (profileErr) throw profileErr;

    if (profileData) {
      // Fetch listing counts per owner in a single query
      const ownerIds = profileData.map((p) => p.id);
      let listingCounts: Record<string, number> = {};

      if (ownerIds.length > 0) {
        const { data: listingData } = await supabase
          .from("listings")
          .select("owner_id")
          .in("owner_id", ownerIds);

        if (listingData) {
          for (const row of listingData) {
            listingCounts[row.owner_id] = (listingCounts[row.owner_id] ?? 0) + 1;
          }
        }
      }

      profiles = profileData.map((p) => ({
        id: p.id,
        full_name: p.full_name,
        avatar_url: p.avatar_url ?? null,
        role: p.role,
        is_verified: p.is_verified ?? false,
        is_agent: p.is_agent ?? false,
        created_at: p.created_at,
        verification_requested_at: p.verification_requested_at ?? null,
        listing_count: listingCounts[p.id] ?? 0,
      }));
    }
  } catch {
    fetchError = true;
  }

  const verifiedCount = profiles.filter((p) => p.is_verified).length;
  const pendingCount = profiles.filter((p) => p.verification_requested_at && !p.is_verified).length;
  const totalCount = profiles.length;

  const rowLabels = {
    verify: t("actionVerify"),
    revoke: t("actionRevoke"),
    revokeConfirm: t("revokeConfirm"),
    verifying: t("verifying"),
    revoking: t("revoking"),
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk mb-2">
            {t("eyebrow")}
          </p>
          <h1 className="font-display text-4xl text-ink mb-4">{t("title")}</h1>

          {/* Stats */}
          {!fetchError && (
            <StatsRow
              verified={verifiedCount}
              pending={pendingCount}
              total={totalCount}
              labels={{
                verified: t("statsVerified"),
                pending: t("statsPending"),
                total: t("statsTotal"),
              }}
            />
          )}
        </div>

        {/* Error state */}
        {fetchError && (
          <GlassPanel variant="warm" radius="card" highlight className="p-8 text-center">
            <p className="text-sm text-ink-mid">{t("fetchError")}</p>
          </GlassPanel>
        )}

        {/* Empty state */}
        {!fetchError && profiles.length === 0 && (
          <GlassPanel variant="warm" radius="card" highlight className="p-10 text-center">
            <p className="font-display text-2xl text-ink mb-2">{t("emptyTitle")}</p>
            <p className="text-sm text-ink-mid">{t("emptyBody")}</p>
          </GlassPanel>
        )}

        {/* Table */}
        {!fetchError && profiles.length > 0 && (
          <GlassPanel variant="cream" radius="glass" highlight shadow="lg" className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/50">
                  <th className="px-5 py-3.5 text-start text-[10px] font-semibold uppercase tracking-widest text-gold-dk">
                    {t("colUser")}
                  </th>
                  <th className="px-4 py-3.5 text-start text-[10px] font-semibold uppercase tracking-widest text-gold-dk hidden sm:table-cell">
                    {t("colRole")}
                  </th>
                  <th className="px-4 py-3.5 text-start text-[10px] font-semibold uppercase tracking-widest text-gold-dk hidden md:table-cell">
                    {t("colJoined")}
                  </th>
                  <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-widest text-gold-dk hidden md:table-cell">
                    {t("colListings")}
                  </th>
                  <th className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-widest text-gold-dk">
                    {t("colStatus")}
                  </th>
                  <th className="px-5 py-3.5 text-end text-[10px] font-semibold uppercase tracking-widest text-gold-dk">
                    {t("colAction")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile, idx) => {
                  const joinDate = new Date(profile.created_at).toLocaleDateString(
                    locale === "ar" ? "ar-SD" : "en-GB",
                    { day: "numeric", month: "short", year: "numeric" },
                  );
                  const requestedAt = profile.verification_requested_at
                    ? new Date(profile.verification_requested_at).toLocaleDateString(
                        locale === "ar" ? "ar-SD" : "en-GB",
                        { day: "numeric", month: "short", year: "numeric" },
                      )
                    : null;

                  const initials = (profile.full_name ?? "?")
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <tr
                      key={profile.id}
                      className={[
                        "border-b border-white/30 last:border-0",
                        profile.verification_requested_at && !profile.is_verified
                          ? "bg-gold/4"
                          : idx % 2 === 0
                            ? "bg-white/0"
                            : "bg-white/20",
                      ].join(" ")}
                    >
                      {/* Avatar + name/email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Avatar */}
                          <div className="relative shrink-0 w-9 h-9 rounded-full overflow-hidden bg-sand/60 border border-white/60 flex items-center justify-center text-xs font-semibold text-ink-mid select-none">
                            {profile.avatar_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={profile.avatar_url}
                                alt={profile.full_name ?? ""}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              initials
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-ink truncate leading-tight">
                              {profile.full_name ?? t("anonymous")}
                            </p>
                            <p className="text-[11px] text-ink-mid truncate leading-tight font-mono">
                              {profile.id.slice(0, 8)}…
                            </p>
                            {requestedAt && !profile.is_verified && (
                              <p className="text-[10px] text-gold-dk font-semibold mt-0.5">
                                {t("requestedOn", { date: requestedAt })}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <RoleBadge role={profile.role} isAgent={profile.is_agent} />
                      </td>

                      {/* Join date */}
                      <td className="px-4 py-4 text-ink-mid hidden md:table-cell whitespace-nowrap">
                        {joinDate}
                      </td>

                      {/* Listings count */}
                      <td className="px-4 py-4 text-center text-ink-mid hidden md:table-cell">
                        {profile.listing_count}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        {profile.is_verified ? (
                          <div className="flex justify-center">
                            <VerifiedBadge size="sm" tooltipKey="verified.tooltip" />
                          </div>
                        ) : (
                          <span className="inline-flex items-center rounded-[var(--radius-pill)] border border-sand bg-sand/40 px-2.5 py-0.5 text-[11px] font-medium text-ink-mid whitespace-nowrap">
                            {t("statusPending")}
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-end">
                        <VerifyRow
                          userId={profile.id}
                          isVerified={profile.is_verified}
                          labels={rowLabels}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
