import { getTranslations } from "next-intl/server";
import Navbar from "@/components/navbar";
import SukanMark from "@/components/sukan-mark";

export default async function Loading() {
  const t = await getTranslations("loading");

  return (
    <>
      <Navbar />

      <main className="flex flex-1 flex-col items-center justify-center py-32 gap-5">
        {/* Pulsing brand mark — neutral gold, works on both dark and cream */}
        <div
          className="animate-pulse"
          style={{ animationTimingFunction: "var(--ease-glide)", animationDuration: "1.8s" }}
        >
          <SukanMark size={64} monochrome="gold" />
        </div>

        {/* Caption shimmer — 3-dot skeleton bar that mirrors the mark width */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs tracking-[0.22em] uppercase text-mute-soft font-sans">
            {t("message")}
          </p>
          {/* Slim skeleton rule */}
          <div className="skeleton h-0.5 w-16 rounded-full" />
        </div>
      </main>
    </>
  );
}
