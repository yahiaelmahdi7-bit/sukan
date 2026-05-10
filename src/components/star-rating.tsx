"use client";

// StarRating is interactive-only when interactive=true; otherwise it renders
// as a static div. We always mark 'use client' since the file exports both
// modes and Next.js doesn't allow conditional directives.

interface StarRatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (v: number) => void;
}

const SIZE: Record<"sm" | "md" | "lg", number> = {
  sm: 14,
  md: 20,
  lg: 28,
};

export function StarRating({
  value,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
}: StarRatingProps) {
  const px = SIZE[size];

  return (
    <span
      className="inline-flex items-center gap-0.5"
      role={interactive ? "group" : "img"}
      aria-label={`${value} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => {
        const filled = i < value;
        const starValue = i + 1;

        return (
          <svg
            key={i}
            width={px}
            height={px}
            viewBox="0 0 20 20"
            fill={filled ? "#C8401A" : "none"}
            stroke={filled ? "#C8401A" : "#C8873A"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={interactive ? { cursor: "pointer" } : undefined}
            onClick={
              interactive && onChange ? () => onChange(starValue) : undefined
            }
          >
            <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27l-4.94 2.43.94-5.49-4-3.9 5.53-.8L10 1.5z" />
          </svg>
        );
      })}
    </span>
  );
}
