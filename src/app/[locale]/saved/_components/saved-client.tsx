"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { getLocalFavorites, setLocalFavorites } from "@/lib/favorites";
import { sampleListings, type Listing } from "@/lib/sample-listings";
import ListingCard from "@/components/listing-card";
import SukanMark from "@/components/sukan-mark";
import GlassPanel from "@/components/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";

type LoadState = "loading" | "empty" | "populated";

export default function SavedClient() {
  const t = useTranslations();
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [listings, setListings] = useState<Listing[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;

      let ids: string[] = [];

      if (user) {
        setIsAnonymous(false);
        // Fetch saved listing IDs from Supabase.
        const { data } = await supabase
          .from("saved_listings")
          .select("listing_id")
          .eq("user_id", user.id);

        if (!cancelled) {
          ids = (data ?? []).map((row) => row.listing_id as string);
        }
      } else {
        setIsAnonymous(true);
        ids = getLocalFavorites();
      }

      if (cancelled) return;

      // Cross-reference against sampleListings (real DB rows aren't seeded yet).
      const found = ids
        .map((id) => sampleListings.find((l) => l.id === id))
        .filter((l): l is Listing => l != null);

      setListings(found);
      setLoadState(found.length === 0 ? "empty" : "populated");
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Loading skeleton ───────────────────────────────────────
  if (loadState === "loading") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <GlassPanel
            key={i}
            variant="deep"
            radius="glass"
            highlight={false}
            shadow={false}
            className="overflow-hidden"
          >
            {/* Image placeholder */}
            <div className="aspect-[4/3] w-full skeleton" />
            <div className="p-5 flex flex-col gap-3">
              <div className="h-5 skeleton w-4/5" />
              <div className="h-4 skeleton w-2/5" />
              <div className="h-7 skeleton w-3/5 mt-2" />
            </div>
          </GlassPanel>
        ))}
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────
  if (loadState === "empty") {
    return (
      <div className="flex flex-col items-center gap-8 py-20">
        <GlassPanel
          variant="deep"
          radius="glass-lg"
          highlight={false}
          shadow={false}
          className="flex flex-col items-center gap-6 px-10 py-12 text-center max-w-sm w-full"
          style={{ boxShadow: "var(--shadow-gold-glow)" }}
        >
          <SukanMark monochrome="gold" size={64} className="opacity-40" />

          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl text-parchment">
              {t("favorites.emptyTitle")}
            </h2>
            <p className="text-mute-soft text-sm leading-relaxed max-w-xs">
              {t("favorites.emptyBody")}
            </p>
          </div>

          <Link href="/listings">
            <GlassButton variant="terracotta" size="md">
              {t("favorites.browseCta")}
            </GlassButton>
          </Link>

          {isAnonymous && (
            <div className="mt-2 w-full border-t border-gold/15 pt-5 flex flex-col items-center gap-3">
              <p className="text-xs text-mute-soft leading-relaxed">
                {t("favorites.signInPrompt")}
              </p>
              <Link href="/sign-in">
                <GlassButton variant="ghost-dark" size="sm">
                  {t("auth.signIn")}
                </GlassButton>
              </Link>
            </div>
          )}
        </GlassPanel>
      </div>
    );
  }

  // ── Populated ──────────────────────────────────────────────
  function handleClearAll() {
    if (isAnonymous) {
      setLocalFavorites([]);
    }
    // For signed-in users, we only clear localStorage mirror — Supabase
    // deletion would need a server action; keep it simple for now.
    setListings([]);
    setLoadState("empty");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Clear all link */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleClearAll}
          className="smooth-fast text-xs text-mute-soft hover:text-parchment"
        >
          {t("favorites.clearAll")}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </div>
  );
}
