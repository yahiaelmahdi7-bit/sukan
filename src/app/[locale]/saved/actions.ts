"use server";

import { sampleListings, type Listing } from "@/lib/sample-listings";
import { createClient } from "@/lib/supabase/server";

// Reuse the same shape + mapper as @/lib/listings but expose only the
// "look up by ids" path. Server action so the saved page (a Client
// Component) can resolve both DB listings and sample listings safely.

type DbListing = {
  id: string;
  owner_id: string;
  title_en: string;
  title_ar: string;
  description_en: string | null;
  description_ar: string | null;
  property_type: Listing["propertyType"];
  purpose: Listing["purpose"];
  state: Listing["state"];
  city: string;
  neighborhood: string | null;
  latitude: number;
  longitude: number;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | string | null;
  price: number | string;
  currency: "USD" | "SDG";
  price_period: Listing["period"] | null;
  amenities: string[];
  tier: Listing["tier"];
  whatsapp_contact: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    created_at: string;
    is_verified: boolean | null;
  } | null;
};

const SDG_PER_USD = 600;

const LISTING_SELECT = `
  id, owner_id, title_en, title_ar, description_en, description_ar,
  property_type, purpose, state, city, neighborhood, latitude, longitude,
  bedrooms, bathrooms, area_sqm, price, currency, price_period, amenities,
  tier, whatsapp_contact, created_at,
  profiles!owner_id(full_name, created_at, is_verified)
`;

function toNumber(v: number | string | null | undefined): number | undefined {
  if (v === null || v === undefined) return undefined;
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : undefined;
}

function mapDbListing(row: DbListing): Listing {
  const priceRaw = toNumber(row.price) ?? 0;
  const priceUsd = row.currency === "USD" ? priceRaw : priceRaw / SDG_PER_USD;
  const priceSdg = row.currency === "SDG" ? priceRaw : undefined;
  const ownerName = row.profiles?.full_name?.trim() ?? "Owner";
  const ownerJoinedYear = row.profiles?.created_at
    ? new Date(row.profiles.created_at).getFullYear()
    : new Date().getFullYear();
  const ownerVerified = row.profiles?.is_verified === true;

  return {
    id: row.id,
    titleEn: row.title_en,
    titleAr: row.title_ar,
    descriptionEn: row.description_en ?? "",
    descriptionAr: row.description_ar ?? "",
    propertyType: row.property_type,
    purpose: row.purpose,
    state: row.state,
    city: row.city,
    cityAr: row.city,
    neighborhood: row.neighborhood ?? undefined,
    neighborhoodAr: row.neighborhood ?? undefined,
    latitude: row.latitude,
    longitude: row.longitude,
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    areaSqm: toNumber(row.area_sqm),
    priceUsd: Math.round(priceUsd),
    priceSdg,
    period: row.price_period ?? "month",
    amenities: (row.amenities ?? []) as Listing["amenities"],
    tier: row.tier,
    whatsappContact: row.whatsapp_contact ?? "",
    ownerName,
    ownerNameAr: ownerName,
    ownerJoinedYear,
    photoSlots: 0,
    ownerVerified,
  };
}

/**
 * Resolve a list of listing ids against the live DB first, then the
 * sample catalog. Real DB rows take precedence; sample matches fill
 * any ids not found in the DB. Returned in the order the caller passed.
 */
export async function getListingsByIds(ids: string[]): Promise<Listing[]> {
  if (ids.length === 0) return [];

  const byId = new Map<string, Listing>();

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .in("id", ids)
      .eq("status", "active");

    if (data) {
      for (const row of data as unknown as DbListing[]) {
        byId.set(row.id, mapDbListing(row));
      }
    }
  } catch {
    // Fall through to sample-only
  }

  for (const id of ids) {
    if (byId.has(id)) continue;
    const sample = sampleListings.find((l) => l.id === id);
    if (sample) byId.set(id, sample);
  }

  return ids.map((id) => byId.get(id)).filter((l): l is Listing => l != null);
}

/**
 * Clear all saved listings for the current user from Supabase.
 * Anonymous users handle this client-side via localStorage.
 */
export async function clearAllSaved(): Promise<{ ok: boolean }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false };
    await supabase.from("saved_listings").delete().eq("user_id", user.id);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
