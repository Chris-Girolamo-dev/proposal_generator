"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_PROPOSAL } from "./defaults";
import { subtotalCents, type BonusItem, type CostItem, type NumberedItem } from "./types";

export async function createProposal() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("proposals")
    .insert({ owner_id: user.id, ...DEFAULT_PROPOSAL })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create proposal");
  }

  redirect(`/proposals/${data.id}/edit`);
}

export interface ProposalHeaderUpdate {
  proposal_number: number;
  proposal_version: string;
  client_company: string;
  project_title: string;
  subtitle: string;
  guarantee: string;
  cost_items: CostItem[];
  bonuses: BonusItem[];
  renewal_cents: number;
  discount_pct: number;
  problems: NumberedItem[];
  variant: string;
  moat: boolean;
}

export async function updateProposal(id: string, update: ProposalHeaderUpdate) {
  const supabase = await createClient();
  // Stored total reflects the net year-one price (after any discount).
  const gross = subtotalCents(update.cost_items);
  const total_cents = gross - Math.round(gross * ((update.discount_pct ?? 0) / 100));

  const { error } = await supabase
    .from("proposals")
    .update({ ...update, total_cents })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function updateClientLogo(id: string, url: string | null) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("proposals")
    .update({ client_logo_url: url })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath(`/proposals/${id}/edit`);
}

/**
 * Pulls an existing proposal's boilerplate sections up to the current template.
 *
 * createProposal() snapshots DEFAULT_PROPOSAL into the row at insert, so a proposal keeps
 * whatever the template said the day it was created. Editing defaults.ts afterwards only
 * reaches NEW proposals. This is the way to bring an old one forward.
 *
 * Only the sections with no editor UI are overwritten. Everything the editor can change, or
 * that is client-specific, is left alone on purpose:
 *   - `problems` may hold transcript-generated Areas of Opportunity. Never clobber it.
 *   - subtitle, guarantee, cost_items, bonuses, discount_pct, renewal_cents, client_company,
 *     project_title, client_logo_url, variant, moat are all edited by hand per client.
 */
export async function resetCopyFromTemplate(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("proposals")
    .update({
      benefits: DEFAULT_PROPOSAL.benefits,
      deliverables: DEFAULT_PROPOSAL.deliverables,
      timeline: DEFAULT_PROPOSAL.timeline,
      team: DEFAULT_PROPOSAL.team,
      why_us: DEFAULT_PROPOSAL.why_us,
      next_steps: DEFAULT_PROPOSAL.next_steps,
      services_agreement: DEFAULT_PROPOSAL.services_agreement,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath(`/proposals/${id}/edit`);
}

export async function deleteProposal(id: string) {
  const supabase = await createClient();

  // RLS (proposals_delete_own) already scopes this to the caller's own rows —
  // the .eq is belt-and-suspenders, not the security boundary.
  const { error } = await supabase.from("proposals").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}
