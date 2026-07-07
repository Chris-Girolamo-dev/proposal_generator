import type { TimelinePhase } from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";

export function TimelineSection({ phases }: { phases: TimelinePhase[] }) {
  return (
    <section className="section-tint min-h-[11in] p-20">
      <SectionHeading number="04" eyebrow="THE PLAN" boldText="How we" accentText="get there." />
      <p className="mt-6 max-w-2xl border-t border-[#e5e5e5] pt-6 text-[#5a5a5a]">
        A phased build, so you see progress every step of the way.
      </p>

      <div className="mt-16 divide-y divide-[#e5e5e5]">
        {phases.map((phase) => (
          <div key={phase.phase} className="grid grid-cols-[3.5rem_1fr] gap-6 py-8 first:pt-0">
            <span className="font-heading text-3xl font-extrabold text-[#1a1a1a]">{phase.phase}.</span>
            <div>
              <div className="flex items-baseline justify-between gap-6">
                <p className="font-heading text-lg font-bold text-[#1a1a1a]">
                  {phase.label}{" "}
                  {phase.tagline && (
                    <em className="font-serif italic font-normal">{phase.tagline}</em>
                  )}
                </p>
                {phase.duration && (
                  <span className="eyebrow shrink-0 whitespace-nowrap">{phase.duration}</span>
                )}
              </div>

              <p className="mt-3 max-w-2xl text-sm text-[#4a4a4a]">{phase.detail}</p>
              {phase.whyItMatters && (
                <p className="mt-2 max-w-2xl text-sm text-[#4a4a4a]">{phase.whyItMatters}</p>
              )}

              {phase.deliverables && phase.deliverables.length > 0 && (
                <p className="mt-4 text-xs text-[#8a8a8a]">
                  <span className="font-semibold uppercase tracking-wide text-[#1a1a1a]">
                    Deliverables{" "}
                  </span>
                  {phase.deliverables.join(" / ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 h-1.5 w-full bg-red" />
    </section>
  );
}
