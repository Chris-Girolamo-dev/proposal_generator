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
  /** No longer rendered: the timeline dropped its mono deliverables row (it repeated the
      What ships page in a fourth typeface). Retained so existing rows keep the data. */
  deliverables?: string[];
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
  /** Annual renewal price (year two on). 0 = flat annual (no separate renewal tier). */
  renewal_cents: number;
  /** Year-one discount as a percentage (e.g. 15 = 15% off). 0 = no discount shown. */
  discount_pct: number;

  /** Visual edition of the exported PDF. Editor offers Light ("plate-globe") /
      Dark ("plate-globe-dark"); any ProposalVariant string is accepted. */
  variant: string;
  /** Include the Data boundaries page + moat-backed Why-OPFOR points. */
  moat: boolean;
  payment_options: PaymentOption[];
  /** Whether the Founders Cohort offer copy renders (cover + investment page). */
  founders_cohort: boolean;

  status: ProposalStatus;
  created_at: string;
  updated_at: string;
}

/** Editable subset used by the proposal editor (excludes server-managed fields). */
export type ProposalDraft = Omit<
  Proposal,
  | "id"
  | "owner_id"
  | "slug"
  | "proposal_number"
  | "total_cents"
  | "status"
  | "created_at"
  | "updated_at"
  | "variant"
  | "moat"
  | "founders_cohort"
>;

export const lineTotalCents = (i: CostItem): number => Math.round(i.qty * i.unit_cents);

/** Optional add-ons show their price but never count toward the total. */
/**
 * A way to pay, shown on the investment page with its own price.
 *
 * `discount_pct` is applied to the year-one price *after* any proposal-level discount, so
 * the two compose rather than one silently replacing the other. A 0 discount is a real
 * option (the standard schedule), not an absent one.
 */
export interface PaymentOption {
  label: string;
  detail: string;
  discount_pct: number;
  /**
   * Years the option commits to, defaulting to one. A multi-year option must price the
   * whole commitment: a two-year option showing a single year's figure understates what
   * the client is actually signing for.
   *
   * Later years are priced at the locked renewal figure when the proposal sets one, and at
   * the year-one price when it does not -- an unset renewal means no reduced rate has been
   * agreed, not that later years are free.
   */
  years?: number;
  /** Marks the schedule the agreement's invoicing clause describes. */
  standard?: boolean;
}

export const subtotalCents = (items: CostItem[]): number =>
  items.reduce((sum, i) => sum + (i.optional ? 0 : lineTotalCents(i)), 0);

export const bonusTotalCents = (bonuses: BonusItem[]): number =>
  bonuses.reduce((sum, b) => sum + (b.value_cents ?? 0), 0);

/**
 * What a payment option actually costs, across its whole commitment, after its discount.
 * Returns the total and the per-year figure, since a multi-year total needs both to be
 * legible.
 */
export const paymentOptionTotals = (
  option: PaymentOption,
  yearOneCents: number,
  renewalCents: number,
): { total: number; perYear: number; years: number } => {
  const years = Math.max(1, Math.round(option.years ?? 1));
  const laterYear = renewalCents > 0 ? renewalCents : yearOneCents;
  const gross = yearOneCents + (years - 1) * laterYear;
  const total = gross - Math.round(gross * ((option.discount_pct || 0) / 100));
  return { total, perYear: Math.round(total / years), years };
};

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
