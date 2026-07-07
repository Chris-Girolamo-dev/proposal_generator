import type { WhyUs } from "@/lib/proposal/types";

export function WhyUsSection({ whyUs }: { whyUs: WhyUs }) {
  return (
    <section className="min-h-[11in] p-20">
      <p className="eyebrow mb-3">OPFOR</p>
      <h2 className="font-serif text-4xl">Why us.</h2>
      <p className="mt-6 max-w-2xl border-t border-[#e5e5e5] pt-6 text-[#5a5a5a]">
        {whyUs.blurb}
      </p>

      <div className="mt-12 grid grid-cols-3 gap-4">
        {whyUs.stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <p className="font-serif text-3xl text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-[#b5b5b5]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 h-1.5 w-full bg-red" />
    </section>
  );
}
