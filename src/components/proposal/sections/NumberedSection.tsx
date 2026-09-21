import type { NumberedItem } from "@/lib/proposal/types";
import { SectionHeading } from "./SectionHeading";
import { PageShell } from "./PageShell";

// Opportunity / Solution pages — the site's capabilities index: hairline-ruled rows
// with a mono index number. Item text is set at the intro paragraph's size (13.5px)
// rather than the old 19px display size, per review: the pages read as one voice and
// the list no longer risks pushing a sixth row onto a second sheet.
export function NumberedSection({
  number,
  total,
  title,
  intro,
  items,
  clientCompany,
  clientLogoUrl,
}: {
  number: string;
  total?: string;
  title: React.ReactNode;
  intro: string;
  items: NumberedItem[];
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  return (
    <PageShell number={number} total={total} clientCompany={clientCompany} clientLogoUrl={clientLogoUrl}>
      <SectionHeading title={title} />
      <p className="mt-8 text-[13.5px] leading-[1.65] text-[var(--pd-tag)]">
        {intro}
      </p>

      <div className="mt-12">
        {items.map((item) => (
          <div
            key={item.n}
            // No closing rule on the last row: it lands near the footer hairline and the
            // two read as a doubled line. Each row's top border already separates them.
            className="no-break grid grid-cols-12 gap-4 border-t border-[var(--pd-line)] py-6"
          >
            <span className="pd-meta col-span-1 pt-1">{item.n}</span>
            <p className="col-span-10 pd-display text-[13.5px] font-medium leading-[1.65] tracking-[-0.01em] text-[var(--pd-ink)]">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
