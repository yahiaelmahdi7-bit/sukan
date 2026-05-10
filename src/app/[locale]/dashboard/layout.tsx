import { redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Navbar from "@/components/navbar";
import SidebarNav from "./_components/sidebar-nav";
import MobileNavToggle from "./_components/mobile-nav-toggle";
import { getMockUser } from "./_data/mock-user";
import { createClient } from "@/lib/supabase/server";

/**
 * Dashboard shell — uses the same global Navbar as every other page so the
 * site IA is consistent. Section navigation (My Listings / Inquiries /
 * Analytics / etc.) lives in the sidebar.
 */
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
      <Navbar />

      {/* Mobile-only hamburger row sits below the global nav so the dashboard
          sub-nav is reachable on small screens without doubling up shells. */}
      <div className="lg:hidden mt-2 px-4">
        <MobileNavToggle userName={userName} signOutLabel={signOutLabel} />
      </div>

      {/* Body — desktop sidebar + main content */}
      <div className="flex flex-1 overflow-hidden pt-4">
        <div className="hidden lg:flex h-full ps-4 pb-6">
          <SidebarNav
            userName={userName}
            signOutLabel={signOutLabel}
            isAdmin={isAdmin}
          />
        </div>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
