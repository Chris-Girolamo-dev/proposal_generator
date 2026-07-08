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
 * The proposal document — "Swiss Atlas" print edition, carrying the OPFOR.ai
 * website design language (paper ground, hairline rules, Space Grotesk display,
 * mono instrument labels, red as rule-accent only) into the PDF. This is the
 * exact component rendered to PDF (P4). Do not reuse app-shell styling in here.
 */
/** Visual variants — same layout system, different design temperature (see globals.css). */
export type ProposalVariant = "atlas" | "instrument" | "plate" | "poster" | "serif" | "dark" | "globe";

export function ProposalDocument({
  proposal,
  variant = "atlas",
}: {
  proposal: Proposal;
  variant?: ProposalVariant;
}) {
  const clientCompany = proposal.client_company;
  const clientLogoUrl = proposal.client_logo_url;

  return (
    <div className="proposal-doc" data-variant={variant}>
      <CoverSection proposal={proposal} />

      <NumberedSection
        number="01"
        title="Areas of opportunity"
        say={<>Where accuracy and speed<br />are being capped today.</>}
        intro={SECTION_INTROS.opportunity}
        items={proposal.problems}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />

      <NumberedSection
        number="02"
        title="Your solution"
        say={<>Clean pipelines, probabilistic<br />modeling, repeatable SOPs.</>}
        intro={SECTION_INTROS.solution}
        items={proposal.benefits}
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
