import type { WhyUs } from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";
import { PageShell } from "./PageShell";

// Why us — bigstats up top (the site's .bstat), the blurb, a 2-col numbered reason
// grid, then capabilities as a static print version of the site's marquee: a
// bordered mono strip.
export function WhyUsSection({
  whyUs,
  total,
  clientCompany,
  clientLogoUrl,
}: {
  whyUs: WhyUs;
  total?: string;
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  return (
    <PageShell number="06" total={total} clientCompany={clientCompany} clientLogoUrl={clientLogoUrl}>
      <SectionHeading
        number="06"
        total={total}
        title="Why OPFOR"
        say={<>Modeling depth.<br />Your process.</>}
      />

      <div className="mt-6 grid grid-cols-3 gap-5">
        {whyUs.stats.map((stat, i) => (
          <div key={i} className="no-break border-t border-[var(--pd-line-strong)] pt-2">
            <p className="pd-display text-[26px] font-bold leading-none tracking-[-0.03em] text-[var(--pd-ink)]">
              {stat.value}
            </p>
            <p className="pd-meta mt-1 normal-case tracking-[.04em]">{stat.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[12.5px] leading-[1.6] text-[var(--pd-tag)]">
        {whyUs.blurb}
      </p>

      {whyUs.points && whyUs.points.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-x-8">
          {whyUs.points.map((point, i) => (
            <div key={i} className="no-break border-t border-[var(--pd-line)] py-2.5">
              <div className="flex items-baseline gap-3">
                <span className="pd-meta w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <p className="pd-display text-[14px] font-semibold text-[var(--pd-ink)]">
                  {point.title}
                </p>
              </div>
              <p className="mt-0.5 pl-9 text-[11.5px] leading-[1.5] text-[var(--pd-dim)]">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Balanced gaps: the space above the marquee equals the space below it
          (bottom = spacer + the footer's mt-8, so the top spacer starts at basis-8). */}
      <div className="flex-1 basis-7" />
      {whyUs.capabilities && whyUs.capabilities.length > 0 && (
        <div className="border-y border-[var(--pd-line-strong)]">
          <div className="flex flex-wrap">
            {whyUs.capabilities.map((c, i) => (
              <span
                key={i}
                className="pd-meta border-r border-[var(--pd-line)] px-1.5 py-1 text-[10px] tracking-[.05em] last:border-r-0"
              >
                {c.split("*").map((part, j) =>
                  j % 2 === 1 ? (
                    <b key={j} className="font-medium text-[#E5192B]">{part}</b>
                  ) : (
                    part
                  )
                )}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Bottom spacer: grows equally with the top one (whose basis-8 offsets the
          folio margin), splitting the leftover space evenly around the marquee. */}
      <div className="flex-1 basis-0" />
    </PageShell>
  );
}
