import { SectionHeading } from "./SectionHeading";
import { PageShell } from "./PageShell";

// Data boundaries — the moat-analysis page (docs/OPFOR_Marketing_Soundbites_and
// _Moat_Analysis.md.docx, S4-S8 + S6). Matter-of-fact by design: these are
// architectural facts, not marketing claims, and the tone stays declarative.
// Copy is OPFOR-level boilerplate (like the agreement's clause structure), so it
// lives here rather than in per-proposal data. Status-gate note: every claim on
// this page is tagged USABLE NOW in the analysis; the GxP block uses the exact
// safe phrasing ("out of GxP scope by design", never "GxP compliant").
const CLAIMS = [
  {
    title: "No access to your systems",
    body: "No OPFOR account, credential, or permission exists in your IRT or any validated system. Your team exports the reports it already receives and uploads them. That is the entire data path.",
  },
  {
    title: "Your protocol never enters the product",
    body: "There is no document upload. Setup consumes planning parameters only: countries, visit schedule, kit types. Scenario drafting happens with you, outside the product.",
  },
  {
    title: "Counts, not people",
    body: "The subject report is reduced to per-site, per-month counts in your browser before anything is transmitted. No individual subject record is stored; the stored structure cannot describe a person.",
  },
  {
    title: "No treatment-arm data, in any mode",
    body: "The parser never reads arm, stratum, or randomization columns. The forecast runs on kit-type demand, so blinding stays intact by construction, not by policy.",
  },
];

function FlowBox({ label, sub, seal }: { label: string; sub: string; seal?: string }) {
  return (
    <div className="relative flex-1 border border-[var(--pd-line-strong)] px-4 py-3">
      <p className="pd-meta font-medium text-[var(--pd-ink)]">{label}</p>
      <p className="pd-meta mt-0.5 text-[9.5px]">{sub}</p>
      {seal && (
        <span className="pd-meta absolute right-2 top-[-9px] border border-[#E5192B] bg-[var(--pd-paper)] px-1.5 text-[8.5px] text-[#E5192B]">
          {seal}
        </span>
      )}
    </div>
  );
}

export function DataBoundariesSection({
  number = "07",
  total,
  clientCompany,
  clientLogoUrl,
}: {
  number?: string;
  total?: string;
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  return (
    <PageShell number={number} total={total} clientCompany={clientCompany} clientLogoUrl={clientLogoUrl}>
      <SectionHeading
        number={number}
        total={total}
        title="Data boundaries"
        say={<>What we hold.<br />What we never touch.</>}
      />
      <p className="mt-6 max-w-[56ch] text-[13.5px] leading-[1.65] text-[var(--pd-tag)]">
        OPFOR is planning and decision support. The boundary below is architectural — the product
        is built so these facts cannot drift.
      </p>

      {/* One-way data flow: the IRT is sealed; the only path is the client's own
          manual upload of reports they already receive. */}
      <div className="mt-7">
        <p className="pd-meta">The entire data path</p>
        <div className="mt-3 flex items-stretch gap-0">
          <FlowBox label={`Your IRT / RTSM`} sub="Validated system" seal="No OPFOR access" />
          <div className="flex flex-col items-center justify-center px-3">
            <span className="pd-meta text-[9.5px]">reports you</span>
            <span className="text-[var(--pd-line-strong)]">⟶</span>
            <span className="pd-meta text-[9.5px]">already receive</span>
          </div>
          <FlowBox label="Your team" sub="Exports, reviews" />
          <div className="flex flex-col items-center justify-center px-3">
            <span className="pd-meta text-[9.5px]">manual upload</span>
            <span className="text-[var(--pd-line-strong)]">⟶</span>
            <span className="pd-meta text-[9.5px]">minutes per cycle</span>
          </div>
          <FlowBox label="OPFOR" sub="Engine runs in your browser" />
        </div>
        <p className="pd-meta mt-2 text-[9.5px]">
          One direction, initiated by you. No integration to install, no credentials to grant, no
          access for your security team to review.
        </p>
      </div>

      <div className="mt-6">
        {CLAIMS.map((c, i) => (
          <div
            key={i}
            className={`no-break grid grid-cols-12 gap-4 border-t border-[var(--pd-line)] py-2 ${
              i === CLAIMS.length - 1 ? "border-b" : ""
            }`}
          >
            <span className="pd-meta col-span-1 pt-0.5">{String(i + 1).padStart(2, "0")}</span>
            <p className="col-span-4 pd-display text-[15px] font-semibold leading-[1.25] text-[var(--pd-ink)]">
              {c.title}
            </p>
            <p className="col-span-7 text-[12px] leading-[1.55] text-[var(--pd-tag)]">{c.body}</p>
          </div>
        ))}
      </div>

      <div className="no-break pd-shead pd-shead--sm mt-6 pt-3">
        <p className="pd-display text-[15px] font-semibold text-[var(--pd-ink)]">
          Out of GxP scope by design
        </p>
        <p className="mt-1.5 max-w-[62ch] text-[12px] leading-[1.55] text-[var(--pd-tag)]">
          OPFOR is never a system of record and performs no GxP activity. It ingests only
          decision-support exports your team already receives — no source documents. Adoption does
          not wait on a computerized-system validation project.
        </p>
      </div>
    </PageShell>
  );
}
