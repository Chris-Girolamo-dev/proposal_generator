import type { AgreementClause } from "@/lib/proposal/types";
import { PageHeader } from "./PageHeader";
import { SectionHeading } from "./SectionHeading";
import { CornerGlobe } from "./CoverGlobe";

// Generic services-agreement boilerplate, not legal advice — the client's own legal/procurement
// reviews and finalizes this off-platform (see PLAN decision: no in-app signing). Name/date lines
// are blank for signing outside this app. Set on the same paper ground as the rest of the
// document: mono clause indices, hairline rules, ruled signature lines.
export function ServicesAgreementSection({
  clauses,
  clientCompany,
  clientLogoUrl,
  providerName = "OPFOR",
}: {
  clauses: AgreementClause[];
  clientCompany: string;
  clientLogoUrl: string | null;
  providerName?: string;
}) {
  const effectiveDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    // pd-agreement: in dark variants these pages reset to paper (see globals.css) —
    // clients e-sign here, and signatures need a light ground.
    <section className="pd-agreement isolate relative flex min-h-[11in] flex-col p-16">
      <CornerGlobe />
      <PageHeader clientCompany={clientCompany} clientLogoUrl={clientLogoUrl} />
      <SectionHeading
        number="09"
        title="Services agreement"
        say={<>Executed off-platform<br />by client legal.</>}
      />

      <div className="mt-8 max-w-[68ch]">
        <p className="text-[12px] leading-[1.6] text-[var(--pd-tag)]">
          This Agreement is entered into as of {effectiveDate} (the &ldquo;Effective Date&rdquo;)
          by and between{" "}
          <span className="font-medium text-[var(--pd-ink)]">{providerName}</span> (&ldquo;Provider&rdquo;)
          and <span className="font-medium text-[var(--pd-ink)]">{clientCompany}</span>{" "}
          (&ldquo;Client&rdquo;), together the &ldquo;Parties.&rdquo;
        </p>

        <div className="mt-8 space-y-4">
          {clauses.map((clause) => (
            <div key={clause.number} className="no-break grid grid-cols-12 gap-4">
              <span className="pd-meta col-span-1 pt-0.5">{clause.number}</span>
              <div className="col-span-11">
                {clause.bullets ? (
                  <>
                    <p className="text-[12px] font-semibold text-[var(--pd-ink)]">{clause.title}</p>
                    <ul className="mt-1.5 space-y-1 text-[12px] leading-[1.55] text-[var(--pd-tag)]">
                      {clause.body.map((b, i) => (
                        <li key={i} className="flex gap-2.5">
                          <span className="mt-[7px] h-px w-3 shrink-0 bg-[var(--pd-line-strong)]" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  clause.body.map((p, i) => (
                    <p
                      key={i}
                      className={`text-[12px] leading-[1.55] text-[var(--pd-tag)] ${i > 0 ? "mt-1.5" : ""}`}
                    >
                      {i === 0 && (
                        <span className="font-semibold text-[var(--pd-ink)]">{clause.title}: </span>
                      )}
                      {p}
                    </p>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="no-break mt-12">
        <p className="border-t border-[var(--pd-line-strong)] pt-5 text-[12px] text-[var(--pd-tag)]">
          IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.
        </p>

        <div className="mt-8 grid max-w-2xl grid-cols-2 gap-12">
          {[
            { party: "Client", company: clientCompany },
            { party: "Service provider", company: providerName },
          ].map((sig) => (
            <div key={sig.party}>
              <p className="pd-meta">{sig.party}</p>
              <p className="mt-2 pd-display text-[14px] font-semibold text-[var(--pd-ink)]">
                {sig.company}
              </p>
              <div className="mt-10 border-t border-[var(--pd-line-strong)] pt-1.5">
                <p className="pd-meta">Name / Signature</p>
              </div>
              <div className="mt-8 border-t border-[var(--pd-line-strong)] pt-1.5">
                <p className="pd-meta">Date</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pd-meta mt-12 flex justify-between border-t border-[var(--pd-line)] pt-4">
        <span>OPFOR.AI · CLINICAL SUPPLY FORECASTING</span>
        <span>09 / 09</span>
      </div>
    </section>
  );
}
