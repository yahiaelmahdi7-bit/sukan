// Server Component
import { Link } from "@/i18n/navigation";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  viewAll?: { href: string; label: string };
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "start",
  viewAll,
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-start items-start";

  return (
    <div className={`flex flex-col ${alignClass} mb-10`}>
      {/* Optional eyebrow row — eyebrow on start, viewAll on end */}
      {(eyebrow || viewAll) && (
        <div className="flex w-full items-center justify-between mb-3">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dk">
              {eyebrow}
            </p>
          )}
          {viewAll && (
            <Link
              href={viewAll.href}
              className="ms-auto text-sm text-terracotta hover:text-terracotta-deep transition-colors font-medium"
            >
              {viewAll.label}
            </Link>
          )}
        </div>
      )}

      <h2 className={`font-display text-3xl md:text-4xl text-ink leading-tight ${align === "center" ? "max-w-2xl mx-auto" : ""}`}>
        {title}
      </h2>

      {subtitle && (
        <p className={`mt-3 text-base text-ink-mid leading-relaxed ${align === "center" ? "max-w-xl mx-auto" : "max-w-2xl"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
