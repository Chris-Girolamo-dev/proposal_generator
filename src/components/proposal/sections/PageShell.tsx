import { PageHeader } from "./PageHeader";

/**
 * One printed page: repeated brand header on top, content, and a mono folio
 * footer pinned to the bottom edge (the site's .tfoot instrument row). Every
 * section except the cover and the agreement (which manage their own frame)
 * renders inside this.
 */
export function PageShell({
  number,
  clientCompany,
  clientLogoUrl,
  children,
}: {
  number: string;
  clientCompany: string;
  clientLogoUrl: string | null;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-[11in] flex-col p-16">
      <PageHeader clientCompany={clientCompany} clientLogoUrl={clientLogoUrl} />
      <div className="flex-1">{children}</div>
      <div className="pd-meta mt-8 flex justify-between border-t border-[var(--pd-line)] pt-4">
        <span>OPFOR.AI · CLINICAL SUPPLY FORECASTING</span>
        <span>{number} / 09</span>
      </div>
    </section>
  );
}
