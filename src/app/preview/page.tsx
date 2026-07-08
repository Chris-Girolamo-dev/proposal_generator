import { ProposalDocument, type ProposalVariant } from "@/components/proposal/ProposalDocument";
import { DEFAULT_PROPOSAL } from "@/lib/proposal/defaults";
import { subtotalCents, type Proposal } from "@/lib/proposal/types";

// No-auth, no-DB route: renders the LeftClick-structured / OPFOR-skinned template
// against DEFAULT_PROPOSAL so the design can be checked before Supabase is wired up.
const demoCostItems = [
  { label: "Clinical Supply Forecasting Simulator", description: "Core model, risk engine, and dashboard build.", qty: 1, unit_cents: 4_500_000 },
  { label: "White-glove onboarding", description: "Hands-on setup with your team.", qty: 3, unit_cents: 150_000 },
  { label: "Training hours", description: "Live working sessions post-launch.", qty: 5, unit_cents: 40_000 },
];

const mockProposal: Proposal = {
  ...DEFAULT_PROPOSAL,
  client_company: "Acme Biotech",
  id: "preview",
  owner_id: "preview",
  slug: "preview",
  cost_items: demoCostItems,
  total_cents: subtotalCents(demoCostItems),
  status: "draft",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const VARIANTS: ProposalVariant[] = ["atlas", "instrument", "plate", "poster", "serif", "dark", "globe", "dark-globe", "plate-globe", "plate-globe-dark"];

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v } = await searchParams;
  const variant = VARIANTS.find((name) => name === v) ?? VARIANTS[Number(v) - 1] ?? "atlas";
  return <ProposalDocument proposal={mockProposal} variant={variant} />;
}
