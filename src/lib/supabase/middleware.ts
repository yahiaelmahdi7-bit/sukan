import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Refresh the Supabase auth session cookie on every request.
 *
 * Wire into proxy.ts:
 *
 *   import { updateSession } from "@/lib/supabase/middleware";
 *   import createIntlMiddleware from "next-intl/middleware";
 *   import { routing } from "@/i18n/routing";
 *
 *   const intlMiddleware = createIntlMiddleware(routing);
 *
 *   export default async function middleware(request: NextRequest) {
 *     // 1. Run Supabase session refresh first — it returns a response with
 *     //    updated Set-Cookie headers. We pass the request through and carry
 *     //    the supabase response as the base for next-intl so headers merge.
 *     const supabaseResponse = await updateSession(request);
 *
 *     // 2. Run next-intl locale middleware. It reads the request and rewrites
 *     //    the URL if needed. We ignore its response body and instead copy
 *     //    its headers onto the supabase response so both middleware effects
 *     //    are applied.
 *     const intlResponse = intlMiddleware(request);
 *
 *     // 3. Merge: copy every header from intlResponse onto supabaseResponse.
 *     intlResponse.headers.forEach((value, key) => {
 *       supabaseResponse.headers.set(key, value);
 *     });
 *
 *     // 4. If next-intl issued a redirect or rewrite, honour it.
 *     if (
 *       intlResponse.status === 307 ||
 *       intlResponse.status === 308 ||
 *       intlResponse.headers.get("location")
 *     ) {
 *       return intlResponse;
 *     }
 *
 *     return supabaseResponse;
 *   }
 *
 *   export const config = {
 *     matcher: [
 *       "/",
 *       "/(en|ar)/:path*",
 *       "/((?!_next|_vercel|api|.*\\.[^/]*$).*)",
 *     ],
 *   };
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // First apply to the request so subsequent server code sees them.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // Re-create the response so it carries the updated request cookies.
          response = NextResponse.next({ request });
          // Then set them on the outgoing response so the browser receives them.
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Calling getUser() is the recommended way to refresh the session token.
  // Do NOT remove this call — it is what keeps the cookie fresh on every
  // request and prevents the user being signed out unexpectedly.
  await supabase.auth.getUser();

  return response;
}
