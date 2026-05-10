// Server Component — "Needs your attention" action items
import {
  Camera,
  Eye,
  MessageSquare,
  User,
  ShieldCheck,
  Inbox,
  Clock,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import GlassPanel from "@/components/glass-panel";
import type { ActionItem } from "../_data/overview";

const ICON_MAP: Record<ActionItem["icon"], React.ReactNode> = {
  camera: <Camera size={16} />,
  eye: <Eye size={16} />,
  message: <MessageSquare size={16} />,
  user: <User size={16} />,
  shield: <ShieldCheck size={16} />,
  inbox: <Inbox size={16} />,
  clock: <Clock size={16} />,
};

interface ActionItemsCardProps {
  items: ActionItem[];
  titleLabel: string;
  allClearLabel: string;
  allClearBodyLabel: string;
  /** Pre-rendered CTA labels keyed by ctaKey */
  ctaLabels: Record<string, string>;
  /** Pre-rendered title strings (interpolation done server-side) */
  titleStrings: string[];
  bodyStrings: (string | undefined)[];
}

export default function ActionItemsCard({
  items,
  titleLabel,
  allClearLabel,
  allClearBodyLabel,
  ctaLabels,
  titleStrings,
  bodyStrings,
}: ActionItemsCardProps) {
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

      {items.length === 0 ? (
        /* All-clear state */
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(200,135,58,0.18) 0%, rgba(200,135,58,0.06) 100%)",
              border: "1px solid rgba(200,135,58,0.25)",
              color: "#C8873A",
            }}
            aria-hidden
          >
            <Sparkles size={20} />
          </div>
          <p className="font-display text-xl text-ink">{allClearLabel}</p>
          <p className="text-sm text-ink-mid max-w-xs">{allClearBodyLabel}</p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-white/30">
          {items.map((item, idx) => (
            <li
              key={item.id}
              className="smooth-fast group flex items-center gap-4 py-4 first:pt-0 last:pb-0 hover:-translate-y-px hover:bg-white/20 -mx-7 px-7 rounded-[var(--radius-pill)]"
            >
              {/* Icon */}
              <div
                className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(200,135,58,0.15) 0%, rgba(200,135,58,0.05) 100%)",
                  border: "1px solid rgba(200,135,58,0.22)",
                  color: "#C8873A",
                }}
                aria-hidden
              >
                {ICON_MAP[item.icon]}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-display text-base text-ink leading-snug">
                  {titleStrings[idx]}
                </p>
                {bodyStrings[idx] && (
                  <p className="text-xs text-ink-mid mt-0.5">
                    {bodyStrings[idx]}
                  </p>
                )}
              </div>

              {/* CTA pill */}
              <Link
                href={item.ctaHref}
                className="smooth shrink-0 rounded-[var(--radius-pill)] px-3.5 py-1.5 text-xs font-semibold text-cream"
                style={{
                  background:
                    "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
                  boxShadow:
                    "0 4px 12px rgba(200,64,26,0.22), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                {ctaLabels[item.ctaKey] ?? "→"}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </GlassPanel>
  );
}
