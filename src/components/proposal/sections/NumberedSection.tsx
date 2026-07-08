import type { NumberedItem } from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";
import { PageShell } from "./PageShell";

// Opportunity / Solution pages — the site's capabilities index: hairline-ruled rows
// with a mono index number and the item text set large enough to carry the page.
export function NumberedSection({
  number,
  title,
  say,
  intro,
  items,
  clientCompany,
  clientLogoUrl,
}: {
  number: string;
  title: React.ReactNode;
  say?: React.ReactNode;
  intro: string;
  items: NumberedItem[];
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  return (
    <PageShell number={number} clientCompany={clientCompany} clientLogoUrl={clientLogoUrl}>
      <SectionHeading number={number} title={title} say={say} />
      <p className="mt-8 max-w-[52ch] text-[13.5px] leading-[1.65] text-[rgba(14,20,32,.72)]">
        {intro}
      </p>

      <div className="mt-12">
        {items.map((item, i) => (
          <div
            key={item.n}
            className={`no-break grid grid-cols-12 gap-4 border-t border-[rgba(14,20,32,.16)] py-6 ${
              i === items.length - 1 ? "border-b" : ""
            }`}
          >
            <span className="pd-meta col-span-1 pt-1">{item.n}</span>
            <p className="col-span-10 max-w-[58ch] pd-display text-[19px] font-medium leading-[1.35] tracking-[-0.01em] text-[#0E1420]">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
