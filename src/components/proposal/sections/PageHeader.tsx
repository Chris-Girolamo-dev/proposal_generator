import Image from "next/image";

// Repeated on EVERY page, cover included — one consistent modest size throughout;
// the "big" feeling on the cover comes from the headline below it, never the logos.
// Uses the flat cropped wordmark (the glow variant bakes a radial haze into its
// alpha channel that smears on this light paper ground — same reason the website
// switched). `noBorder` drops the bottom hairline for the cover, which has its own
// meta-row rhythm.
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
    <div
      className={`flex items-center justify-between ${
        noBorder ? "" : "mb-10 border-b border-[var(--pd-line)] pb-5"
      }`}
    >
      <div className="flex items-center gap-4">
        {/* One wordmark everywhere — the same flat crop on light and dark grounds
            (per user direction; the glow variant is retired from the doc). */}
        <Image
          src="/brand/logo/OPFOR_LOGO_NEW_CROPPED.png"
          alt="OPFOR Supply"
          width={1066}
          height={268}
          className="h-7 w-auto"
        />
        <span className="text-lg text-[var(--pd-mid)]">×</span>
        {clientLogoUrl ? (
          // Sits directly on the page ground — no backdrop card. Uploads are run through
          // removeLogoBackground() (lib/proposal/remove-logo-bg.ts), which flood-fills a
          // baked-in solid background to transparent, so a neutral chip behind the mark
          // would just reintroduce the rectangle we stripped. Bounding box (not fixed
          // height) so any aspect ratio scales without ballooning the other axis.
          //
          // Trade-off, kept deliberately: a mark drawn for a dark ground (near-white
          // elements) has no contrast floor here and could wash out on paper. If that ever
          // shows up, reach for a per-proposal opt-in chip, not a blanket one.
          /* eslint-disable-next-line @next/next/no-img-element -- external Supabase Storage URL */
          <img
            src={clientLogoUrl}
            alt={clientCompany}
            className="max-h-8 max-w-[130px] w-auto object-contain"
          />
        ) : (
          <span className="pd-display text-base font-semibold tracking-tight text-[var(--pd-ink)]">
            {clientCompany}
          </span>
        )}
      </div>
      {trailing}
    </div>
  );
}
