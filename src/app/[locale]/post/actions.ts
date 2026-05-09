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
      status: "pending_payment",
      whatsapp_contact: input.whatsappContact,
    })
    .select("id")
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { ok: true, listingId: data.id };
}
