// TEMPORARY DIAGNOSTIC — do not leave this deployed. Absolute minimal middleware, zero
// imports (Response is a Web-standard global, not a Next.js/framework import). Relocated
// from project-root middleware.ts to src/middleware.ts: this project uses a src/ directory
// (src/app/...), and Next.js requires middleware.ts to live inside src/ in that layout —
// a root-level middleware.ts is silently misdetected. This single-variable test isolates
// whether relocation alone fixes invocation.
export function middleware() {
  return new Response("middleware diagnostic ok", { status: 200 });
}

export const config = {
  matcher: ["/dashboard"],
};
