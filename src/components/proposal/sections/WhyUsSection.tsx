import type { WhyUs } from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";

export function WhyUsSection({ whyUs }: { whyUs: WhyUs }) {
  return (
    <section className="min-h-[11in] p-20">
      <SectionHeading number="06" eyebrow="WHY US" boldText="Why" accentText="us." />

      {whyUs.capabilities && whyUs.capabilities.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {whyUs.capabilities.map((c, i) => (
            <span
              key={i}
              className="rounded-full border border-[#e5e5e5] px-3 py-1 text-xs text-[#4a4a4a]"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      <p className="mt-8 max-w-2xl border-t border-[#e5e5e5] pt-6 text-[#5a5a5a]">
        {whyUs.blurb}
      </p>

      {whyUs.points && whyUs.points.length > 0 && (
        <div className="mt-12 grid grid-cols-2 gap-x-12">
          {whyUs.points.map((point, i) => (
            <div key={i} className="no-break border-t border-[#e5e5e5] py-6">
              <p className="text-[10px] font-semibold text-[#9a9a9a]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 font-heading font-bold text-[#1a1a1a]">{point.title}</p>
              <p className="mt-1 text-sm text-[#5a5a5a]">{point.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-3 gap-4">
        {whyUs.stats.map((stat, i) => (
          <div key={i} className="no-break stat-card">
            <p className="font-serif text-3xl text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-[#b5b5b5]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 h-1.5 w-full bg-red" />
    </section>
  );
}
