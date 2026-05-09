import { redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
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

  return (
    <div className="min-h-screen bg-earth flex flex-col">
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="h-16 shrink-0 border-b border-gold/10 bg-earth flex items-center px-4 sm:px-6 gap-3">
        {/* Mobile hamburger */}
        <MobileNavToggle userName={userName} signOutLabel={signOutLabel} />

        {/* Brand mark (mobile) */}
        <div className="flex items-center gap-2 lg:hidden">
          <SukanMark size={24} monochrome="gold" />
          <span className="font-display text-lg text-parchment leading-none">
            سُكَن
          </span>
        </div>

        <div className="flex-1" />

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          <LocaleToggle />

          {/* Notification bell stub */}
          <button
            type="button"
            aria-label="Notifications"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-mute-soft hover:text-parchment hover:bg-earth-soft transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M10 2a6 6 0 0 0-6 6v2.586l-1.707 1.707A1 1 0 0 0 3 14h14a1 1 0 0 0 .707-1.707L16 10.586V8a6 6 0 0 0-6-6Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path d="M8 14a2 2 0 1 0 4 0" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>

          {/* Avatar stub */}
          <div
            aria-label={userName}
            className="w-9 h-9 rounded-full bg-earth-soft border border-gold/20 flex items-center justify-center"
          >
            <SukanMark size={20} monochrome="gold" className="opacity-60" />
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex h-full">
          <SidebarNav userName={userName} signOutLabel={signOutLabel} />
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-earth">
          {children}
        </main>
      </div>
    </div>
  );
}
