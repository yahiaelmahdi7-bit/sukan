"use client";

import { useState, useEffect, useCallback } from "react";
import { Scale } from "lucide-react";
import {
  addToCompare,
  removeFromCompare,
  isInCompare,
  subscribeCompare,
} from "@/lib/compare";

export interface CompareButtonProps {
  listing: {
    id: string;
    title: string;
    image: string;
    priceUsd: number;
    state: string;
    bedrooms?: number;
    bathrooms?: number;
    areaSqm?: number;
  };
  size?: "sm" | "md";
  className?: string;
}

export default function CompareButton({
  listing,
  size = "sm",
  className = "",
}: CompareButtonProps) {
  const [inCompare, setInCompare] = useState(false);

  // Sync with store on mount + on external changes
  useEffect(() => {
    setInCompare(isInCompare(listing.id));
    return subscribeCompare(() => setInCompare(isInCompare(listing.id)));
  }, [listing.id]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (inCompare) {
        removeFromCompare(listing.id);
      } else {
        const result = addToCompare({
          id: listing.id,
          title: listing.title,
          image: listing.image,
          priceUsd: listing.priceUsd,
          state: listing.state,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          areaSqm: listing.areaSqm,
        });
        if (!result.ok && result.reason === "max") {
          // TODO: replace with toast when one is wired up
          alert("You can compare up to 3 listings at a time."); // TODO: i18n
        }
      }
    },
    [inCompare, listing],
  );

  const dim = size === "md" ? 40 : 32;
  const iconSize = size === "md" ? 17 : 14;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={inCompare}
      aria-label={inCompare ? "Remove from compare" : "Add to compare"} // TODO: i18n
      title={inCompare ? "Remove from compare" : "Add to compare"} // TODO: i18n
      style={{ width: dim, height: dim }}
      className={[
        "flex items-center justify-center rounded-full",
        "border transition-all duration-200",
        inCompare
          ? "border-terracotta/60 bg-terracotta/90 hover:bg-terracotta/70"
          : "border-gold/40 bg-earth/70 hover:border-terracotta/60 hover:bg-terracotta/10",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Scale
        size={iconSize}
        className={inCompare ? "text-cream" : "text-gold"}
        strokeWidth={1.8}
      />
    </button>
  );
}
