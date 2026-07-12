import type { Proposal } from "@/lib/proposal/types";
import { SECTION_INTROS } from "@/lib/proposal/defaults";
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

  return (
    <div className="proposal-doc" data-variant={variant}>
      <CoverSection proposal={proposal} />

      <NumberedSection
        number="01"
        total={total}
        title="Areas of opportunity"
        say={<>Where accuracy and speed<br />are being capped today.</>}
        intro={SECTION_INTROS.opportunity}
        items={proposal.problems}
        clientCompany={clientCompany}
        clientLogoUrl={clientLogoUrl}
      />

      <NumberedSection
        number="02"
        total={total}
        title="Your solution"
        say={<>Clean inputs. Honest<br />uncertainty. Your process.</>}
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
        whyUs={proposal.why_us}
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
        number={moat ? "08" : "07"}
        total={total}
        say={moat ? <>Seconds to an answer.<br />No vendor queue.</> : undefined}
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
