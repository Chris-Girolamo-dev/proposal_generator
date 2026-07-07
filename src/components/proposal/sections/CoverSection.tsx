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

  const proposalDate = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <section className="flex min-h-[11in] flex-col p-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo is a glow-on-dark wordmark; a dark chip gives it the contrast it's designed for. */}
          <div className="inline-flex w-fit items-center rounded-md bg-[#0a0a0a] px-3 py-2">
            <Image
              src="/brand/logo/OPFOR_LOGO_NEW_2026.png"
              alt="OPFOR"
              width={1536}
              height={1024}
              className="h-5 w-auto"
            />
          </div>
          <span className="text-[#c5c5c5]">×</span>
          <span className="font-heading text-sm font-semibold text-[#4a4a4a]">
            {proposal.client_company}
          </span>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9a9a9a]">
          Proposal / {proposalDate}
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <h1 className="font-heading text-5xl font-extrabold leading-[1.1] text-[#1a1a1a]">
          {proposal.client_company}:{" "}
          <em className="font-serif italic font-normal">{proposal.project_title}</em>
        </h1>
        {proposal.subtitle && (
          <p className="mt-6 max-w-xl text-lg text-[#5a5a5a]">{proposal.subtitle}</p>
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
