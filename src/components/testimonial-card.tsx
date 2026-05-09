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
  const ruleColor =
    accent === "terracotta" ? "bg-terracotta/40" : "bg-gold/40";
  const authorColor =
    accent === "terracotta" ? "text-terracotta" : "text-gold";

  return (
    <div className="bg-earth-soft border border-gold/15 rounded-[var(--radius-card)] p-7 flex flex-col gap-5">
      {/* Quote */}
      <p className="italic text-parchment text-lg leading-[1.7] flex-1">
        {quote}
      </p>

      {/* Thin rule */}
      <div className={`h-px w-10 ${ruleColor}`} />

      {/* Author */}
      <div>
        <p className={`text-xs uppercase tracking-wider font-semibold ${authorColor}`}>
          {author}
        </p>
        {location && (
          <p className="text-xs text-mute-soft mt-0.5">{location}</p>
        )}
      </div>
    </div>
  );
}
