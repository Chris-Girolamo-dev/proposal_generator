import type { WhyUs } from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";
import { PageShell } from "./PageShell";

// Why us — bigstats up top (the site's .bstat), the blurb, a 2-col numbered reason
// grid, then capabilities as a static print version of the site's marquee: a
// bordered mono strip.
export function WhyUsSection({
  whyUs,
  clientCompany,
  clientLogoUrl,
}: {
  whyUs: WhyUs;
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  return (
    <PageShell number="06" clientCompany={clientCompany} clientLogoUrl={clientLogoUrl}>
      <SectionHeading
        number="06"
        title="Why OPFOR"
        say={<>Modeling depth,<br />operational SOPs.</>}
      />

      <div className="mt-7 grid grid-cols-3 gap-5">
        {whyUs.stats.map((stat, i) => (
          <div key={i} className="no-break border-t border-[rgba(14,20,32,.5)] pt-2.5">
            <p className="pd-display text-[26px] font-bold leading-none tracking-[-0.03em] text-[#0E1420]">
              {stat.value}
            </p>
            <p className="pd-meta mt-1.5 normal-case tracking-[.04em]">{stat.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-7 max-w-[58ch] text-[12.5px] leading-[1.6] text-[rgba(14,20,32,.72)]">
        {whyUs.blurb}
      </p>

      {whyUs.points && whyUs.points.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-x-8">
          {whyUs.points.map((point, i) => (
            <div key={i} className="no-break border-t border-[rgba(14,20,32,.16)] py-2.5">
              <span className="pd-meta">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-1 pd-display text-[14px] font-semibold text-[#0E1420]">
                {point.title}
              </p>
              <p className="mt-0.5 text-[11.5px] leading-[1.5] text-[rgba(14,20,32,.56)]">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {whyUs.capabilities && whyUs.capabilities.length > 0 && (
        <div className="mt-5 border-y border-[rgba(14,20,32,.5)]">
          <div className="flex flex-wrap">
            {whyUs.capabilities.map((c, i) => (
              <span
                key={i}
                className="pd-meta border-r border-[rgba(14,20,32,.16)] px-3.5 py-1.5 last:border-r-0"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
