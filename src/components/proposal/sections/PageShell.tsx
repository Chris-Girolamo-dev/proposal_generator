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
  children,
}: {
  number: string;
  total?: string;
  clientCompany: string;
  clientLogoUrl: string | null;
  children: React.ReactNode;
}) {
  return (
    // relative isolate: lets the plate-globe variants layer a clipped corner
    // globe behind this page's content (z-[-1]) without leaking under the ground.
    <section className="isolate relative flex min-h-[11in] flex-col p-16">
      <CornerGlobe />
      <PageHeader clientCompany={clientCompany} clientLogoUrl={clientLogoUrl} />
      <div className="flex-1">{children}</div>
      <div className="pd-meta mt-8 flex justify-between border-t border-[var(--pd-line)] pt-4">
        <span>OPFOR.AI · CLINICAL SUPPLY FORECASTING</span>
        <span>{number} / {total}</span>
      </div>
    </section>
  );
}
