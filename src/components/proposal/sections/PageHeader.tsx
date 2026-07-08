import Image from "next/image";

// Repeated on every page (like the LCA reference's "spotify × LCA" header) so the client's
// brand is present throughout, not just on the cover. `size="cover"` runs larger for page 1.
export function PageHeader({
  clientCompany,
  clientLogoUrl,
  size = "compact",
  trailing,
}: {
  clientCompany: string;
  clientLogoUrl: string | null;
  size?: "cover" | "compact";
  trailing?: React.ReactNode;
}) {
  const opforBoxClass = size === "cover" ? "px-4 py-2.5" : "px-3 py-1.5";
  const opforLogoClass = size === "cover" ? "h-8 w-auto" : "h-5 w-auto";
  const clientLogoClass = size === "cover" ? "h-9 w-auto max-w-[180px]" : "h-6 w-auto max-w-[120px]";
  const clientTextClass =
    size === "cover" ? "font-heading text-base font-semibold" : "font-heading text-sm font-semibold";

  return (
    <div
      className={`flex items-center justify-between ${size === "compact" ? "mb-10 border-b border-[#e5e5e5] pb-4" : ""}`}
    >
      <div className="flex items-center gap-3">
        {/* Logo is a glow-on-dark wordmark; a dark chip gives it the contrast it's designed for. */}
        <div className={`inline-flex w-fit items-center rounded-md bg-[#0a0a0a] ${opforBoxClass}`}>
          <Image
            src="/brand/logo/OPFOR_LOGO_NEW_2026.png"
            alt="OPFOR"
            width={1536}
            height={1024}
            className={opforLogoClass}
          />
        </div>
        <span className="text-[#c5c5c5]">×</span>
        {clientLogoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- external Supabase Storage URL
          <img src={clientLogoUrl} alt={clientCompany} className={`${clientLogoClass} object-contain`} />
        ) : (
          <span className={`${clientTextClass} text-[#4a4a4a]`}>{clientCompany}</span>
        )}
      </div>
      {trailing}
    </div>
  );
}
