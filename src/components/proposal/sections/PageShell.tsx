import { PageHeader } from "./PageHeader";
import { CornerGlobe } from "./CoverGlobe";

/**
 * One printed page: repeated brand header on top, content, and a mono folio
 * footer pinned to the bottom edge (the site's .tfoot instrument row). Every
 * section except the cover and the agreement (which manage their own frame)
 * renders inside this.
 */
export function PageShell({
  number,
  total = "09",
  clientCompany,
  clientLogoUrl,
  folioLabel,
  anchor,
  className = "",
  children,
}: {
  number: string;
  total?: string;
  clientCompany: string;
  clientLogoUrl: string | null;
  /** Replaces the "NN / TT" folio. The contents page is outside the numbered run, so it
      says CONTENTS instead of taking a number that would shift every section after it. */
  folioLabel?: string;
  /** Anchor id, defaulting to `section-<number>`. Pass null on continuation pages so a
      multi-page section does not emit the same id more than once. */
  anchor?: string | null;
  /** Extra classes on the page frame -- the agreement pages reset to paper here. */
  className?: string;
  children: React.ReactNode;
}) {
  return (
    // relative isolate: lets the plate-globe variants layer a clipped corner
    // globe behind this page's content (z-[-1]) without leaking under the ground.
    // id: the contents page links to these; section numbers are stable, so the anchor is
    // derived from the folio rather than threaded through as another prop.
    <section id={anchor === null ? undefined : (anchor ?? `section-${number}`)} className={`isolate relative flex min-h-[11in] flex-col p-16 ${className}`}>
      <CornerGlobe />
      <PageHeader clientCompany={clientCompany} clientLogoUrl={clientLogoUrl} />
      <div className="flex flex-1 flex-col">{children}</div>
      <div className="pd-meta pd-ocr mt-7 flex justify-between border-t border-[var(--pd-line)] pt-4">
        <span>OPFOR SUPPLY · CLINICAL SUPPLY FORECASTING</span>
        <span>{folioLabel ?? `${number} / ${total}`}</span>
      </div>
    </section>
  );
}
