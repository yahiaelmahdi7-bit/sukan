"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import {
  getLocalFavorites,
  toggleLocalFavorite,
} from "@/lib/favorites";

export interface FavoriteButtonProps {
  listingId: string;
  className?: string;
  size?: "sm" | "md";
}

/**
 * Self-contained heart button.
 * – Anonymous: persists to localStorage only.
 * – Signed-in: persists to Supabase saved_listings + localStorage mirror.
 *
 * Drop-in: <FavoriteButton listingId={listing.id} />
 * For listing-card integration, wrap with pointer-events-auto z-10 above the Link.
 */
export default function FavoriteButton({
  listingId,
  className = "",
  size = "sm",
}: FavoriteButtonProps) {
  const t = useTranslations("favorites");
  const [favorited, setFavorited] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Determine initial state: check localStorage then Supabase if signed in.
  useEffect(() => {
    let cancelled = false;
    async function init() {
      const supabase = createClient();

      // Check auth first.
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;
      const uid = user?.id ?? null;
      setUserId(uid);

      if (uid) {
        // Supabase is source of truth when signed in.
        const { data } = await supabase
          .from("saved_listings")
          .select("id")
          .eq("user_id", uid)
          .eq("listing_id", listingId)
          .maybeSingle();
        if (!cancelled) {
          setFavorited(data != null);
        }
      } else {
        // Fall back to localStorage for anonymous users.
        setFavorited(getLocalFavorites().includes(listingId));
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [listingId]);

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Optimistic toggle.
      const next = !favorited;
      setFavorited(next);

      // Scale-pop animation.
      setAnimating(true);
      setTimeout(() => setAnimating(false), 300);

      // Always mirror to localStorage (helps badge counter on navbar).
      toggleLocalFavorite(listingId);

      if (userId) {
        const supabase = createClient();
        if (next) {
          await supabase
            .from("saved_listings")
            .upsert(
              { user_id: userId, listing_id: listingId },
              { onConflict: "user_id,listing_id", ignoreDuplicates: true },
            );
        } else {
          await supabase
            .from("saved_listings")
            .delete()
            .eq("user_id", userId)
            .eq("listing_id", listingId);
        }
      }
    },
    [favorited, listingId, userId],
  );

  const dim = size === "md" ? 40 : 32;
  const iconSize = size === "md" ? 18 : 15;

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={favorited}
      aria-label={favorited ? t("remove") : t("add")}
      style={{ width: dim, height: dim }}
      className={[
        "flex items-center justify-center rounded-full",
        "border transition-all duration-200",
        favorited
          ? "border-terracotta/60 bg-terracotta/10"
          : "border-gold/40 bg-earth/70 hover:border-gold/70",
        animating ? "scale-125" : "scale-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Heart
        size={iconSize}
        className={
          favorited
            ? "fill-terracotta text-terracotta"
            : "fill-none text-gold"
        }
        strokeWidth={1.8}
      />
    </button>
  );
}
