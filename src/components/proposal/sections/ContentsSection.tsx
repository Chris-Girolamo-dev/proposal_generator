import { PageShell } from "./PageShell";

export interface ContentsEntry {
  number: string;
  title: string;
}

/**
 * Contents page, sitting between the cover and section 01.
 *
 * Deliberately outside the numbered run: it carries a CONTENTS folio rather than a number
 * of its own, so adding it does not renumber the nine sections that follow (those numbers
 * appear in the footer of every page and in the entries below).
 *
 * Each row links to `#section-NN`, the anchor PageShell puts on every page. Chromium
 * carries same-document anchors through to the exported PDF as clickable internal links,
 * so these work in the file the client receives, not just on screen.
 */
export function ContentsSection({
  entries,
  total,
  clientCompany,
  clientLogoUrl,
}: {
  entries: ContentsEntry[];
  total?: string;
  clientCompany: string;
  clientLogoUrl: string | null;
}) {
  return (
    <PageShell
      number="00"
      total={total}
      folioLabel="CONTENTS"
      clientCompany={clientCompany}
      clientLogoUrl={clientLogoUrl}
    >
      <div className="pd-shead pt-5">
        <h2 className="pd-display text-[34px] font-semibold leading-none tracking-[-0.02em] text-[var(--pd-ink)]">
          Contents
        </h2>
      </div>

      {/* Tighter than the numbered pages' rhythm on purpose: the moat edition lists eleven
          sections, and at py-5 the eleventh pushed the folio onto a second sheet carrying
          nothing. At py-4 the page holds twelve. */}
      <div className="mt-10">
        {entries.map((entry) => (
          <a
            key={entry.number}
            href={`#section-${entry.number}`}
            // No closing rule on the last entry -- see NumberedSection.
            className="no-break grid grid-cols-12 items-baseline gap-4 border-t border-[var(--pd-line)] py-4 no-underline"
          >
            {/* Title left, folio right. The index is not repeated on the left: the folio
                already states it, and a doubled number reads as a typo. */}
            <span className="col-span-10 pd-display text-[17px] font-medium leading-[1.35] tracking-[-0.01em] text-[var(--pd-ink)]">
              {entry.title}
            </span>
            <span className="pd-meta col-span-2 text-right pt-1">
              {entry.number} / {total}
            </span>
          </a>
        ))}
      </div>
    </PageShell>
  );
}
