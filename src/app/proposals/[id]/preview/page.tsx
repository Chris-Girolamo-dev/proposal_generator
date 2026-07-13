import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProposalDocument, type ProposalVariant } from "@/components/proposal/ProposalDocument";
import type { Proposal } from "@/lib/proposal/types";

// In-browser preview of the REAL proposal being edited. Unlike /preview (the static
// design demo that renders a hardcoded "Acme Biotech" mock), this loads the actual row
// via the cookie-scoped server client, so RLS returns it only to its owner — that is the
// auth boundary here, no separate check needed. Distinct from proposals/[id]/print, which
// is cookie-less and token-gated for headless-Chromium PDF export.
//
// Content (client_company, costs, copy, saved variant/moat) comes from the DB, so the
// editor must Save before those changes show here. The ?v=/?m= params let the editor's
// variant + moat toggles preview live without saving, matching the old /preview behaviour.
const VARIANTS: ProposalVariant[] = [
  "atlas", "instrument", "plate", "poster", "serif",
  "dark", "globe", "dark-globe", "plate-globe", "plate-globe-dark",
];

export default async function ProposalPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ v?: string; m?: string }>;
}) {
  const { id } = await params;
  const { v, m } = await searchParams;

  const supabase = await createClient();
  const { data } = await supabase.from("proposals").select("*").eq("id", id).single();

  if (!data) notFound();

  const saved = data as Proposal;

  // ?v= overrides the saved variant so the editor's theme dropdown previews live; fall
  // back to the saved variant, then a sensible default.
  const variant =
    VARIANTS.find((name) => name === v) ??
    (VARIANTS.find((name) => name === saved.variant) as ProposalVariant | undefined) ??
    "plate-globe";

  // The editor emits ?m=1 only when moat is on, so presence maps 1:1 to the live toggle.
  const moat = m === "1";

  // The moat points swap happens once, inside ProposalDocument -- the single call site
  // every render path (this preview, the static demo preview, and the print/PDF route)
  // shares, so all three always stay in sync.
  return <ProposalDocument proposal={saved} variant={variant} moat={moat} />;
}
