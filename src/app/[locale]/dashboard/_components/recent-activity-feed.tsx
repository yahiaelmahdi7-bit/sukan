// Server Component — recent activity timeline
import { Eye, Heart, MessageSquare, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/navigation";
import GlassPanel from "@/components/glass-panel";
import type { ActivityRow } from "../_data/overview";

const ICON_MAP: Record<ActivityRow["icon"], React.ReactNode> = {
  eye: <Eye size={14} aria-hidden="true" />,
  heart: <Heart size={14} aria-hidden="true" />,
  message: <MessageSquare size={14} aria-hidden="true" />,
  "trending-up": <TrendingUp size={14} aria-hidden="true" />,
};

const ICON_COLOR: Record<ActivityRow["icon"], string> = {
  eye: "#C8873A",
  heart: "#c8401a",
  message: "#C8873A",
  "trending-up": "#16a34a",
};

interface RecentActivityFeedProps {
  rows: ActivityRow[];
  titleLabel: string;
  /** Pre-rendered text strings (interpolation done server-side) */
  textStrings: string[];
}

export default function RecentActivityFeed({
  rows,
  titleLabel,
  textStrings,
}: RecentActivityFeedProps) {
  return (
    <GlassPanel
      variant="warm"
      radius="glass"
      highlight
      shadow
      className="p-7"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-dk mb-5">
        {titleLabel}
      </p>

      <ul className="flex flex-col gap-0.5">
        {rows.map((row, idx) => (
          <li key={row.id}>
            <Link
              href={row.href}
              className="smooth-fast group flex items-center gap-3 rounded-[var(--radius-pill)] -mx-3 px-3 py-2.5 hover:bg-white/30"
            >
              {/* Icon bubble */}
              <span
                className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full"
                style={{
                  background: `${ICON_COLOR[row.icon]}18`,
                  border: `1px solid ${ICON_COLOR[row.icon]}28`,
                  color: ICON_COLOR[row.icon],
                }}
                aria-hidden
              >
                {ICON_MAP[row.icon]}
              </span>

              {/* Text */}
              <p className="flex-1 min-w-0 text-sm text-ink leading-snug line-clamp-1">
                {textStrings[idx]}
              </p>

              {/* Time */}
              <span className="shrink-0 text-[11px] text-ink-mid whitespace-nowrap">
                {row.relativeTime}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}
