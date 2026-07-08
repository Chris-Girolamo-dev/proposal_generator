import Image from "next/image";

// Repeated on EVERY page, cover included — one consistent size throughout, matching the
// reference (its brand row stays modest-sized even on the cover; the "big" feeling there
// comes from the bold headline below it, not from oversized logos). `noBorder` drops the
// bottom rule for the cover, which has its own meta-row rhythm at the bottom of the page.
export function PageHeader({
  clientCompany,
  clientLogoUrl,
  noBorder = false,
  trailing,
}: {
  clientCompany: string;
  clientLogoUrl: string | null;
  noBorder?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <div className={`flex items-center justify-between ${noBorder ? "" : "mb-10 border-b border-[#e5e5e5] pb-6"}`}>
      <div className="flex items-center gap-4">
        {/* Logo PNG is genuinely transparent — no card/chip needed, it reads clean on white. */}
        <Image
          src="/brand/logo/OPFOR_LOGO_NEW_2026.png"
          alt="OPFOR"
          width={1536}
          height={1024}
          className="h-10 w-auto max-w-[160px]"
        />
        <span className="text-xl text-[#c5c5c5]">×</span>
        {clientLogoUrl ? (
          // Unlike OPFOR's asset (confirmed transparent, legible on white with no backdrop),
          // an uploaded client logo's colors are unknown — some brands' marks are designed for
          // a dark background and have near-white elements that vanish here. A light neutral
          // card gives every logo a contrast floor regardless of its own palette. Bounding box
          // (not just a fixed height) so any aspect ratio — wide wordmark, tall stacked
          // icon+text lockup — scales down to fit without ballooning the other axis.
          <div className="rounded-md bg-[#f2f2f2] px-3 py-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- external Supabase Storage URL */}
            <img
              src={clientLogoUrl}
              alt={clientCompany}
              className="max-h-10 max-w-[140px] w-auto object-contain"
            />
          </div>
        ) : (
          <span className="font-heading text-lg font-semibold text-[#4a4a4a]">{clientCompany}</span>
        )}
      </div>
      {trailing}
    </div>
  );
}
