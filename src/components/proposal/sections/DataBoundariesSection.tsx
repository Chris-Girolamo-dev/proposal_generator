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
    title: "Zero access to your systems",
    body: "Zero OPFOR accounts, credentials, or permissions exist in your IRT or any validated system. Your team exports the reports it already receives and uploads them. That is the entire data path.",
  },
  {
    title: "Your protocol never enters the product",
    body: "There is no document upload. Setup consumes planning parameters only: countries, visit schedule, kit types. Drafting happens with you, outside the product. Blinded data is firewalled the same way: reduced in your browser, on your machine, and never transmitted to us or stored.",
  },
  {
    title: "Counts, not people",
    body: "The subject report is reduced to per-site, per-month counts in your browser. Only the counts leave your machine. No individual subject record is stored.",
  },
  {
    title: "No treatment-arm data, in any mode",
    body: "The parser never reads arm, stratum, or randomization columns. The forecast runs on kit-type demand, so blinding stays intact by construction, not by policy.",
  },
];

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
      <p className="mt-8 text-[13.5px] leading-[1.65] text-[var(--pd-tag)]">
        OPFOR is planning and decision support. The boundary below is architectural, not policy.
      </p>

      <div className="mt-10">
        {CLAIMS.map((c, i) => (
          <div
            key={i}
            className={`no-break grid grid-cols-12 gap-4 border-t border-[var(--pd-line)] py-4 ${
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

      <div className="no-break pd-shead pd-shead--sm mt-10 pt-4">
        <p className="pd-display text-[15px] font-semibold text-[var(--pd-ink)]">
          Out of GxP scope by design
        </p>
        <p className="mt-1.5 text-[12px] leading-[1.55] text-[var(--pd-tag)]">
          OPFOR is never a system of record and performs no GxP activity. It ingests only
          decision-support exports your team already receives. No source documents. Adoption does
          not wait on a computerized-system validation project.
        </p>
      </div>
    </PageShell>
  );
}
