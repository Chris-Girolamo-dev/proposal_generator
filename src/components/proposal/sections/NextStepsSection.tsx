import { SectionHeading } from "./SectionHeading";
import { PageShell } from "./PageShell";

// Next steps + guarantee — numbered faint-numeral steps, the guarantee framed as a
// ruled instrument block with a red top bar, and the site's oversized CTA line
// closing the page.
export function NextStepsSection({
  steps,
  guarantee,
  number = "08",
  total,
  clientCompany,
  clientLogoUrl,
}: {
  steps: { step: string }[];
  guarantee: string;
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
        title="Next steps"
        say={<>Three moves.<br />Then we build.</>}
      />

      <div className="mt-12 grid grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <div key={i} className="no-break pd-shead pd-shead--sm pt-4">
            <span className="pd-display text-[44px] font-bold leading-none tracking-[-0.04em] text-[var(--pd-faint)]">
              {i + 1}
            </span>
            <p className="mt-3 max-w-[30ch] text-[13px] leading-[1.6] text-[var(--pd-ink)]">{s.step}</p>
          </div>
        ))}
      </div>

      {guarantee && (
        <div className="no-break pd-shead mt-14 max-w-2xl pt-5">
          <p className="pd-meta">The guarantee</p>
          <p className="mt-3 max-w-[54ch] pd-display text-[19px] font-medium leading-[1.4] tracking-[-0.01em] text-[var(--pd-ink)]">
            {guarantee}
          </p>
        </div>
      )}

      <div className="mt-16">
        <p className="pd-meta">Ready when you are</p>
        <p className="mt-3 pd-display text-[40px] font-bold uppercase leading-[0.9] tracking-[-0.045em] text-[var(--pd-ink)]">
          See it run<span className="text-[#E5192B]">.</span><span className="text-[var(--pd-mid)]">Supply the world</span>
        </p>
        <p className="pd-meta mt-4">info@opforsupply.com · opfor.ai</p>
      </div>
    </PageShell>
  );
}
