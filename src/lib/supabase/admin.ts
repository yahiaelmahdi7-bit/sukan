import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Returns a Supabase client that uses the service-role key.
 * This bypasses Row Level Security — only call from trusted server-side code
 * (API routes, webhooks, cron). Never import this file from client components.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "[supabase/admin] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set",
    );
  }

  return createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
