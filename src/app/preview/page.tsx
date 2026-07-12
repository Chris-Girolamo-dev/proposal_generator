import { ProposalDocument, type ProposalVariant } from "@/components/proposal/ProposalDocument";
import { DEFAULT_PROPOSAL, MOAT_WHY_US_POINTS } from "@/lib/proposal/defaults";
import { subtotalCents, type Proposal } from "@/lib/proposal/types";

// No-auth, no-DB route: renders the LeftClick-structured / OPFOR-skinned template
// against DEFAULT_PROPOSAL so the design can be checked before Supabase is wired up.
// Demo models structure B: ~$68K year one, ~$34K locked renewal (see renewal_cents below).
const demoCostItems = [
  { label: "OPFOR Genesis Clinical Supply Forecasting Simulator", description: "Core model, risk engine, and dashboard build.", qty: 1, unit_cents: 6_800_000 },
  {
    label: "IRT integration",
    description: "Optional. Billed per integration; refunded onto your following-year renewal.",
    qty: 1,
    unit_cents: 568_000,
    optional: true,
  },
];

const mockProposal: Proposal = {
  ...DEFAULT_PROPOSAL,
  proposal_number: 928801,
  client_company: "Acme Biotech",
  id: "preview",
  owner_id: "preview",
  slug: "preview",
  cost_items: demoCostItems,
  total_cents: subtotalCents(demoCostItems),
  renewal_cents: 3_400_000, // $34,000 — half of the $68,000 year one, locked
  discount_pct: 0, // overridden by ?d= in preview for testing
  status: "draft",
  // variant/moat here only satisfy the type; the actual edition comes from the
  // ?v= and ?m= query params below.
  variant: "plate-globe",
  moat: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const VARIANTS: ProposalVariant[] = ["atlas", "instrument", "plate", "poster", "serif", "dark", "globe", "dark-globe", "plate-globe", "plate-globe-dark"];

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string; m?: string; d?: string }>;
}) {
  const { v, m, d } = await searchParams;
  const variant = VARIANTS.find((name) => name === v) ?? VARIANTS[Number(v) - 1] ?? "atlas";
  // ?m=1 — moat edition: Data boundaries page + moat-backed Why-OPFOR points +
  // roadmap line. Separate from the base edition so both stay reviewable.
  const moat = m === "1";
  // ?d=15 — preview a year-one discount (blank in real defaults).
  const discount_pct = d ? Number(d) : 0;
  const base = { ...mockProposal, discount_pct };
  const proposal = moat
    ? { ...base, why_us: { ...base.why_us, points: MOAT_WHY_US_POINTS } }
    : base;
  return <ProposalDocument proposal={proposal} variant={variant} moat={moat} />;
}
