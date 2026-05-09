import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/";

  if (error) {
    const params = new URLSearchParams({ auth_error: errorDescription ?? error });
    return NextResponse.redirect(`${origin}/en/sign-in?${params}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      const params = new URLSearchParams({ auth_error: exchangeError.message });
      return NextResponse.redirect(`${origin}/en/sign-in?${params}`);
    }
  }

  // Redirect to the requested page, defaulting to root (locale prefix is
  // added automatically by next-intl middleware on the next navigation).
  const redirectTo = next.startsWith("/") ? `${origin}${next}` : origin;
  return NextResponse.redirect(redirectTo);
}
