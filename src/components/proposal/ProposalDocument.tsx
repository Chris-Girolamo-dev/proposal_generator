import type { Proposal } from "@/lib/proposal/types";
import { SECTION_INTROS, SECTION_TITLES } from "@/lib/proposal/defaults";
import { CoverSection } from "./sections/CoverSection";
import { NumberedSection } from "./sections/NumberedSection";
import { DeliverablesSection } from "./sections/DeliverablesSection";
import { TimelineSection } from "./sections/TimelineSection";
import { WhyUsSection } from "./sections/WhyUsSection";
import { InvestmentSection } from "./sections/InvestmentSection";
import { NextStepsSection } from "./sections/NextStepsSection";
import { ServicesAgreementSection } from "./sections/ServicesAgreementSection";

/**
 * The LeftClick-structured, OPFOR-skinned proposal document. This is the exact
 * component rendered to PDF (P4) — white pages, serif display headings, OPFOR
 * red accents. Do not reuse app-shell (dashboard/editor) styling in here.
 */
export function ProposalDocument({ proposal }: { proposal: Proposal }) {
  return (
    <div className="proposal-doc bg-white text-[#1a1a1a]">
      <CoverSection proposal={proposal} />

      <NumberedSection
        eyebrow={SECTION_TITLES.opportunity}
        intro={SECTION_INTROS.opportunity}
        items={proposal.problems}
      />

      <NumberedSection
        eyebrow={SECTION_TITLES.solution}
        intro={SECTION_INTROS.solution}
        items={proposal.benefits}
        tint
      />

      <DeliverablesSection items={proposal.deliverables} />
      <TimelineSection phases={proposal.timeline} />
      <WhyUsSection whyUs={proposal.why_us} />
      <InvestmentSection items={proposal.cost_items} currency={proposal.currency} />
      <NextStepsSection steps={proposal.next_steps} guarantee={proposal.guarantee} />
      <ServicesAgreementSection
        clauses={proposal.services_agreement}
        clientCompany={proposal.client_company}
      />
    </div>
  );
}
