"use client";

import { useEffect } from "react";
import { addRecentlyViewed } from "@/lib/recently-viewed";

type Props = {
  listing: {
    id: string;
    title: string;
    image: string;
    priceUsd: number;
  };
};

/**
 * Zero-render tracker component.
 *
 * Drop this near the top of a listing detail page to record the view:
 *
 *   <TrackRecentlyViewed listing={{ id, title, image: imageUrl, priceUsd }} />
 *
 * It calls addRecentlyViewed() once on mount, then returns null.
 * The listing detail page does NOT need to be a client component — just
 * import and render this component and the tracking is handled here.
 */
export default function TrackRecentlyViewed({ listing }: Props) {
  useEffect(() => {
    addRecentlyViewed(listing);
    // Only run on mount — listing identity tracked by id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing.id]);

  return null;
}
