import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Magic-link / password-recovery landing route.
//
// The browser client (lib/supabase/client.ts) uses PKCE, so Supabase sends the user back
// here with a ?code= rather than tokens in the URL fragment. @supabase/ssr stashed the PKCE
// verifier in a cookie when the link was requested, so this exchange runs server-side and
// writes the real session cookies — which is what middleware.ts looks for.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = request.nextUrl.searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url),
    );
  }

  return NextResponse.redirect(new URL(next, request.url));
}
