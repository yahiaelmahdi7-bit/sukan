// Server Component
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SukanMark from "@/components/sukan-mark";
import SignOutButton from "./sign-out-button";

const NAV_ITEMS = [
  { key: "myListings" as const, href: "/dashboard" },
  { key: "inquiries" as const, href: "/dashboard/inquiries" },
  { key: "analytics" as const, href: "/dashboard/analytics" },
  { key: "profile" as const, href: "/dashboard/profile" },
  { key: "settings" as const, href: "/dashboard/settings" },
];

export type NavKey = "myListings" | "inquiries" | "analytics" | "profile" | "settings";

interface DashboardSidebarProps {
  active: NavKey;
  userName: string;
  signOutLabel: string;
}

export default function DashboardSidebar({
  active,
  userName,
  signOutLabel,
}: DashboardSidebarProps) {
  const t = useTranslations("dashboard");

  return (
    <aside className="flex flex-col w-60 shrink-0 h-full border-e border-gold/10 bg-earth">
      {/* Brand header */}
      <div className="flex items-center gap-3 px-6 py-7 border-b border-gold/10">
        <SukanMark size={32} monochrome="gold" />
        <span className="font-display text-xl text-parchment leading-none">
          سُكَن
        </span>
      </div>

      {/* Greeting */}
      <div className="px-6 py-5 border-b border-gold/10">
        <p className="text-xs text-mute-soft uppercase tracking-wider mb-1">
          {t("welcomeBack", { name: "" }).trim()}
        </p>
        <p className="font-semibold text-parchment text-sm">{userName}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={[
                "flex items-center gap-3 px-4 py-3 rounded-[10px] text-sm font-medium transition-colors",
                "ltr:border-s-2 rtl:border-e-2",
                isActive
                  ? "bg-gold/10 text-parchment border-terracotta"
                  : "text-mute-soft hover:text-parchment hover:bg-earth-soft border-transparent",
              ].join(" ")}
            >
              <SukanMark
                size={18}
                monochrome={isActive ? "gold" : "parchment"}
                className={isActive ? "opacity-100" : "opacity-30"}
              />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-5 border-t border-gold/10">
        <SignOutButton label={signOutLabel} />
      </div>
    </aside>
  );
}
