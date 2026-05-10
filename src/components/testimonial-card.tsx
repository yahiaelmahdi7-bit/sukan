// Server Component
export interface TestimonialCardProps {
  quote: string;
  author: string;
  location?: string;
  accent?: "gold" | "terracotta";
}

export default function TestimonialCard({
  quote,
  author,
  location,
  accent = "gold",
}: TestimonialCardProps) {
  const ruleStyle =
    accent === "terracotta"
      ? "linear-gradient(90deg, rgba(200,64,26,0.55), transparent)"
      : "linear-gradient(90deg, rgba(200,135,58,0.55), transparent)";
  const authorColor =
    accent === "terracotta" ? "text-terracotta" : "text-gold-dk";
  const quoteMarkColor =
    accent === "terracotta" ? "rgba(200,64,26,0.18)" : "rgba(200,135,58,0.22)";

  return (
    <div
      className="glass-warm glass-highlight relative flex flex-col gap-5 overflow-hidden rounded-[var(--radius-glass)] border border-white/55 p-7"
      style={{ boxShadow: "var(--shadow-glass)" }}
    >
      {/* Decorative oversized quote mark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 ltr:right-4 rtl:left-4 select-none font-display text-[8rem] leading-none"
        style={{ color: quoteMarkColor }}
      >
        “
      </span>

      {/* Quote */}
      <p className="relative flex-1 font-display text-lg italic leading-[1.65] text-ink">
        {quote}
      </p>

      {/* Gradient rule */}
      <div className="h-px w-12" style={{ background: ruleStyle }} />

      {/* Author */}
      <div>
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${authorColor}`}
        >
          {author}
        </p>
        {location && (
          <p className="mt-0.5 text-xs text-ink-mid">{location}</p>
        )}
      </div>
    </div>
  );
}
