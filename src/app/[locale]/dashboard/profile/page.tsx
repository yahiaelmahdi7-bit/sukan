import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import GlassPanel from "@/components/glass-panel";
import { VerifiedBadge } from "@/components/verified-badge";
import { ProfileEditor, type ProfileRow } from "./_components/profile-editor";
import { requestVerification as _requestVerification } from "@/app/[locale]/admin/verify/actions";

// Wrap so `form action` gets a void-returning server action
async function requestVerification() {
  "use server";
  await _requestVerification();
}

// ── Page ────────────────────────────────────────────────────────────────────

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");
  const tv = await getTranslations("verified");

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  // ── Fetch profile row ───────────────────────────────────────────────────────

  let profile: ProfileRow = {
    full_name: null,
    phone: null,
    bio: null,
    avatar_url: null,
    whatsapp_opt_in: false,
  };
  let isVerified = false;
  let verifiedAt: string | null = null;
  let verificationRequestedAt: string | null = null;

  try {
    const { data } = await supabase
      .from("profiles")
      .select(
        "full_name, phone, bio, avatar_url, whatsapp_opt_in, is_verified, updated_at, verification_requested_at",
      )
      .eq("id", authUser?.id ?? "")
      .maybeSingle();

    if (data) {
      const row = data as {
        full_name: string | null;
        phone: string | null;
        bio: string | null;
        avatar_url: string | null;
        whatsapp_opt_in: boolean | null;
        is_verified: boolean | null;
        updated_at: string | null;
        verification_requested_at: string | null;
      };

      profile = {
        full_name: row.full_name,
        phone: row.phone,
        bio: row.bio,
        avatar_url: row.avatar_url,
        whatsapp_opt_in: row.whatsapp_opt_in,
      };
      isVerified = row.is_verified === true;
      verifiedAt = isVerified ? (row.updated_at ?? null) : null;
      verificationRequestedAt = row.verification_requested_at ?? null;
    }
  } catch {
    // profiles table may not expose all columns yet — migration still propagating
  }

  const verifiedDate = verifiedAt
    ? new Date(verifiedAt).toLocaleDateString(
        locale === "ar" ? "ar-SD" : "en-GB",
        { day: "numeric", month: "long", year: "numeric" },
      )
    : null;

  const hasRequestedVerification =
    verificationRequestedAt !== null && !isVerified;

  return (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk mb-2">
          {t("title")}
        </p>
        <h1 className="font-display text-4xl text-ink">{t("profile")}</h1>
      </div>

      {/* ── Verification status panel ────────────────────────────────────── */}
      <GlassPanel variant="warm" radius="card" highlight className="p-5 mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-widest text-gold-dk font-semibold">
              {tv("statusLabel")}
            </p>
            {isVerified ? (
              <div className="flex items-center gap-3">
                <VerifiedBadge size="md" tooltipKey="verified.tooltip" />
                {verifiedDate && (
                  <span className="text-xs text-ink-mid">{verifiedDate}</span>
                )}
              </div>
            ) : (
              <span className="inline-flex items-center rounded-[var(--radius-pill)] border border-sand bg-sand/40 px-3 py-1 text-xs font-medium text-ink-mid">
                {tv("pending")}
              </span>
            )}
          </div>

          {/* Request verification — only when unverified */}
          {!isVerified &&
            (hasRequestedVerification ? (
              <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-gold/40 bg-gold/8 px-4 py-2 text-sm font-semibold text-gold-dk">
                ✓ {tv("requestSubmitted")}
              </span>
            ) : (
              <form action={requestVerification}>
                <button
                  type="submit"
                  className="smooth-fast inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-gold/40 bg-white/45 px-4 py-2 text-sm font-semibold text-gold-dk hover:border-gold/70 hover:bg-gold/10 hover:text-terracotta backdrop-blur-sm"
                >
                  {tv("requestVerification")}
                </button>
              </form>
            ))}
        </div>
      </GlassPanel>

      {/* ── Profile editor ─────────────────────────────────────────────────── */}
      <ProfileEditor
        profile={profile}
        labels={{
          fullName: t("profile.fullName"),
          phone: t("profile.phone"),
          phoneLabel: t("profile.phoneLabel"),
          phonePrefix: t("profile.phonePrefix"),
          whatsapp: t("profile.whatsapp"),
          city: t("profile.city"),
          role: t("profile.role"),
          roleTenant: t("profile.roleTenant"),
          roleLandlord: t("profile.roleLandlord"),
          roleAgent: t("profile.roleAgent"),
          saveChanges: t("saveChanges"),
          bio: t("profile.bio"),
          bioPlaceholder: t("profile.bioPlaceholder"),
          bioChars: t("profile.bioChars"),
          avatarUpload: t("profile.avatarUpload"),
          avatarDragDrop: t("profile.avatarDragDrop"),
          avatarHint: t("profile.avatarHint"),
          avatarUploading: t("profile.avatarUploading"),
          avatarError: t("profile.avatarError"),
          whatsappOptIn: t("profile.whatsappOptIn"),
          completenessTitle: t("profile.completenessTitle"),
          completenessMissingAvatar: t("profile.completenessMissingAvatar"),
          completenessMissingBio: t("profile.completenessMissingBio"),
          completenessMissingPhone: t("profile.completenessMissingPhone"),
          completenessMissingName: t("profile.completenessMissingName"),
          completenessDone: t("profile.completenessDone"),
          saved: t("profile.saved"),
          saving: t("profile.saving"),
          saveError: t("profile.saveError"),
        }}
      />
    </div>
  );
}
