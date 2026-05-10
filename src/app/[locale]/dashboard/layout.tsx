import { redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import LocaleToggle from "@/components/locale-toggle";
import SukanMark from "@/components/sukan-mark";
import SidebarNav from "./_components/sidebar-nav";
import MobileNavToggle from "./_components/mobile-nav-toggle";
import { getMockUser } from "./_data/mock-user";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  // Auth guard — anonymous users get bounced to sign-in
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) {
    redirect(`/${locale}/sign-in?next=/${locale}/dashboard`);
  }

  // Real user metadata, fall back to mock helpers for display fields not yet in DB
  const mockUser = getMockUser();
  const meta = authUser.user_metadata as { full_name?: string } | undefined;
  const realName = meta?.full_name?.trim() || authUser.email || mockUser.full_name_en;
  const userName = locale === "ar" ? mockUser.full_name_ar : realName;
  const signOutLabel = t("signOut");

  // Check if this user is an agent/admin — used to show admin-only nav items.
  // Fails soft: if the profiles table doesn't exist yet, isAdmin stays false.
  let isAdmin = false;
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_agent")
      .eq("id", authUser.id)
      .maybeSingle();
    isAdmin = profile?.is_agent === true;
  } catch {
    // profiles.is_agent column may not exist yet (migration pending)
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* ── Top bar — glass pill matching the main navbar ───────────────────── */}
      <header className="sticky top-3 z-40 px-3 sm:px-5 shrink-0">
        <div
          className="glass-strong glass-highlight mx-auto flex max-w-screen-2xl items-center gap-3 rounded-[var(--radius-pill)] border border-white/60 pe-3 ps-4"
          style={{ boxShadow: "var(--shadow-warm)" }}
        >
          {/* Mobile hamburger */}
          <MobileNavToggle userName={userName} signOutLabel={signOutLabel} />

          {/* Brand mark — links to home, visible on mobile only */}
          <Link
            href="/"
            className="smooth-fast flex items-center gap-2 lg:hidden hover:opacity-80"
            title="Back to Sukan"
          >
            <SukanMark size={26} />
            <span
              className="font-display text-lg text-ink leading-none"
              style={{ fontFamily: "var(--font-arabic)" }}
            >
              سُكَن
            </span>
          </Link>

          {/* Back to Sukan — desktop only, visible escape hatch */}
          <Link
            href="/"
            className="smooth-fast hidden lg:inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-white/60 bg-white/40 px-3.5 py-1.5 text-xs font-semibold text-ink-mid hover:border-gold/50 hover:bg-gold/10 hover:text-ink"
          >
            <ArrowLeft size={13} className="rtl:rotate-180" aria-hidden />
            {t("backToSite")}
          </Link>

          <div className="flex-1" />

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            <LocaleToggle />

            {/* Notification bell stub */}
            <button
              type="button"
              aria-label="Notifications"
              className="smooth-fast w-9 h-9 flex items-center justify-center rounded-full border border-white/60 bg-white/40 text-ink-mid hover:border-gold/50 hover:text-ink hover:bg-gold/10"
            >
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path
                  d="M10 2a6 6 0 0 0-6 6v2.586l-1.707 1.707A1 1 0 0 0 3 14h14a1 1 0 0 0 .707-1.707L16 10.586V8a6 6 0 0 0-6-6Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M8 14a2 2 0 1 0 4 0" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            {/* Avatar initials chip */}
            <div
              aria-label={userName}
              className="w-9 h-9 rounded-full border border-white/60 flex items-center justify-center text-[11px] font-semibold text-earth shrink-0"
              style={{
                background: "linear-gradient(135deg, #e0a857 0%, #c8873a 100%)",
                boxShadow: "var(--shadow-gold-glow)",
              }}
            >
              <SukanMark size={18} className="opacity-80" />
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden pt-4">
        {/* Desktop sidebar — floating glass card */}
        <div className="hidden lg:flex h-full ps-4 pb-6">
          <SidebarNav userName={userName} signOutLabel={signOutLabel} isAdmin={isAdmin} />
        </div>

        {/* Content area — cream so atmosphere bleeds through */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
