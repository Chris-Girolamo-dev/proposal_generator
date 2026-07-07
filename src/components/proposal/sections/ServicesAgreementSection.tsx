import type { AgreementClause } from "@/lib/proposal/types";

// Generic services-agreement boilerplate, not legal advice — the client's own legal/procurement
// reviews and finalizes this off-platform (see PLAN decision: no in-app signing). Name/date lines
// are blank for signing outside this app.
export function ServicesAgreementSection({
  clauses,
  clientCompany,
  providerName = "OPFOR",
}: {
  clauses: AgreementClause[];
  clientCompany: string;
  providerName?: string;
}) {
  const effectiveDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="min-h-[11in] bg-[#f2ede3] p-16">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-12 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <p className="eyebrow mb-3">OPFOR</p>
        <h2 className="font-serif text-3xl uppercase tracking-tight text-[#1a1a1a]">
          Services Agreement
        </h2>

        <p className="mt-6 text-sm text-[#4a4a4a]">
          This Agreement is entered into as of {effectiveDate} (the &ldquo;Effective Date&rdquo;) by
          and between:
        </p>
        <p className="mt-3 text-sm text-[#4a4a4a]">
          <span className="font-semibold text-[#1a1a1a]">Service Provider:</span> {providerName}{" "}
          (&ldquo;Provider&rdquo;), and
        </p>
        <p className="mt-1 text-sm text-[#4a4a4a]">
          <span className="font-semibold text-[#1a1a1a]">Client:</span> {clientCompany}{" "}
          (&ldquo;Client&rdquo;), together the &ldquo;Parties.&rdquo;
        </p>

        <div className="mt-10 space-y-6">
          {clauses.map((clause) => (
            <div key={clause.number}>
              {clause.bullets ? (
                <>
                  <p className="text-sm font-semibold text-[#1a1a1a]">
                    {clause.number} {clause.title}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#4a4a4a]">
                    {clause.body.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </>
              ) : (
                clause.body.map((p, i) => (
                  <p key={i} className={`text-sm text-[#4a4a4a] ${i > 0 ? "mt-2" : ""}`}>
                    {i === 0 && (
                      <span className="font-semibold text-[#1a1a1a]">
                        {clause.number} {clause.title}:{" "}
                      </span>
                    )}
                    {p}
                  </p>
                ))
              )}
            </div>
          ))}
        </div>

        <p className="mt-10 border-t border-[#e5e5e5] pt-6 text-sm text-[#4a4a4a]">
          IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#1a1a1a]">Client</p>
            <p className="mt-4 text-sm text-[#4a4a4a]">
              <span className="font-medium text-[#1a1a1a]">Company:</span> {clientCompany}
            </p>
            <p className="mt-2 text-sm text-[#4a4a4a]">
              <span className="font-medium text-[#1a1a1a]">Name:</span> ______________________
            </p>
            <p className="mt-2 text-sm text-[#4a4a4a]">
              <span className="font-medium text-[#1a1a1a]">Date:</span> ______________________
            </p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#1a1a1a]">
              Service Provider
            </p>
            <p className="mt-4 text-sm text-[#4a4a4a]">
              <span className="font-medium text-[#1a1a1a]">Company:</span> {providerName}
            </p>
            <p className="mt-2 text-sm text-[#4a4a4a]">
              <span className="font-medium text-[#1a1a1a]">Name:</span> ______________________
            </p>
            <p className="mt-2 text-sm text-[#4a4a4a]">
              <span className="font-medium text-[#1a1a1a]">Date:</span> ______________________
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
