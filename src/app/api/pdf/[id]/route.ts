import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signProposalToken } from "@/lib/pdf/sign";

export const maxDuration = 60;

async function launchBrowser() {
  if (process.env.NODE_ENV === "production") {
    const [{ default: chromium }, { default: puppeteer }] = await Promise.all([
      import("@sparticuz/chromium"),
      import("puppeteer-core"),
    ]);
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
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

  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(printUrl.toString(), { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "letter", printBackground: true });

    const filename = `${(proposal.client_company || proposal.slug || "proposal").replace(/[^a-z0-9]+/gi, "-")}.pdf`;

    // page.pdf() returns a Uint8Array; Buffer is an accepted BodyInit for the response.
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } finally {
    await browser.close();
  }
}
