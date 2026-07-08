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
  // Logo PNG is genuinely transparent (the dark backdrop seen in file previews is just the
  // viewer's checkerboard, not baked into the image) — no card/chip needed, it reads clean
  // directly on white.
  const opforLogoClass = size === "cover" ? "h-48 w-auto" : "h-[60px] w-auto";
  const clientLogoClass = size === "cover" ? "h-56 w-auto max-w-[640px]" : "h-[72px] w-auto max-w-[280px]";
  const clientTextClass =
    size === "cover" ? "font-heading text-4xl font-semibold" : "font-heading text-lg font-semibold";
  const crossClass = size === "cover" ? "text-4xl text-[#c5c5c5]" : "text-lg text-[#c5c5c5]";

  return (
    <div
      className={`flex items-center justify-between ${size === "compact" ? "mb-10 border-b border-[#e5e5e5] pb-6" : ""}`}
    >
      <div className="flex items-center gap-4">
        <Image
          src="/brand/logo/OPFOR_LOGO_NEW_2026.png"
          alt="OPFOR"
          width={1536}
          height={1024}
          className={opforLogoClass}
        />
        <span className={crossClass}>×</span>
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
