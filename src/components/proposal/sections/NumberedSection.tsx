import type { NumberedItem } from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";
import { PageHeader } from "./PageHeader";

export function NumberedSection({
  number,
  eyebrow,
  boldText,
  accentText,
  intro,
  items,
  tint = false,
  clientCompany,
  clientLogoUrl,
}: {
  number: string;
  eyebrow: string;
  boldText: string;
  accentText: string;
  intro: string;
  items: NumberedItem[];
  tint?: boolean;
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  return (
    <section className={`min-h-[11in] p-20 ${tint ? "section-tint" : ""}`}>
      <PageHeader clientCompany={clientCompany} clientLogoUrl={clientLogoUrl} />
      <SectionHeading number={number} eyebrow={eyebrow} boldText={boldText} accentText={accentText} />
      <p className="mt-6 max-w-2xl border-t border-[#e5e5e5] pt-6 text-[#5a5a5a]">{intro}</p>

      <div className="mt-16 grid grid-cols-2 gap-x-12 gap-y-12">
        {items.map((item) => (
          <div key={item.n} className="no-break">
            <span className="font-serif text-5xl text-[#c4c4c4]">{item.n}</span>
            <p className="mt-3 max-w-sm text-[#2a2a2a]">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 h-1.5 w-full bg-red" />
    </section>
  );
}
