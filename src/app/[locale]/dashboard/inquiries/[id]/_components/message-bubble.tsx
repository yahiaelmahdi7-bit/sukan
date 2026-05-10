// Pure presentational bubble — no client hooks needed.
import Image from "next/image";
import type { Message } from "./types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  locale: string;
}

function formatRelativeTime(iso: string, locale: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);

    if (locale === "ar") {
      if (mins < 1) return "الآن";
      if (mins < 60) return `منذ ${mins} د`;
      if (hours < 24) return `منذ ${hours} س`;
      return `منذ ${days} ي`;
    } else {
      if (mins < 1) return "just now";
      if (mins < 60) return `${mins}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `${days}d ago`;
    }
  } catch {
    return "";
  }
}

export default function MessageBubble({
  message,
  isOwn,
  locale,
}: MessageBubbleProps) {
  const timeLabel = formatRelativeTime(message.created_at, locale);

  return (
    <div
      className={[
        "flex flex-col gap-1 max-w-[78%]",
        isOwn ? "items-end self-end" : "items-start self-start",
      ].join(" ")}
    >
      {/* Attachments */}
      {message.attachments && message.attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {message.attachments.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg overflow-hidden border border-white/40 hover:opacity-90 transition-opacity"
            >
              <Image
                src={url}
                alt="attachment"
                width={96}
                height={96}
                className="object-cover w-24 h-24"
              />
            </a>
          ))}
        </div>
      )}

      {/* Bubble */}
      {message.body && (
        <div
          className={[
            "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
            isOwn
              ? "text-cream rounded-br-sm"
              : "glass-warm border border-white/55 text-ink rounded-bl-sm",
          ].join(" ")}
          style={
            isOwn
              ? {
                  background:
                    "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
                  boxShadow:
                    "0 4px 14px rgba(200,64,26,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                }
              : { boxShadow: "var(--shadow-warm-sm)" }
          }
        >
          {message.body}
        </div>
      )}

      {/* Timestamp */}
      <span className="text-[10px] text-ink-mid/70 px-1">{timeLabel}</span>
    </div>
  );
}
