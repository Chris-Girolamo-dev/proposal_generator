import type { Proposal } from "@/lib/proposal/types";
import { MOAT_WHY_US_POINTS, SECTION_INTROS } from "@/lib/proposal/defaults";
import { weeksLabelFromPhases } from "@/lib/proposal/types";
import { ContentsSection, type ContentsEntry } from "./sections/ContentsSection";
import { CoverSection } from "./sections/CoverSection";
import { NumberedSection } from "./sections/NumberedSection";
import { DeliverablesSection } from "./sections/DeliverablesSection";
import { TimelineSection } from "./sections/TimelineSection";
import { EngagementSection } from "./sections/EngagementSection";
import { WhyUsSection } from "./sections/WhyUsSection";
import { DataBoundariesSection } from "./sections/DataBoundariesSection";
import { InvestmentSection } from "./sections/InvestmentSection";
import { NextStepsSection } from "./sections/NextStepsSection";
import { ServicesAgreementSection } from "./sections/ServicesAgreementSection";

/**
 * The proposal document — "Swiss Atlas" print edition, carrying the OPFOR.ai
 * website design language (paper ground, hairline rules, Space Grotesk display,
 * mono instrument labels, red as rule-accent only) into the PDF. This is the
 * exact component rendered to PDF (P4). Do not reuse app-shell styling in here.
 */
/** Visual variants — same layout system, different design temperature (see globals.css). */
export type ProposalVariant = "atlas" | "instrument" | "plate" | "poster" | "serif" | "dark" | "globe" | "dark-globe" | "plate-globe" | "plate-globe-dark";

export function ProposalDocument({
  proposal,
  variant = "atlas",
  moat = false,
}: {
  proposal: Proposal;
  variant?: ProposalVariant;
  /** Moat edition: adds the Data boundaries page (07) and the Investment latency
      aside, renumbering downstream sections to NN / 10. Kept as a separate
      edition so the pre-moat template stays intact for comparison. */
  moat?: boolean;
}) {
  const clientCompany = proposal.client_company;
  const clientLogoUrl = proposal.client_logo_url;
  const total = moat ? "10" : "09";
  // The moat edition swaps in three architecture-backed Why-OPFOR points. This must live
  // here, the single call site every render path shares (both /preview pages and the
  // signed print route PDF export go through this component) -- it previously lived
  // duplicated in each preview page only, so the print route (the actual PDF a client
  // receives) never applied it and silently showed the generic points instead.
  const whyUs = moat ? { ...proposal.why_us, points: MOAT_WHY_US_POINTS } : proposal.why_us;

  // Built here because this is the only place the moat renumbering is known. Titles must
  // match the section headings exactly -- a contents page that paraphrases its own document
  // is worse than none.
  const contents: ContentsEntry[] = [
    { number: "01", title: "Areas of opportunity" },
    { number: "02", title: "Your solution" },
    { number: "03", title: "What ships" },
    { number: "04", title: `${weeksLabelFromPhases(proposal.timeline)}, week by week` },
    { number: "05", title: "The engagement" },
    { number: "06", title: "Why OPFOR" },
    ...(moat ? [{ number: "07", title: "Data boundaries" }] : []),
    { number: moat ? "08" : "07", title: "The investment" },
    { number: moat ? "09" : "08", title: "Next steps" },
    { number: moat ? "10" : "09", title: "Services agreement" },
  ];

  return (
    <div className="proposal-doc" data-variant={variant}>
      <CoverSection proposal={proposal} />

      <ContentsSection
        entries={contents}
        total={total}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />

      <NumberedSection
        number="01"
        total={total}
        title="Areas of opportunity"
        intro={SECTION_INTROS.opportunity}
        items={proposal.problems}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />

      <NumberedSection
        number="02"
        total={total}
        title="Your solution"
        intro={SECTION_INTROS.solution}
        items={proposal.benefits}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />

      <DeliverablesSection
        items={proposal.deliverables}
        total={total}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />
      <TimelineSection
        phases={proposal.timeline}
        total={total}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />
      <EngagementSection
        members={proposal.team}
        phases={proposal.timeline}
        total={total}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />
      <WhyUsSection
        whyUs={whyUs}
        total={total}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />
      {moat && (
        <DataBoundariesSection
          number="07"
          total={total}
          clientCompany={clientCompany}
          clientLogoUrl={clientLogoUrl}
        />
      )}
      <InvestmentSection
        items={proposal.cost_items}
        bonuses={proposal.bonuses}
        currency={proposal.currency}
        renewalCents={proposal.renewal_cents}
        discountPct={proposal.discount_pct}
        number={moat ? "08" : "07"}
        total={total}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />
      <NextStepsSection
        steps={proposal.next_steps}
        guarantee={proposal.guarantee}
        number={moat ? "09" : "08"}
        total={total}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />
      <ServicesAgreementSection
        clauses={proposal.services_agreement}
        number={moat ? "10" : "09"}
        total={total}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />
    </div>
  );
}
