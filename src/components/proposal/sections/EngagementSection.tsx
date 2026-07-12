import { numberWord, weeksLabelFromPhases, type TeamMember, type TimelinePhase } from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";
import { PageShell } from "./PageShell";

// The engagement — narrative statement plus heroside-style ruled rows for who is
// on the work. "Partnered with your team" deliberately, not "embedded" (we are
// not on-site).
export function EngagementSection({
  members,
  phases,
  total,
  clientCompany,
  clientLogoUrl,
}: {
  members: TeamMember[];
  phases: TimelinePhase[];
  total?: string;
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  const weeksLabel = weeksLabelFromPhases(phases).toLowerCase();
  const operatorsLabel = `${numberWord(members.length)} operator${members.length === 1 ? "" : "s"}`;

  return (
    <PageShell number="05" total={total} clientCompany={clientCompany} clientLogoUrl={clientLogoUrl}>
      <SectionHeading
        number="05"
        total={total}
        title="The engagement"
        say={<>Senior team.<br />Narrow focus.</>}
      />

      <h3 className="mt-12 max-w-[24ch] pd-display text-[30px] font-semibold leading-[1.12] tracking-[-0.02em] text-[var(--pd-ink)]">
        {operatorsLabel.charAt(0).toUpperCase() + operatorsLabel.slice(1)}, partnered with your
        team, <span className="text-[var(--pd-mid)]">{weeksLabel}.</span>
      </h3>

      <p className="mt-6 text-[13.5px] leading-[1.65] text-[var(--pd-tag)]">
        {operatorsLabel} work directly with your team for {weeksLabel}: one leads the engagement
        end to end; the other builds the forecasting model and integrates it against your live
        data. We run this with you, not for you: one question, {weeksLabel}, and it is the only
        thing we work on.
      </p>

      {/* Rules run the full content width (matching the section head above); only
          the text inside stays at a readable measure. */}
      <div className="mt-12">
        {members.map((m, i) => (
          <div
            key={i}
            className="no-break grid grid-cols-12 gap-4 border-t border-[var(--pd-line)] py-4"
          >
            <span className="pd-meta col-span-2 pt-0.5">{m.badge}</span>
            <div className="col-span-10">
              <p className="pd-display text-[15px] font-semibold text-[var(--pd-ink)]">{m.role}</p>
              <p className="mt-1 text-[12.5px] leading-[1.6] text-[var(--pd-dim)]">
                {m.description}
              </p>
            </div>
          </div>
        ))}
        <div className="no-break grid grid-cols-12 gap-4 border-y border-[var(--pd-line)] py-4">
          <span className="pd-meta col-span-2 pt-0.5">Scope</span>
          <div className="col-span-10">
            <p className="pd-display text-[15px] font-semibold text-[var(--pd-ink)]">Fixed scope</p>
            <p className="mt-1 text-[12.5px] leading-[1.6] text-[var(--pd-dim)]">
              {phases.length} build phases over {weeksLabel}, described in full in the plan.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
