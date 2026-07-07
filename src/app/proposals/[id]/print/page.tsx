import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyProposalToken } from "@/lib/pdf/sign";
import { ProposalDocument } from "@/components/proposal/ProposalDocument";
import type { Proposal } from "@/lib/proposal/types";

// Cookie-less render target for the PDF export route (see api/pdf/[id]). Not reachable
// without a short-lived signed token — see middleware.ts AUTH_EXEMPT_PATHS + lib/pdf/sign.ts.
export default async function PrintProposalPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;

  if (!verifyProposalToken(id, token ?? null)) notFound();

  const supabase = createAdminClient();
  const { data } = await supabase.from("proposals").select("*").eq("id", id).single();

  if (!data) notFound();

  return <ProposalDocument proposal={data as Proposal} />;
}
