export type UserRole = "tenant" | "landlord" | "agent";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole | null;
  preferred_locale: string | null;
  phone: string | null;
  whatsapp: string | null;
  is_agent: boolean;
  is_admin: boolean;
  is_verified: boolean;
  verified_at: string | null;
  verification_requested_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  owner_id: string;
  title_en: string | null;
  title_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  property_type: string;
  purpose: "rent" | "sale";
  price: number;
  currency: string;
  price_period: "month" | "year" | "total" | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | null;
  state: string;
  city: string;
  neighborhood: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  amenities: string[];
  is_featured: boolean;
  is_verified: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListingPhoto {
  id: string;
  listing_id: string;
  storage_path: string;
  url: string | null;
  position: number;
  created_at: string;
}

export interface ListingView {
  id: string;
  listing_id: string;
  viewer_id: string | null;
  ip_hash: string | null;
  created_at: string;
}

export interface SavedListing {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export interface Inquiry {
  id: string;
  listing_id: string;
  sender_id: string | null;
  sender_name: string | null;
  sender_email: string | null;
  sender_phone: string | null;
  message: string;
  created_at: string;
}
