import { numberWord, weeksLabelFromPhases, type TeamMember, type TimelinePhase } from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";

export function EngagementSection({
  members,
  phases,
}: {
  members: TeamMember[];
  phases: TimelinePhase[];
}) {
  const weeksLabel = weeksLabelFromPhases(phases).toLowerCase();
  const operatorsLabel = `${numberWord(members.length)} operator${members.length === 1 ? "" : "s"}`;

  return (
    <section className="min-h-[11in] p-20">
      <SectionHeading
        number="05"
        eyebrow="THE ENGAGEMENT"
        boldText={`${operatorsLabel},`}
        accentText={`partnered with your team, ${weeksLabel}.`}
      />

      <p className="eyebrow mt-10 mb-2">THE CORE ENGAGEMENT</p>
      <h3 className="font-heading text-2xl font-bold text-[#1a1a1a]">
        Audit, model, <em className="font-serif italic font-normal">and a working dashboard.</em>
      </h3>

      <p className="mt-4 max-w-2xl text-[#5a5a5a]">
        {operatorsLabel} work directly with your team for {weeksLabel} — one leads the engagement
        end to end, the other builds the forecasting model and integrates it against your live
        data. We run this with you, not for you: one question, {weeksLabel}, and it is the only
        thing we work on.
      </p>

      <ul className="mt-10 max-w-2xl space-y-4">
        {members.map((m, i) => (
          <li key={i} className="no-break flex gap-4 text-[#2a2a2a]">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red" />
            <span className="text-sm">
              <span className="font-semibold text-[#1a1a1a]">{m.role}</span> — {m.description}
            </span>
          </li>
        ))}
        <li className="no-break flex gap-4 text-[#2a2a2a]">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red" />
          <span className="text-sm">
            <span className="font-semibold text-[#1a1a1a]">Fixed scope</span> — {phases.length}{" "}
            build phases over {weeksLabel}, described in full above.
          </span>
        </li>
      </ul>

      <div className="mt-16 h-1.5 w-full bg-red" />
    </section>
  );
}
