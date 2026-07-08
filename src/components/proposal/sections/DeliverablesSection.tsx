import { Check } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { PageHeader } from "./PageHeader";

export function DeliverablesSection({
  items,
  clientCompany,
  clientLogoUrl,
}: {
  items: { text: string }[];
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  return (
    <section className="min-h-[11in] p-20">
      <PageHeader clientCompany={clientCompany} clientLogoUrl={clientLogoUrl} />
      <SectionHeading number="03" eyebrow="WHAT YOU GET" boldText="What" accentText="you get." />
      <p className="mt-6 max-w-2xl border-t border-[#e5e5e5] pt-6 text-[#5a5a5a]">
        A complete, working system, not a slide deck. Here is exactly what ships.
      </p>

      <ul className="mt-12 grid max-w-3xl grid-cols-2 gap-x-10 gap-y-3">
        {items.map((item, i) => (
          <li key={i} className="no-break flex items-start gap-2.5 text-sm text-[#2a2a2a]">
            <Check size={15} className="mt-0.5 shrink-0 text-red" strokeWidth={2.5} />
            {item.text}
          </li>
        ))}
      </ul>

      <div className="mt-16 h-1.5 w-full bg-red" />
    </section>
  );
}
