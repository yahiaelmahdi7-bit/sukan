// Server component — no interactivity needed; numbers are seeded, no "use client".
import { getTranslations } from "next-intl/server";

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

export async function ListingActivityCounters({ listingId }: ListingActivityCountersProps) {
  const t = await getTranslations("listing");

  const inquiries = seededInt(listingId, 3, 18, 7);
  const views = seededInt(listingId, 80, 500, 13);
  const saves = seededInt(listingId, 4, 25, 19);

  return (
    <p
      className="text-xs text-[#12100C]/50 font-medium flex flex-wrap items-center gap-1 select-none"
      aria-label={[
        t("activityInquiries", { count: inquiries }),
        t("activityViews", { count: views }),
        t("activitySaves", { count: saves }),
      ].join(", ")}
    >
      <span>{t("activityInquiries", { count: inquiries })}</span>
      <span aria-hidden className="opacity-40 mx-1">·</span>
      <span>{t("activityViews", { count: views })}</span>
      <span aria-hidden className="opacity-40 mx-1">·</span>
      <span>{t("activitySaves", { count: saves })}</span>
    </p>
  );
}
