import { weeksLabelFromPhases, type TimelinePhase } from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";
import { PageShell } from "./PageShell";

// The plan — the site's "Method" phases: each phase opens with a strong hairline,
// a short red bar, an oversized faint Space Grotesk numeral, then title, copy, and
// a mono deliverables readout. 2×2 grid so four weeks land on one page.
export function TimelineSection({
  phases,
  clientCompany,
  clientLogoUrl,
}: {
  phases: TimelinePhase[];
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  const weeksLabel = weeksLabelFromPhases(phases);

  return (
    <PageShell number="04" clientCompany={clientCompany} clientLogoUrl={clientLogoUrl}>
      <SectionHeading
        number="04"
        title={`${weeksLabel}, week by week`}
        say={<>A phased build.<br />The timetable holds.</>}
      />

      <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7">
        {phases.map((phase) => (
          <div key={phase.phase} className="no-break pd-shead pd-shead--sm pt-3">
            <div className="flex items-start justify-between">
              <span className="pd-display text-[44px] font-bold leading-none tracking-[-0.04em] text-[rgba(14,20,32,.12)]">
                {Number(phase.phase)}
              </span>
              {phase.duration && <span className="pd-meta pt-1">{phase.duration}</span>}
            </div>
            <h3 className="mt-2 pd-display text-[18px] font-semibold tracking-[-0.01em] text-[#0E1420]">
              {phase.label.replace(/\.$/, "")}
            </h3>
            {phase.tagline && <p className="pd-meta mt-1">{phase.tagline.replace(/\.$/, "")}</p>}
            <p className="mt-2.5 max-w-[46ch] text-[12px] leading-[1.55] text-[rgba(14,20,32,.72)]">
              {phase.detail}
            </p>
            {phase.whyItMatters && (
              <p className="mt-1.5 max-w-[46ch] text-[12px] leading-[1.55] text-[rgba(14,20,32,.56)]">
                {phase.whyItMatters}
              </p>
            )}
            {phase.deliverables && phase.deliverables.length > 0 && (
              <p className="pd-meta mt-3">{phase.deliverables.join(" · ")}</p>
            )}
          </div>
        ))}
      </div>
    </PageShell>
  );
}
