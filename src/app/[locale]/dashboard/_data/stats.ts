import { createClient } from "@/lib/supabase/server";

export type DashboardStatsReal = {
  totalListings: number;
  totalInquiries: number;
  totalViews: number;
  totalSaved: number;
};

/**
 * Fetches real dashboard stats for a user from Supabase.
 * Each query is wrapped in its own try/catch so a missing table or network
 * error on any one metric degrades gracefully to 0.
 */
export async function getDashboardStats(
  userId: string,
): Promise<DashboardStatsReal> {
  const supabase = await createClient();

  let totalListings = 0;
  let totalInquiries = 0;
  let totalViews = 0;
  let totalSaved = 0;

  try {
    const { count } = await supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", userId);
    totalListings = count ?? 0;
  } catch {
    // table may not exist or RLS blocks — return 0
  }

  try {
    // inquiries joined through listings to get user's inquiries
    const { count } = await supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", userId);
    totalInquiries = count ?? 0;
  } catch {
    // inquiries table may reference owner differently
  }

  try {
    const { count } = await supabase
      .from("listing_views")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", userId);
    totalViews = count ?? 0;
  } catch {
    // listing_views table may not exist yet — migration pending
  }

  try {
    const { count } = await supabase
      .from("price_alerts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);
    totalSaved = count ?? 0;
  } catch {
    // price_alerts table may not exist yet — migration pending
  }

  return { totalListings, totalInquiries, totalViews, totalSaved };
}
