import { formatMoney, subtotalCents, weeksLabelFromPhases, type Proposal } from "@/lib/proposal/types";
import { PageHeader } from "./PageHeader";

// The site's hero, set for print: mono meta blocks top-left/right, an oversized
// uppercase Space Grotesk headline with a dim second line, an OCR-A tagline, and
// a bstat-style meta strip pinned to the bottom edge.
export function CoverSection({ proposal }: { proposal: Proposal }) {
  const proposalDate = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const weeksLabel = weeksLabelFromPhases(proposal.timeline);

  const meta = [
    { label: "Prepared for", value: proposal.client_company },
    { label: "Investment", value: formatMoney(subtotalCents(proposal.cost_items), proposal.currency) },
    { label: "Timeline", value: weeksLabel },
    { label: "Issued", value: proposalDate },
  ];

  return (
    <section className="flex min-h-[11in] flex-col p-16">
      <PageHeader
        clientCompany={proposal.client_company}
        clientLogoUrl={proposal.client_logo_url}
        noBorder
        trailing={<p className="pd-meta">Proposal / {proposalDate}</p>}
      />

      <div className="mt-14 flex items-start justify-between border-t border-[rgba(14,20,32,.5)] pt-5">
        <div className="pd-meta leading-[1.7]">
          <p className="font-medium text-[#0E1420]">Clinical supply forecasting</p>
          <p>Demand · Simulation · Distribution</p>
        </div>
        <div className="pd-meta text-right leading-[1.7]">
          <p className="font-medium text-[#0E1420]">Prepared for {proposal.client_company}</p>
          <p>Confidential</p>
        </div>
      </div>

      <div className="mt-16">
        <h1 className="pd-display text-[64px] font-bold uppercase leading-[0.9] tracking-[-0.045em] text-[#0E1420]">
          {proposal.client_company}
          <span className="block text-[rgba(14,20,32,.4)]">{proposal.project_title}</span>
        </h1>
        <div className="pd-meta mt-5 flex justify-between border-t border-[rgba(14,20,32,.16)] pt-3">
          <span>00·A Proposal / {proposal.client_company}</span>
          <span>OPFOR.AI</span>
        </div>
        {proposal.subtitle && (
          <p className="pd-tag mt-10 max-w-[38ch] text-[13px] leading-[1.6]">
            {proposal.subtitle}
          </p>
        )}
      </div>

      <div className="mt-auto grid grid-cols-4 gap-5">
        {meta.map((m) => (
          <div key={m.label} className="border-t border-[rgba(14,20,32,.5)] pt-3">
            <p className="pd-meta">{m.label}</p>
            <p className="mt-1.5 pd-display text-[17px] font-semibold tracking-[-0.01em] text-[#0E1420]">
              {m.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
