import Image from "next/image";
import type { Proposal } from "@/lib/proposal/types";

export function CoverSection({ proposal }: { proposal: Proposal }) {
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

      <div className="hero-mesh mt-10 min-h-[4.4in] flex-1" />

      <div className="mt-10">
        <h1 className="font-serif text-6xl font-medium leading-[1.05]">
          <mark className="bg-[#F5E14C] px-2 py-1">{proposal.client_company}</mark>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-[#4a4a4a]">{proposal.project_title}</p>
        {proposal.subtitle && (
          <p className="mt-2 max-w-xl text-base text-[#7a7a7a]">{proposal.subtitle}</p>
        )}
      </div>

      <div className="mt-10 h-1.5 w-full bg-red" />
    </section>
  );
}
