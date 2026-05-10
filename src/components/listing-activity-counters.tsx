// Server component — no "use client" needed; numbers are seeded, no interactivity.
// TODO: i18n — replace hardcoded strings with translation keys

/** Deterministic seed → integer in [min, max] */
function seededInt(seed: string, min: number, max: number, salt: number): number {
  let h = salt;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return min + (Math.abs(h) % (max - min + 1));
}

interface ListingActivityCountersProps {
  listingId: string;
}

export function ListingActivityCounters({ listingId }: ListingActivityCountersProps) {
  const inquiries = seededInt(listingId, 3, 18, 7);
  const views = seededInt(listingId, 80, 500, 13);
  const saves = seededInt(listingId, 4, 25, 19);

  return (
    <p
      className="text-xs text-[#12100C]/50 font-medium flex flex-wrap items-center gap-1 select-none"
      aria-label={`${inquiries} inquiries, ${views} views, saved ${saves} times`}
    >
      {/* TODO: i18n */}
      <span>
        <span className="text-[#C8873A] font-semibold">{inquiries}</span> inquiries
      </span>
      <span aria-hidden className="opacity-40 mx-1">·</span>
      <span>
        <span className="text-[#C8873A] font-semibold">{views}</span> views
      </span>
      <span aria-hidden className="opacity-40 mx-1">·</span>
      <span>
        saved <span className="text-[#C8873A] font-semibold">{saves}</span> times
      </span>
    </p>
  );
}
