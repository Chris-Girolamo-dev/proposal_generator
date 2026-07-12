import type { Proposal } from "@/lib/proposal/types";
import { PageHeader } from "./PageHeader";
import { CoverGlobe } from "./CoverGlobe";

// The site's hero, set for print: mono meta blocks top-left/right, an oversized
// uppercase Space Grotesk headline with a dim second line, an OCR-A tagline, and
// a bstat-style meta strip pinned to the bottom edge. Deliberately no investment
// or timeline here — the cost reveal is saved for the Investment page.
export function CoverSection({ proposal }: { proposal: Proposal }) {
  const proposalDate = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  // Cover stamp: [928801 V1.0 MM DD YYYY], numbered by a DB sequence so it never repeats.
  const issued = proposal.created_at ? new Date(proposal.created_at) : new Date();
  const stamp = `[${proposal.proposal_number ?? 928801} ${proposal.proposal_version ?? "V1.0"} ${String(issued.getMonth() + 1).padStart(2, "0")} ${String(issued.getDate()).padStart(2, "0")} ${issued.getFullYear()}]`;

  const meta = [
    { label: "Prepared for", value: proposal.client_company },
    { label: "Issued", value: proposalDate },
  ];

  return (
    // isolate: the globe sits at z-[-1] behind the cover's text but above the
    // document's paper ground, without leaking under other pages.
    <section className="isolate relative flex min-h-[11in] flex-col p-16">
      <CoverGlobe />
      <PageHeader
        clientCompany={proposal.client_company}
        clientLogoUrl={proposal.client_logo_url}
        noBorder
        trailing={<p className="pd-meta">Proposal / {proposalDate}</p>}
      />

      {/* mt-2 (was mt-14): the rule sits ~1/2in higher, tight under the brand row,
          so the globe's linework never runs into it. */}
      <div className="mt-2 flex items-start justify-between border-t border-[var(--pd-line-strong)] pt-5">
        <div className="pd-meta leading-[1.7]">
          <p className="font-medium text-[var(--pd-ink)]">Clinical supply forecasting</p>
          <p>Demand · Simulation · Distribution</p>
        </div>
        <div className="pd-meta text-right leading-[1.7]">
          <p className="font-medium text-[var(--pd-ink)]">Prepared for {proposal.client_company}</p>
          <p>Confidential</p>
        </div>
      </div>

      <div className="mt-16">
        <h1 className="pd-display text-[64px] font-bold uppercase leading-[0.9] tracking-[-0.045em] text-[var(--pd-ink)]">
          {proposal.client_company}
          <span className="block text-[var(--pd-mid)]">{proposal.project_title}</span>
        </h1>
        <div className="pd-meta mt-5 flex justify-between border-t border-[var(--pd-line)] pt-3">
          <span>{stamp} Proposal / {proposal.client_company}</span>
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
          <div key={m.label} className="border-t border-[var(--pd-line-strong)] pt-3">
            <p className="pd-meta">{m.label}</p>
            <p className="mt-1.5 pd-display text-[17px] font-semibold tracking-[-0.01em] text-[var(--pd-ink)]">
              {m.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
