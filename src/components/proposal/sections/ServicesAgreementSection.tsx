import type { AgreementClause } from "@/lib/proposal/types";
import { paginateAgreement } from "@/lib/proposal/paginate-agreement";
import { PageShell } from "./PageShell";
import { SectionHeading } from "./SectionHeading";

// Generic services-agreement boilerplate, not legal advice — the client's own legal/procurement
// reviews and finalizes this off-platform (see PLAN decision: no in-app signing). Name/date lines
// are blank for signing outside this app. Set on the same paper ground as the rest of the
// document: mono clause indices, hairline rules, ruled signature lines.
//
// Paginated explicitly rather than left as one tall section: every sheet renders as its own
// PageShell, so the repeated header and the folio appear on the continuation sheets too.
// They previously arrived bare, which read as pages that had fallen out of the document.
function ClauseBlock({ clause }: { clause: AgreementClause }) {
  return (
    <div className="no-break grid grid-cols-12 gap-4">
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
  );
}

function SignatureBlock({
  clientCompany,
  providerName,
}: {
  clientCompany: string;
  providerName: string;
}) {
  return (
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
  );
}

export function ServicesAgreementSection({
  clauses,
  number = "09",
  total = "09",
  clientCompany,
  clientLogoUrl,
  providerName = "OPFOR",
}: {
  clauses: AgreementClause[];
  number?: string;
  total?: string;
  clientCompany: string;
  clientLogoUrl: string | null;
  providerName?: string;
}) {
  const effectiveDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pages = paginateAgreement(clauses);

  return (
    <>
      {pages.map((page, i) => (
        <PageShell
          key={i}
          number={number}
          total={total}
          // Only the first sheet carries the anchor the contents page links to.
          anchor={i === 0 ? undefined : null}
          // pd-agreement: in dark variants these pages reset to paper (see globals.css) —
          // clients e-sign here, and signatures need a light ground.
          className="pd-agreement"
          clientCompany={clientCompany}
          clientLogoUrl={clientLogoUrl}
        >
          <SectionHeading
            title={i === 0 ? "Services agreement" : "Services agreement (continued)"}
          />

          <div className="mt-8">
            {i === 0 && (
              <p className="text-[12px] leading-[1.6] text-[var(--pd-tag)]">
                This Agreement is entered into as of {effectiveDate} (the
                &ldquo;Effective Date&rdquo;) by and between{" "}
                <span className="font-medium text-[var(--pd-ink)]">{providerName}</span>{" "}
                (&ldquo;Provider&rdquo;) and{" "}
                <span className="font-medium text-[var(--pd-ink)]">{clientCompany}</span>{" "}
                (&ldquo;Client&rdquo;), together the &ldquo;Parties.&rdquo;
              </p>
            )}

            {page.clauses.length > 0 && (
              <div className={`space-y-4 ${i === 0 ? "mt-8" : ""}`}>
                {page.clauses.map((clause) => (
                  <ClauseBlock key={clause.number} clause={clause} />
                ))}
              </div>
            )}
          </div>

          {page.signature && (
            <SignatureBlock clientCompany={clientCompany} providerName={providerName} />
          )}
        </PageShell>
      ))}
    </>
  );
}
