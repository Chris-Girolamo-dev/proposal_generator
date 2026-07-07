import type { TeamMember } from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";

export function TeamSection({ members }: { members: TeamMember[] }) {
  return (
    <section className="min-h-[11in] p-20">
      <SectionHeading number="05" eyebrow="THE TEAM" boldText="The team" accentText="on the work." />

      <div className="mt-16 max-w-3xl">
        {members.map((m, i) => (
          <div
            key={i}
            className={`grid grid-cols-[1fr_1fr] gap-6 py-6 ${i > 0 ? "border-t border-[#e5e5e5]" : ""}`}
          >
            <div>
              <p className="font-medium text-[#1a1a1a]">{m.role}</p>
              <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wider text-[#8a8a8a]">
                {m.badge}
              </span>
            </div>
            <p className="text-sm text-[#4a4a4a]">{m.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 h-1.5 w-full bg-red" />
    </section>
  );
}
