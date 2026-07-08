import { SectionHeading } from "./SectionHeading";
import { PageShell } from "./PageShell";

// Scope page — a lanerow-style manifest: every deliverable is a hairline-ruled row
// with a mono index and a mono "INCLUDED" stamp on the right, so the list reads as
// a shipping manifest rather than a marketing bullet list.
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
    <PageShell number="03" clientCompany={clientCompany} clientLogoUrl={clientLogoUrl}>
      <SectionHeading
        number="03"
        title="What ships"
        say={<>A working system,<br />not a slide deck.</>}
      />
      <p className="mt-8 max-w-[52ch] text-[13.5px] leading-[1.65] text-[var(--pd-tag)]">
        Everything below is included in the engagement and itemized here exactly as it will be
        delivered.
      </p>

      <div className="mt-12 border border-[var(--pd-line-strong)]">
        {items.map((item, i) => (
          <div
            key={i}
            className={`no-break grid grid-cols-12 items-baseline gap-4 px-5 py-4 ${
              i > 0 ? "border-t border-[var(--pd-line)]" : ""
            }`}
          >
            <span className="pd-meta col-span-1">{String(i + 1).padStart(2, "0")}</span>
            <p className="col-span-9 text-[13.5px] leading-[1.5] text-[var(--pd-ink)]">{item.text}</p>
            <span className="pd-meta col-span-2 text-right">Included</span>
          </div>
        ))}
      </div>
      <div className="pd-meta mt-3 flex justify-between">
        <span>Scope manifest · {items.length} line items</span>
        <span>Fixed scope</span>
      </div>
    </PageShell>
  );
}
