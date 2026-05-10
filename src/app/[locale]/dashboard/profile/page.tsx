import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";
import ProfileForm from "./_profile-form";
import { getMockUser } from "../_data/mock-user";
import GlassPanel from "@/components/glass-panel";
import { VerifiedBadge } from "@/components/verified-badge";

// ── Verification server action ──────────────────────────────────────────────

async function requestVerification() {
  "use server";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const adminEmail = process.env.ADMIN_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!adminEmail || !apiKey) return;

  // Fetch profile details for the email body
  let profileDetails = { full_name: null as string | null, phone: null as string | null };
  try {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle();
    if (data) profileDetails = data as typeof profileDetails;
  } catch {
    // profiles may not have these columns yet
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "Sukan <noreply@sukan.app>";

  try {
    await resend.emails.send({
      from,
      to: [adminEmail],
      subject: `Verification request — ${profileDetails.full_name ?? user.email}`,
      html: `
        <p><strong>User ID:</strong> ${user.id}</p>
        <p><strong>Email:</strong> ${user.email ?? "—"}</p>
        <p><strong>Name:</strong> ${profileDetails.full_name ?? "—"}</p>
        <p><strong>Phone:</strong> ${profileDetails.phone ?? "—"}</p>
        <p>Please review and set <code>is_verified = true</code> on their profile.</p>
      `,
    });
  } catch {
    // email failure is non-fatal
  }

  revalidatePath("/[locale]/dashboard/profile", "page");
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

  const mockUser = getMockUser();

  // Fetch verification status from profiles
  let isVerified = false;
  let verifiedAt: string | null = null;

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_verified, updated_at")
      .eq("id", authUser?.id ?? "")
      .maybeSingle();
    isVerified = profile?.is_verified === true;
    verifiedAt = isVerified ? (profile?.updated_at ?? null) : null;
  } catch {
    // profiles table may not have is_verified yet — migration pending
  }

  const verifiedDate = verifiedAt
    ? new Date(verifiedAt).toLocaleDateString(locale === "ar" ? "ar-SD" : "en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

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
          {!isVerified && (
            <form action={requestVerification}>
              <button
                type="submit"
                className="smooth-fast inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-gold/40 bg-white/45 px-4 py-2 text-sm font-semibold text-gold-dk hover:border-gold/70 hover:bg-gold/10 hover:text-terracotta backdrop-blur-sm"
              >
                {tv("requestVerification")}
              </button>
            </form>
          )}
        </div>
      </GlassPanel>

      {/* ── Profile edit form ────────────────────────────────────────────── */}
      <ProfileForm
        user={mockUser}
        locale={locale}
        labels={{
          fullName: t("profile.fullName"),
          phone: t("profile.phone"),
          whatsapp: t("profile.whatsapp"),
          city: t("profile.city"),
          role: t("profile.role"),
          roleTenant: t("profile.roleTenant"),
          roleLandlord: t("profile.roleLandlord"),
          roleAgent: t("profile.roleAgent"),
          saveChanges: t("saveChanges"),
        }}
      />
    </div>
  );
}
