"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SudanState, PropertyType, Purpose } from "@/lib/sample-listings";

export type CreateListingInput = {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  propertyType: PropertyType;
  purpose: Purpose;
  state: SudanState;
  city: string;
  neighborhood: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  price: number;
  currency: "USD" | "SDG";
  pricePeriod: "month" | "year" | "total";
  amenities: string[];
  tier: "standard" | "featured";
  whatsappContact: string | null;
};

export type CreateListingResult =
  | { ok: true; listingId: string }
  | { ok: false; error: string; needsAuth?: boolean };

export async function createListing(
  input: CreateListingInput,
): Promise<CreateListingResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Sign in to publish a listing", needsAuth: true };
  }

  // Make sure the user has a profile row (FK target for listings.owner_id)
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!existingProfile) {
    const meta = user.user_metadata as { full_name?: string } | undefined;
    await supabase.from("profiles").insert({
      id: user.id,
      full_name: meta?.full_name ?? null,
    });
  }

  const { data, error } = await supabase
    .from("listings")
    .insert({
      owner_id: user.id,
      title_en: input.titleEn,
      title_ar: input.titleAr,
      description_en: input.descriptionEn || null,
      description_ar: input.descriptionAr || null,
      property_type: input.propertyType,
      purpose: input.purpose,
      state: input.state,
      city: input.city,
      neighborhood: input.neighborhood,
      address_line: input.address,
      latitude: input.latitude,
      longitude: input.longitude,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      area_sqm: input.areaSqm,
      price: input.price,
      currency: input.currency,
      price_period: input.pricePeriod,
      amenities: input.amenities,
      tier: input.tier,
      // Standard tier is published immediately so owners see their listing
      // appear on /listings the moment they submit. Featured tier still
      // requires payment before activation.
      status: input.tier === "featured" ? "pending_payment" : "active",
      published_at: input.tier === "featured" ? null : new Date().toISOString(),
      whatsapp_contact: input.whatsappContact,
    })
    .select("id")
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  // Refresh both the home page (featured strip) and /listings (browse grid).
  revalidatePath("/", "layout");
  revalidatePath("/listings");
  return { ok: true, listingId: data.id };
}

// ─── attachPhotos ─────────────────────────────────────────────────────────────
// Called client-side after createListing succeeds.
// Inserts rows into listing_photos (created by 20260511000001_storage.sql).
// Storage path is extracted from the Supabase public URL so we don't need to
// pass it separately.

export type AttachPhotosResult =
  | { ok: true }
  | { ok: false; error: string };

export async function attachPhotos(
  listingId: string,
  urls: string[],
): Promise<AttachPhotosResult> {
  if (urls.length === 0) return { ok: true };

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Not authenticated" };
  }

  // Extract storage_path from the public URL.
  // Supabase public URL pattern: .../storage/v1/object/public/<bucket>/<path>
  function extractPath(url: string): string {
    const marker = "/object/public/listing-photos/";
    const idx = url.indexOf(marker);
    if (idx === -1) return url; // fallback: store full URL
    return url.slice(idx + marker.length);
  }

  const rows = urls.map((url, position) => ({
    listing_id: listingId,
    storage_path: extractPath(url),
    url,
    position,
  }));

  const { error } = await supabase.from("listing_photos").insert(rows);

  if (error) {
    // Non-fatal: photos may still display via photoUrls on listing.
    // Log server-side but don't block the user.
    console.error("[attachPhotos] insert error:", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
