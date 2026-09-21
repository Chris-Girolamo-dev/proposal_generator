// Section head in the site's .shead pattern: strong top hairline with a 56px red
// index bar and the Space Grotesk title. The mono "0X / 09" index and the right-aligned
// aside were both removed -- the title now starts at the left margin, and the folio in
// the page footer remains the one place the section index is stated.
export function SectionHeading({ title }: { title: React.ReactNode }) {
  return (
    <div className="pd-shead pt-5">
      <h2 className="pd-display text-[34px] font-semibold leading-none tracking-[-0.02em] text-[var(--pd-ink)]">
        {title}
      </h2>
    </div>
  );
}
