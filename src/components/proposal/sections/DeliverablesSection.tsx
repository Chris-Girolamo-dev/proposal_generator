import { SectionHeading } from "./SectionHeading";
import { PageShell } from "./PageShell";

// Scope page — a lanerow-style manifest: every deliverable is a hairline-ruled row
// with a mono index and a mono "INCLUDED" stamp on the right, so the list reads as
// a shipping manifest rather than a marketing bullet list.
export function DeliverablesSection({
  items,
  total,
  clientCompany,
  clientLogoUrl,
}: {
  items: { text: string }[];
  total?: string;
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  return (
    <PageShell number="03" total={total} clientCompany={clientCompany} clientLogoUrl={clientLogoUrl}>
      <SectionHeading
        number="03"
        total={total}
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
            className={`no-break flex items-baseline gap-5 px-5 py-4 ${
              i > 0 ? "border-t border-[var(--pd-line)]" : ""
            }`}
          >
            <span className="pd-meta w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <p className="flex-1 text-[13px] leading-[1.5] text-[var(--pd-ink)]">{item.text}</p>
            <span className="pd-meta shrink-0 text-right">Included</span>
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
