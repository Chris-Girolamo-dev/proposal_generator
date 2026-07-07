import type { TimelinePhase } from "@/lib/proposal/types";

export function TimelineSection({ phases }: { phases: TimelinePhase[] }) {
  return (
    <section className="section-tint min-h-[11in] p-20">
      <p className="eyebrow mb-3">OPFOR</p>
      <h2 className="font-serif text-4xl">How we get there.</h2>
      <p className="mt-6 max-w-2xl border-t border-[#e5e5e5] pt-6 text-[#5a5a5a]">
        A phased build, so you see progress every step of the way.
      </p>

      <div className="mt-16 space-y-10">
        {phases.map((phase) => (
          <div key={phase.phase} className="grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-6">
            <span className="font-serif text-4xl text-[#e8b7ba]">{phase.phase}</span>
            <div>
              <p className="font-medium text-[#2a2a2a]">{phase.label}</p>
              <p className="mt-1 text-sm text-[#7a7a7a]">{phase.detail}</p>
            </div>
            {phase.duration && (
              <span className="text-sm text-[#7a7a7a]">{phase.duration}</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 h-1.5 w-full bg-red" />
    </section>
  );
}
