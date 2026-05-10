// Server Component
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SukanMark from "@/components/sukan-mark";
import GlassPanel from "@/components/glass-panel";
import SignOutButton from "./sign-out-button";

// `analytics` and `profile` are NESTED objects in messages/{en,ar}.json,
// so they can't double as flat label strings. The nav uses dedicated
// `navAnalytics` / `navProfile` keys to avoid the collision.
const NAV_ITEMS = [
  { key: "myListings" as const, labelKey: "myListings" as const, href: "/dashboard" },
  { key: "inquiries" as const, labelKey: "inquiries" as const, href: "/dashboard/inquiries" },
  { key: "savedSearches" as const, labelKey: "alertsSavedSearches" as const, href: "/dashboard/saved-searches" },
  { key: "analytics" as const, labelKey: "navAnalytics" as const, href: "/dashboard/analytics" },
  { key: "viewings" as const, labelKey: "viewingsTab" as const, href: "/dashboard/viewings" },
  { key: "profile" as const, labelKey: "navProfile" as const, href: "/dashboard/profile" },
  { key: "settings" as const, labelKey: "settings" as const, href: "/dashboard/settings" },
];

// Admin-only nav items
const ADMIN_NAV_ITEMS = [
  { key: "reports" as const, labelKey: "reportsTab" as const, href: "/dashboard/reports" },
];

export type NavKey =
  | "myListings"
  | "inquiries"
  | "savedSearches"
  | "analytics"
  | "viewings"
  | "profile"
  | "settings"
  | "reports";

interface DashboardSidebarProps {
  active: NavKey;
  userName: string;
  signOutLabel: string;
  isAdmin?: boolean;
}

export default function DashboardSidebar({
  active,
  userName,
  signOutLabel,
  isAdmin = false,
}: DashboardSidebarProps) {
  const t = useTranslations("dashboard");

  const visibleAdminItems = isAdmin ? ADMIN_NAV_ITEMS : [];

  return (
    <GlassPanel
      variant="strong"
      radius="glass"
      highlight
      shadow="lg"
      className="flex flex-col w-60 shrink-0 h-full"
    >
      {/* Brand header — links back to home */}
      <Link
        href="/"
        className="smooth-fast flex items-center gap-3 px-6 py-6 border-b border-white/40 hover:opacity-80"
        title="Back to Sukan"
      >
        <SukanMark size={30} />
        <span
          className="font-display text-xl text-ink leading-none"
          style={{ fontFamily: "var(--font-arabic)" }}
        >
          سُكَن
        </span>
      </Link>

      {/* Greeting */}
      <div className="px-6 py-4 border-b border-white/30">
        <p className="text-[10px] text-gold-dk uppercase tracking-widest mb-1 font-semibold">
          {t("welcomeBack", { name: "" }).trim()}
        </p>
        <p className="font-semibold text-ink text-sm">{userName}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {[...NAV_ITEMS, ...visibleAdminItems].map((item) => {
          const isActive = item.key === active;
          return (
            <Link
              key={item.key}
              href={item.href}
              data-tour={item.key}
              className={[
                "smooth-fast flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-pill)] text-sm font-medium",
                isActive
                  ? "bg-white/70 text-ink border border-white/80"
                  : "text-ink-mid hover:text-ink hover:bg-white/40 border border-transparent",
              ].join(" ")}
              style={
                isActive
                  ? { boxShadow: "var(--shadow-gold-glow)" }
                  : undefined
              }
            >
              <SukanMark
                size={16}
                className={isActive ? "opacity-90" : "opacity-40"}
              />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-2.5 py-4 border-t border-white/30">
        <SignOutButton label={signOutLabel} />
      </div>
    </GlassPanel>
  );
}
