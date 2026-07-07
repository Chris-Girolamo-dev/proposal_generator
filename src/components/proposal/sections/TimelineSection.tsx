import type { TimelinePhase } from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";

export function TimelineSection({ phases }: { phases: TimelinePhase[] }) {
  return (
    <section className="section-tint min-h-[11in] p-20">
      <SectionHeading number="04" eyebrow="THE PLAN" boldText="How we" accentText="get there." />
      <p className="mt-6 max-w-2xl border-t border-[#e5e5e5] pt-6 text-[#5a5a5a]">
        A phased build, so you see progress every step of the way.
      </p>

      <div className="mt-16 overflow-hidden rounded-lg border border-[#e5e5e5]">
        <div className="grid grid-cols-[7rem_1fr_1fr] bg-[#12141c] px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-white">
          <span>Step</span>
          <span>What happens</span>
          <span>Why it matters</span>
        </div>

        {phases.map((phase) => (
          <div
            key={phase.phase}
            className="grid grid-cols-[7rem_1fr_1fr] gap-6 border-t border-[#e5e5e5] bg-white px-6 py-6"
          >
            <div>
              <p className="font-serif text-2xl text-[#1a1a1a]">{phase.phase}</p>
              <p className="mt-1 text-xs text-[#8a8a8a]">
                {phase.label}
                {phase.duration && ` · ${phase.duration}`}
              </p>
            </div>
            <p className="text-sm text-[#4a4a4a]">{phase.detail}</p>
            <p className="text-sm text-[#4a4a4a]">{phase.whyItMatters ?? ""}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 h-1.5 w-full bg-red" />
    </section>
  );
}
