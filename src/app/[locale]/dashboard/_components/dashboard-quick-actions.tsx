// Server Component — bottom quick-action row
import { Plus, MessageSquare, Search, BarChart2 } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface DashboardQuickActionsProps {
  labels: {
    postProperty: string;
    viewInquiries: string;
    browseListings: string;
    viewAnalytics: string;
  };
}

export default function DashboardQuickActions({
  labels,
}: DashboardQuickActionsProps) {
  const pills = [
    {
      label: labels.postProperty,
      href: "/post",
      icon: <Plus size={14} />,
      primary: true,
    },
    {
      label: labels.viewInquiries,
      href: "/dashboard/inquiries",
      icon: <MessageSquare size={14} />,
      primary: false,
    },
    {
      label: labels.browseListings,
      href: "/listings",
      icon: <Search size={14} />,
      primary: false,
    },
  ] as const;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <div className="flex flex-wrap items-center gap-2">
        {pills.map((pill) =>
          pill.primary ? (
            <Link
              key={pill.href}
              href={pill.href}
              className="smooth inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-5 py-2.5 text-sm font-semibold text-cream"
              style={{
                background:
                  "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
                boxShadow:
                  "0 8px 22px rgba(200,64,26,0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
              }}
            >
              {pill.icon}
              {pill.label}
            </Link>
          ) : (
            <Link
              key={pill.href}
              href={pill.href}
              className="smooth inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-gold/40 bg-white/45 px-5 py-2.5 text-sm font-semibold text-gold-dk hover:border-gold/70 hover:bg-gold/10 hover:text-terracotta backdrop-blur-md"
            >
              {pill.icon}
              {pill.label}
            </Link>
          ),
        )}
      </div>

      <Link
        href="/dashboard/analytics"
        className="smooth inline-flex items-center gap-1.5 text-sm text-gold-dk hover:text-terracotta"
      >
        <BarChart2 size={14} />
        {labels.viewAnalytics} →
      </Link>
    </div>
  );
}
