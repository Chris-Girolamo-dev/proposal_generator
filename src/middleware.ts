import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login"];
// Fully exempt from any auth check. /preview is the static design demo (no real data);
// /proposals/*/print is the headless-Chromium render target and authorizes itself via a
// short-lived signed token instead of cookies (see lib/pdf/sign.ts) since Puppeteer's
// browser context carries none of the real user's session cookies.
const AUTH_EXEMPT_PATHS = ["/preview"];
const AUTH_EXEMPT_PATTERNS = [/^\/proposals\/[^/]+\/print$/];

// This middleware deliberately does NOT import @supabase/ssr, but NOT for the reason an
// earlier version of this comment claimed. The prod-only "ReferenceError: __dirname is not
// defined" (MIDDLEWARE_INVOCATION_FAILED) that plagued this deploy was ultimately traced to
// the Vercel project's Framework Preset being set to "Other" instead of "Next.js" — every
// route 404'd/500'd because Vercel wasn't building the app as Next.js at all. It was NOT the
// SDK: a zero-import middleware reproduced the identical error under the wrong preset.
//
// We still keep middleware SDK-free on purpose, as a simplicity + safety choice: a cookie
// presence check is all we need to bounce anonymous page loads to /login, it runs fast at
// the edge, and it avoids the session-refresh complexity of the full ssr middleware pattern
// (fine here — this is a single-user internal tool). Supabase's ssr cookie helper always
// sets cookies named "sb-<project-ref>-auth-token" (optionally chunked ".0"/".1"/...), so
// the presence of any "sb-*-auth-token*" cookie means a session exists.
//
// This is NOT the security boundary. It only decides whether to redirect a page load. Every
// real write (createProposal/updateProposal/deleteProposal/...) and every data read still
// goes through lib/supabase/server.ts's createClient() in a normal serverless function,
// which either calls auth.getUser() directly or is scoped by RLS — that is where auth is
// actually enforced.
function hasSupabaseSession(request: NextRequest): boolean {
  return request.cookies.getAll().some((c) => /^sb-.*-auth-token/.test(c.name));
}

export function middleware(request: NextRequest) {
  if (
    AUTH_EXEMPT_PATHS.some((p) => request.nextUrl.pathname.startsWith(p)) ||
    AUTH_EXEMPT_PATTERNS.some((re) => re.test(request.nextUrl.pathname))
  ) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some((p) => request.nextUrl.pathname.startsWith(p));
  const loggedIn = hasSupabaseSession(request);

  if (!loggedIn && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (loggedIn && request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/).*)"],
};
