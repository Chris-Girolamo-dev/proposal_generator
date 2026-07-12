import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login"];
// Fully exempt from any auth check. /preview has no real data; /proposals/*/print is
// the headless-Chromium render target and authorizes itself via a short-lived signed
// token instead of cookies (see lib/pdf/sign.ts) since Puppeteer's browser context
// carries none of the real user's session cookies.
const AUTH_EXEMPT_PATHS = ["/preview"];
const AUTH_EXEMPT_PATTERNS = [/^\/proposals\/[^/]+\/print$/];

// Middleware deliberately does NOT import @supabase/ssr. Two prod-only failures traced
// back to that import: (1) on the Edge runtime, something in its dependency graph
// references the Node-only `__dirname` global, which Edge lacks
// (MIDDLEWARE_INVOCATION_FAILED, ReferenceError: __dirname is not defined); (2) switching
// middleware to the Node.js runtime (stable since Next.js 15.5) traded that for a second
// bug — Next.js writes the Node-middleware bundle as ESM `import` syntax into a plain
// .js file with no per-function package.json declaring "type": "module", so Node refuses
// to load it (SyntaxError: Cannot use import statement outside a module). Neither is
// fixable from this repo; both disappear if middleware never imports the SDK.
//
// So this is a fast, Edge-safe, SDK-free approximation: Supabase's ssr cookie helper
// always sets cookies named "sb-<project-ref>-auth-token" (optionally chunked
// ".0"/".1"/...). Presence of any "sb-*-auth-token*" cookie means a session exists.
// This is NOT the security boundary — it only decides whether to bounce a page load to
// /login. Every real write (createProposal, updateProposal, deleteProposal, ...) and
// every data read still goes through lib/supabase/server.ts's createClient(), which
// runs in a normal serverless function (not Edge, not Node-middleware) and either calls
// auth.getUser() directly or is scoped by RLS — that is where auth is actually enforced.
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
