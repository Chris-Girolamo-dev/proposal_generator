// TEMPORARY DIAGNOSTIC — do not leave this deployed. Absolute minimal middleware, zero
// imports (Response is a Web-standard global, not a Next.js/framework import). If THIS
// still throws "__dirname is not defined" in prod, the bug is not in our source at all —
// it is Next.js's own Edge middleware bundler/runtime on this Vercel project, unrelated
// to anything we import. If this works, real logic goes back in incrementally.
export function middleware() {
  return new Response("middleware diagnostic ok", { status: 200 });
}

export const config = {
  matcher: ["/dashboard"],
};
