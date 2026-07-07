import Image from "next/image";
import { formatMoney, subtotalCents, type Proposal } from "@/lib/proposal/types";

const STATUS_LABEL: Record<Proposal["status"], string> = {
  draft: "Draft",
  ready: "Ready to send",
  sent: "Sent",
};

export function CoverSection({ proposal }: { proposal: Proposal }) {
  const timelineSpan =
    proposal.timeline.length > 0
      ? proposal.timeline[0].duration &&
        proposal.timeline[proposal.timeline.length - 1].duration &&
        proposal.timeline[0].duration !== proposal.timeline[proposal.timeline.length - 1].duration
        ? `${proposal.timeline[0].duration} – ${proposal.timeline[proposal.timeline.length - 1].duration}`
        : proposal.timeline[0].duration
      : undefined;

  const meta = [
    { label: "Prepared for", value: proposal.client_company },
    { label: "Investment", value: formatMoney(subtotalCents(proposal.cost_items), proposal.currency) },
    { label: "Timeline", value: timelineSpan ?? `${proposal.timeline.length} phases` },
    { label: "Status", value: STATUS_LABEL[proposal.status] },
  ];

  return (
    <section className="flex min-h-[11in] flex-col p-20">
      {/* Logo is a glow-on-dark wordmark; a dark chip gives it the contrast it's designed for. */}
      <div className="inline-flex w-fit items-center rounded-md bg-[#0a0a0a] px-4 py-2.5">
        <Image
          src="/brand/logo/OPFOR_LOGO_NEW_2026.png"
          alt="OPFOR"
          width={1536}
          height={1024}
          className="h-6 w-auto"
        />
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <h1 className="font-serif text-6xl font-medium leading-[1.05] text-[#1a1a1a]">
          {proposal.client_company}
        </h1>
        <div className="mt-6 h-px w-24 bg-[#d5d5d5]" />
        <p className="mt-6 max-w-xl text-lg text-[#4a4a4a]">{proposal.project_title}</p>
        {proposal.subtitle && (
          <p className="mt-2 max-w-xl text-base text-[#8a8a8a]">{proposal.subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-4 gap-6 border-t border-[#e5e5e5] pt-6">
        {meta.map((m) => (
          <div key={m.label}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9a9a9a]">
              {m.label}
            </p>
            <p className="mt-1 text-sm font-medium text-[#1a1a1a]">{m.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
