"use client";

import { useState, useEffect } from "react";
import { getLocalFavorites } from "@/lib/favorites";

/**
 * Small terracotta dot that appears over the Saved nav link
 * when the user has locally-saved listings.
 * Client-only — reads localStorage on mount.
 */
export default function SavedNavBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getLocalFavorites().length);

    // Listen for localStorage changes from other tabs or FavoriteButton updates.
    function onStorage(e: StorageEvent) {
      if (e.key === "sukan:favorites") {
        setCount(getLocalFavorites().length);
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (count === 0) return null;

  return (
    <span
      aria-hidden
      className="absolute -top-1 -end-1 h-2 w-2 rounded-full bg-terracotta"
    />
  );
}
