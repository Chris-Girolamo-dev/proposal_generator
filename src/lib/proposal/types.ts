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
  /** Optional add-on: shown in the price table with its price but excluded from the total. */
  optional?: boolean;
}

/** A value-stack bonus shown on the Investment page: real value on the right,
    an "Included / credited" stamp instead of a price. */
export interface BonusItem {
  label: string;
  /** Real-world value in cents; omit for unpriceable bonuses (guarantees, 24/7 access). */
  value_cents?: number;
  /** Right-column stamp; defaults to "Included". e.g. "Credited on renewal" */
  tag?: string;
}

export interface Proposal {
  id: string;
  owner_id: string;
  slug: string;

  /** Sequential, never-repeating (DB sequence from 928801). Server-assigned on create. */
  proposal_number: number;
  /** Shown beside the number on the cover stamp, e.g. "V1.0". */
  proposal_version: string;

  client_company: string;
  client_logo_url: string | null;
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
  bonuses: BonusItem[];
  currency: string;
  total_cents: number;

  status: ProposalStatus;
  created_at: string;
  updated_at: string;
}

/** Editable subset used by the proposal editor (excludes server-managed fields). */
export type ProposalDraft = Omit<
  Proposal,
  "id" | "owner_id" | "slug" | "proposal_number" | "total_cents" | "status" | "created_at" | "updated_at"
>;

export const lineTotalCents = (i: CostItem): number => Math.round(i.qty * i.unit_cents);

/** Optional add-ons show their price but never count toward the total. */
export const subtotalCents = (items: CostItem[]): number =>
  items.reduce((sum, i) => sum + (i.optional ? 0 : lineTotalCents(i)), 0);

export const bonusTotalCents = (bonuses: BonusItem[]): number =>
  bonuses.reduce((sum, b) => sum + (b.value_cents ?? 0), 0);

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
