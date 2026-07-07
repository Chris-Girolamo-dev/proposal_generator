import type { WhyUs } from "@/lib/proposal/types";

export function WhyUsSection({ whyUs }: { whyUs: WhyUs }) {
  return (
    <section className="min-h-[11in] p-20">
      <h2 className="font-serif text-4xl">Why us.</h2>
      <p className="mt-6 max-w-2xl border-t border-[#e5e5e5] pt-6 text-[#5a5a5a]">
        {whyUs.blurb}
      </p>

      <div className="mt-16 grid grid-cols-3 gap-8">
        {whyUs.stats.map((stat, i) => (
          <div key={i} className="border-l-2 border-red pl-4">
            <p className="font-serif text-3xl">{stat.value}</p>
            <p className="mt-1 text-sm text-[#7a7a7a]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 h-1 w-full bg-red" />
    </section>
  );
}
