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
  label: string; // bold prefix, e.g. "Discovery & Data Audit."
  tagline?: string; // italic accent phrase, e.g. "map the terrain before you build."
  detail: string; // first paragraph — what happens
  whyItMatters?: string; // second paragraph — why it matters. optional: absent on proposals created before this field existed
  deliverables?: string[]; // short tags shown as a slash-separated row, e.g. ["Data audit", "Model spec"]
  duration?: string; // "Week 1"
}

export interface AgreementClause {
  number: string; // "3.1"
  title: string;
  body: string[]; // one or more paragraphs
  bullets?: boolean; // render body as a bulleted list instead of paragraphs
}

export interface TeamMember {
  role: string; // "Engagement Lead"
  badge: string; // "CORE" | "SUPPORT"
  description: string;
}

export interface WhyUs {
  headline: string;
  blurb: string;
  stats: { value: string; label: string }[];
  capabilities?: string[]; // pill row, e.g. "Monte Carlo Risk Modeling" — optional: absent on older proposals
  points?: { title: string; description: string }[]; // numbered two-column reasoning grid
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
  team: TeamMember[];
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

const SMALL_NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];

export const numberWord = (n: number): string => SMALL_NUMBER_WORDS[n] ?? String(n);

/** Total build duration, derived from the highest week number across all phase durations. */
export const weeksLabelFromPhases = (phases: TimelinePhase[]): string => {
  const weekNumbers = phases.flatMap((p) => (p.duration ? (p.duration.match(/\d+/g) ?? []) : []))
    .map(Number);
  const totalWeeks = weekNumbers.length > 0 ? Math.max(...weekNumbers) : phases.length;
  return `${totalWeeks} week${totalWeeks === 1 ? "" : "s"}`;
};
