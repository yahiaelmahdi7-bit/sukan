"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { getLocalFavorites, setLocalFavorites } from "@/lib/favorites";
import { type Listing } from "@/lib/sample-listings";
import ListingCard from "@/components/listing-card";
import SukanMark from "@/components/sukan-mark";
import GlassPanel from "@/components/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";
import { getListingsByIds, clearAllSaved } from "../actions";

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

      // Resolve ids against the live DB first, then the sample catalog.
      const resolved = await getListingsByIds(ids);
      if (cancelled) return;

      setListings(resolved);
      setLoadState(resolved.length === 0 ? "empty" : "populated");
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
            variant="warm"
            radius="glass"
            highlight={false}
            shadow={false}
            className="overflow-hidden border border-white/55"
          >
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
          variant="warm"
          radius="glass-lg"
          highlight
          shadow="lg"
          className="flex flex-col items-center gap-6 border border-white/55 px-10 py-12 text-center max-w-sm w-full"
        >
          <SukanMark monochrome="gold" size={64} className="opacity-50" />

          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl text-ink">
              {t("favorites.emptyTitle")}
            </h2>
            <p className="text-ink-mid text-sm leading-relaxed max-w-xs">
              {t("favorites.emptyBody")}
            </p>
          </div>

          <Link href="/listings">
            <GlassButton variant="terracotta" size="md">
              {t("favorites.browseCta")}
            </GlassButton>
          </Link>

          {isAnonymous && (
            <div className="mt-2 w-full border-t border-sand-dk pt-5 flex flex-col items-center gap-3">
              <p className="text-xs text-ink-mid leading-relaxed">
                {t("favorites.signInPrompt")}
              </p>
              <Link href="/sign-in">
                <GlassButton variant="ghost-light" size="sm">
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
  async function handleClearAll() {
    setLocalFavorites([]);
    if (!isAnonymous) {
      await clearAllSaved();
    }
    setListings([]);
    setLoadState("empty");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleClearAll}
          className="smooth-fast text-xs text-ink-mid hover:text-terracotta"
        >
          {t("favorites.clearAll")}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </div>
  );
}
