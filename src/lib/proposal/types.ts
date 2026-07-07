// Proposal data model — mirrors supabase/migrations/0001_init.sql
// Money is always integer cents. Section copy ships with biotech defaults (see defaults.ts).

export type ProposalStatus = "draft" | "ready" | "sent";

export interface NumberedItem {
  /** display numeral, e.g. "01" */
  n: string;
  text: string;
}

export interface TimelinePhase {
  phase: string; // "01"
  label: string; // "Discovery & Data Audit"
  detail: string; // "what happens"
  whyItMatters?: string; // "why it matters" — optional: absent on proposals created before this field existed
  duration?: string; // "Week 1"
}

export interface AgreementClause {
  number: string; // "3.1"
  title: string;
  body: string[]; // one or more paragraphs
  bullets?: boolean; // render body as a bulleted list instead of paragraphs
}

export interface WhyUs {
  headline: string;
  blurb: string;
  stats: { value: string; label: string }[];
}

export interface CostItem {
  label: string;
  description?: string;
  qty: number;
  unit_cents: number;
}

export interface Proposal {
  id: string;
  owner_id: string;
  slug: string;

  client_company: string;
  project_title: string;
  subtitle: string;

  problems: NumberedItem[]; // rendered under "Areas of Opportunity"
  benefits: NumberedItem[]; // rendered under "Your Solution"
  deliverables: { text: string }[];
  timeline: TimelinePhase[];
  why_us: WhyUs;
  next_steps: { step: string }[];
  guarantee: string;
  services_agreement: AgreementClause[];

  cost_items: CostItem[];
  currency: string;
  total_cents: number;

  status: ProposalStatus;
  created_at: string;
  updated_at: string;
}

/** Editable subset used by the proposal editor (excludes server-managed fields). */
export type ProposalDraft = Omit<
  Proposal,
  "id" | "owner_id" | "slug" | "total_cents" | "status" | "created_at" | "updated_at"
>;

export const lineTotalCents = (i: CostItem): number => Math.round(i.qty * i.unit_cents);

export const subtotalCents = (items: CostItem[]): number =>
  items.reduce((sum, i) => sum + lineTotalCents(i), 0);

export const formatMoney = (cents: number, currency = "usd"): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
