import { NextResponse } from "next/server";

// PDF export lands in build phase P4 (serverless Chromium render of the
// ProposalDocument route). Stubbed now so the dashboard/editor can link here
// without a 404 while P2/P3 (editor + template) are still in progress.
export async function GET() {
  return NextResponse.json(
    { error: "PDF export not implemented yet (phase P4)." },
    { status: 501 },
  );
}
