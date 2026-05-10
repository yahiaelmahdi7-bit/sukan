import { createClient } from "@/lib/supabase/server";
import type { Inquiry } from "./inquiry-types";

export type { Inquiry };

/**
 * Fetches inquiries for listings owned by userId, joined with listing titles.
 * Returns an empty array on any error (table missing, RLS, network) so callers
 * can fall back to mock data cleanly.
 */
export async function getInquiriesForUser(
  userId: string,
): Promise<Inquiry[]> {
  try {
    const supabase = await createClient();

    // Fetch inquiries where the related listing is owned by this user.
    // The join path: inquiries.listing_id → listings.id + listings.owner_id
    const { data, error } = await supabase
      .from("inquiries")
      .select(
        `
        id,
        listing_id,
        inquirer_name,
        inquirer_phone,
        message,
        channel,
        created_at,
        is_read,
        listings!inner(
          title_en,
          title_ar,
          owner_id
        )
      `,
      )
      .eq("listings.owner_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return (
      data as unknown as Array<{
        id: string;
        listing_id: string;
        inquirer_name: string | null;
        inquirer_phone: string | null;
        message: string | null;
        channel: string | null;
        created_at: string;
        is_read: boolean | null;
        listings: {
          title_en: string;
          title_ar: string;
          owner_id: string;
        } | null;
      }>
    ).map((row) => {
      const name = row.inquirer_name ?? "Unknown";
      const msg = row.message ?? "";
      const titleEn = row.listings?.title_en ?? "";
      const titleAr = row.listings?.title_ar ?? "";
      return {
        id: row.id,
        listing_id: row.listing_id,
        listing_title_en: titleEn,
        listing_title_ar: titleAr,
        // Real inquiries store a single name/message; mirror to both locales
        inquirer_name_en: name,
        inquirer_name_ar: name,
        inquirer_phone: row.inquirer_phone ?? "",
        message_en: msg,
        message_ar: msg,
        channel: row.channel ?? "platform",
        created_at: row.created_at,
        is_read: row.is_read ?? false,
      };
    });
  } catch {
    // table may not exist yet (migration pending) — caller uses mock fallback
    return [];
  }
}
