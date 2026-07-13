import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signProposalToken } from "@/lib/pdf/sign";

export const maxDuration = 60;

async function launchBrowser() {
  if (process.env.NODE_ENV === "production") {
    // @sparticuz/chromium only extracts its bundled shared libraries (al2023.tar.br ->
    // /tmp/al2023/lib) and sets LD_LIBRARY_PATH when it believes it is on Lambda. It decides
    // that by sniffing AWS_EXECUTION_ENV / AWS_LAMBDA_JS_RUNTIME for the strings "20.x" or
    // "22.x" -- and it recognises neither Node 24 nor Vercel's runtime. Unrecognised, it
    // still extracted the chromium binary but none of its libraries, so the binary died with
    // "libnss3.so: cannot open shared object file". Claiming nodejs22.x makes it take the
    // AL2023 branch, which is the correct image for Vercel's current Node runtimes.
    //
    // This MUST be assigned before the import below -- the package runs that check at module
    // load, not on first use. And do not "fix" the value to nodejs24.x to match the real
    // runtime: that matches neither check, so it would fall through to the Amazon Linux 2
    // path and extract the wrong libraries.
    process.env.AWS_LAMBDA_JS_RUNTIME = "nodejs22.x";

    const [{ default: chromium }, { default: puppeteer }] = await Promise.all([
      import("@sparticuz/chromium"),
      import("puppeteer-core"),
    ]);

    // Leave graphicsMode alone. In v131 the "--use-angle=swiftshader" flag is pushed
    // unconditionally (its conditional is commented out upstream, Sparticuz/chromium#247),
    // so disabling graphics would skip extracting swiftshader while still asking Chromium
    // to use it.
    //
    // headless must come from the package rather than a bare `true`: it selects the
    // chromium-shell mode the bundled binary actually ships, whereas `true` can send
    // puppeteer looking for a full headless Chrome that isn't there.
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }

  const { default: puppeteer } = await import("puppeteer");
  return puppeteer.launch({ headless: true });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // RLS-scoped: only succeeds if the logged-in user owns this proposal.
  const supabase = await createClient();
  const { data: proposal } = await supabase
    .from("proposals")
    .select("id, slug, client_company")
    .eq("id", id)
    .single();

  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  const token = signProposalToken(id);
  const printUrl = new URL(`/proposals/${id}/print`, request.nextUrl.origin);
  printUrl.searchParams.set("token", token);

  let browser: Awaited<ReturnType<typeof launchBrowser>> | undefined;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    // Bounded under maxDuration so a hung print page surfaces as a real error instead of
    // the platform killing the function with nothing to show for it.
    await page.goto(printUrl.toString(), { waitUntil: "networkidle0", timeout: 45_000 });
    const pdf = await page.pdf({ format: "letter", printBackground: true });

    const filename = `${(proposal.client_company || proposal.slug || "proposal").replace(/[^a-z0-9]+/gi, "-")}.pdf`;

    // page.pdf() returns a Uint8Array; Buffer is an accepted BodyInit for the response.
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    // The serverless Chromium render fails in several distinct ways (missing binary,
    // cold-start timeout, print page throwing). Without this they all collapse into an
    // opaque 500 with nothing in the response to act on.
    console.error("PDF render failed", err);
    return NextResponse.json(
      { error: "PDF render failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  } finally {
    await browser?.close();
  }
}
