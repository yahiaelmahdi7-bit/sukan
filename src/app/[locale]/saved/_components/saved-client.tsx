"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { getLocalFavorites, setLocalFavorites } from "@/lib/favorites";
import { sampleListings, type Listing } from "@/lib/sample-listings";
import ListingCard from "@/components/listing-card";
import SukanMark from "@/components/sukan-mark";

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
          <div
            key={i}
            className="animate-pulse rounded-[var(--radius-card)] bg-earth-soft border border-gold/10 overflow-hidden"
          >
            <div className="aspect-[4/3] w-full bg-sand/40" />
            <div className="p-5 flex flex-col gap-3">
              <div className="h-5 rounded bg-sand/40 w-4/5" />
              <div className="h-4 rounded bg-sand/30 w-2/5" />
              <div className="h-7 rounded bg-sand/40 w-3/5 mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────
  if (loadState === "empty") {
    return (
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <SukanMark monochrome="gold" size={72} className="opacity-30" />

        <div className="flex flex-col gap-2">
          <h2 className="font-display text-3xl text-parchment">
            {t("favorites.emptyTitle")}
          </h2>
          <p className="text-mute-soft text-base max-w-sm">
            {t("favorites.emptyBody")}
          </p>
        </div>

        <Link
          href="/listings"
          className="rounded-[var(--radius-pill)] bg-terracotta px-6 py-2.5 text-sm font-semibold text-parchment hover:bg-terracotta-deep transition-colors"
        >
          {t("favorites.browseCta")}
        </Link>

        {isAnonymous && (
          <div className="mt-2 rounded-[var(--radius-card)] border border-gold/20 bg-earth-soft px-5 py-4 text-sm text-mute-soft max-w-sm">
            <p className="mb-3">{t("favorites.signInPrompt")}</p>
            <Link
              href="/sign-in"
              className="rounded-[var(--radius-pill)] border border-gold/40 px-4 py-1.5 text-xs text-parchment hover:bg-gold/10 transition-colors"
            >
              {t("auth.signIn")}
            </Link>
          </div>
        )}
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
          className="text-xs text-mute-soft hover:text-parchment transition-colors"
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
