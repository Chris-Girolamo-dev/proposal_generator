import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProposalEditor } from "@/components/editor/ProposalEditor";
import type { Proposal } from "@/lib/proposal/types";

// The Areas-of-Opportunity server action calls the Anthropic API from this segment; a
// long transcript takes a few seconds, comfortably over the platform default.
export const maxDuration = 60;

export default async function EditProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("proposals").select("*").eq("id", id).single();

  if (!data) notFound();

  return <ProposalEditor proposal={data as Proposal} />;
}
