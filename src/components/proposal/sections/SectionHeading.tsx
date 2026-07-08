// Section head in the site's .shead pattern: strong top hairline with a 56px red
// index bar, mono "0X / 09" index, Space Grotesk title, and an optional right-aligned
// two-line aside. All text stays monochrome — red appears only as the rule bar.
export function SectionHeading({
  number,
  title,
  say,
}: {
  number: string;
  title: React.ReactNode;
  say?: React.ReactNode;
}) {
  return (
    <div className="pd-shead grid grid-cols-12 items-baseline gap-4 pt-5">
      <span className="pd-meta col-span-2">{number} / 09</span>
      <h2 className="col-span-7 pd-display text-[34px] font-semibold leading-none tracking-[-0.02em] text-[#0E1420]">
        {title}
      </h2>
      {say && (
        <p className="col-span-3 text-right text-[11.5px] leading-[1.55] text-[rgba(14,20,32,.56)]">
          {say}
        </p>
      )}
    </div>
  );
}
