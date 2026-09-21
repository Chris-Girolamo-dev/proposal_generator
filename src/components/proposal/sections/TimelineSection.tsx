import { weeksLabelFromPhases, type TimelinePhase } from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";
import { PageShell } from "./PageShell";

// The plan — the site's "Method" phases: each phase opens with a strong hairline,
// a short red bar, an oversized faint Space Grotesk numeral, then title, copy, and
// a mono deliverables readout. Stacked one per row (reviewer's call) rather than the
// old 2×2 grid: the weeks now read in sequence down the page.
export function TimelineSection({
  phases,
  total,
  clientCompany,
  clientLogoUrl,
}: {
  phases: TimelinePhase[];
  total?: string;
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  const weeksLabel = weeksLabelFromPhases(phases);

  return (
    <PageShell number="04" total={total} clientCompany={clientCompany} clientLogoUrl={clientLogoUrl}>
      <SectionHeading title={`${weeksLabel}, week by week`}
      />

      <div className="mt-5">
        {phases.map((phase, i) => (
          <div
            key={phase.phase}
            className={`no-break pd-shead pd-shead--sm grid grid-cols-12 gap-5 pt-3 ${
              i === 0 ? "" : "mt-5"
            }`}
          >
            <div className="col-span-1">
              <span className="pd-display text-[40px] font-bold leading-none tracking-[-0.04em] text-[var(--pd-faint)]">
                {Number(phase.phase)}
              </span>
            </div>
            <div className="col-span-11">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="pd-display text-[18px] font-semibold tracking-[-0.01em] text-[var(--pd-ink)]">
                  {phase.label.replace(/\.$/, "")}
                </h3>
                {phase.duration && <span className="pd-meta shrink-0">{phase.duration}</span>}
              </div>
              {phase.tagline && <p className="pd-meta mt-1">{phase.tagline.replace(/\.$/, "")}</p>}
              <p className="mt-1 text-[12px] leading-[1.5] text-[var(--pd-tag)]">{phase.detail}</p>
              {phase.whyItMatters && (
                <p className="mt-1 text-[12px] leading-[1.5] text-[var(--pd-dim)]">
                  {phase.whyItMatters}
                </p>
              )}
              {phase.deliverables && phase.deliverables.length > 0 && (
                <p className="pd-meta mt-1.5">{phase.deliverables.join(" · ")}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
