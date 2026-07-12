import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options: CookieOptions };

const PUBLIC_PATHS = ["/login"];
// Fully exempt from cookie-based auth — no Supabase call at all. /preview has no real data;
// /proposals/*/print is the headless-Chromium render target and authorizes itself via a
// short-lived signed token instead of cookies (see lib/pdf/sign.ts) since Puppeteer's browser
// context carries none of the real user's session cookies.
const AUTH_EXEMPT_PATHS = ["/preview"];
const AUTH_EXEMPT_PATTERNS = [/^\/proposals\/[^/]+\/print$/];

export async function middleware(request: NextRequest) {
  if (
    AUTH_EXEMPT_PATHS.some((p) => request.nextUrl.pathname.startsWith(p)) ||
    AUTH_EXEMPT_PATTERNS.some((re) => re.test(request.nextUrl.pathname))
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublic = PUBLIC_PATHS.some((p) => request.nextUrl.pathname.startsWith(p));

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/).*)"],
  // Node.js runtime (stable since Next.js 15.5) instead of Edge: Edge lacks __dirname,
  // which something in the @supabase/ssr import graph references, crashing every
  // request in prod (MIDDLEWARE_INVOCATION_FAILED). Node runtime has it natively.
  runtime: "nodejs",
};
