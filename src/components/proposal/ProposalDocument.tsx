import type { Proposal } from "@/lib/proposal/types";
import { SECTION_INTROS } from "@/lib/proposal/defaults";
import { CoverSection } from "./sections/CoverSection";
import { NumberedSection } from "./sections/NumberedSection";
import { DeliverablesSection } from "./sections/DeliverablesSection";
import { TimelineSection } from "./sections/TimelineSection";
import { EngagementSection } from "./sections/EngagementSection";
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
  const clientCompany = proposal.client_company;
  const clientLogoUrl = proposal.client_logo_url;

  return (
    <div className="proposal-doc bg-white font-heading text-[#1a1a1a]">
      <CoverSection proposal={proposal} />

      <NumberedSection
        number="01"
        eyebrow="AREAS OF OPPORTUNITY"
        boldText="Your areas of"
        accentText="opportunity."
        intro={SECTION_INTROS.opportunity}
        items={proposal.problems}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />

      <NumberedSection
        number="02"
        eyebrow="YOUR SOLUTION"
        boldText="Your"
        accentText="solution."
        intro={SECTION_INTROS.solution}
        items={proposal.benefits}
        tint
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />

      <DeliverablesSection
        items={proposal.deliverables}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />
      <TimelineSection
        phases={proposal.timeline}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />
      <EngagementSection
        members={proposal.team}
        phases={proposal.timeline}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />
      <WhyUsSection whyUs={proposal.why_us} clientCompany={clientCompany} clientLogoUrl={clientLogoUrl} />
      <InvestmentSection
        items={proposal.cost_items}
        currency={proposal.currency}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />
      <NextStepsSection
        steps={proposal.next_steps}
        guarantee={proposal.guarantee}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />
      <ServicesAgreementSection
        clauses={proposal.services_agreement}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />
    </div>
  );
}
