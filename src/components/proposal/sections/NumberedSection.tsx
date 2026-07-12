import type { NumberedItem } from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";
import { PageShell } from "./PageShell";

// Opportunity / Solution pages — the site's capabilities index: hairline-ruled rows
// with a mono index number and the item text set large enough to carry the page.
export function NumberedSection({
  number,
  total,
  title,
  say,
  intro,
  items,
  clientCompany,
  clientLogoUrl,
}: {
  number: string;
  total?: string;
  title: React.ReactNode;
  say?: React.ReactNode;
  intro: string;
  items: NumberedItem[];
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  return (
    <PageShell number={number} total={total} clientCompany={clientCompany} clientLogoUrl={clientLogoUrl}>
      <SectionHeading number={number} total={total} title={title} say={say} />
      <p className="mt-8 text-[13.5px] leading-[1.65] text-[var(--pd-tag)]">
        {intro}
      </p>

      <div className="mt-12">
        {items.map((item, i) => (
          <div
            key={item.n}
            className={`no-break grid grid-cols-12 gap-4 border-t border-[var(--pd-line)] py-6 ${
              i === items.length - 1 ? "border-b" : ""
            }`}
          >
            <span className="pd-meta col-span-1 pt-1">{item.n}</span>
            <p className="col-span-10 pd-display text-[19px] font-medium leading-[1.35] tracking-[-0.01em] text-[var(--pd-ink)]">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
