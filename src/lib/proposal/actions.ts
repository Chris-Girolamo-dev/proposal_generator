"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_PROPOSAL } from "./defaults";
import { subtotalCents, type CostItem } from "./types";

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
  client_company: string;
  project_title: string;
  subtitle: string;
  guarantee: string;
  cost_items: CostItem[];
}

export async function updateProposal(id: string, update: ProposalHeaderUpdate) {
  const supabase = await createClient();
  const total_cents = subtotalCents(update.cost_items);

  const { error } = await supabase
    .from("proposals")
    .update({ ...update, total_cents })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
