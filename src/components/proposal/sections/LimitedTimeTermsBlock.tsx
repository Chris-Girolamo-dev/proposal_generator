import { LIMITED_TIME_TERMS } from "@/lib/proposal/defaults";

/**
 * The limited-time terms, rendered from one source in both places they appear.
 *
 * Two shapes, because the pages have different budgets. `cover` stacks name, terms and
 * duration under the blurb, where there is room. `investment` runs the name and terms on
 * one line beside the price: stacked, it pushed that page 28px past the sheet, and the
 * spacing needed to claw that back left only 6px of slack.
 */
export function LimitedTimeTermsBlock({ tone = "cover" }: { tone?: "cover" | "investment" }) {
  if (tone === "investment") {
    return (
      <div className="mt-5 border-t border-[var(--pd-line)] pt-4">
        <p className="text-[13px] leading-[1.5] text-[var(--pd-ink)]">
          <span className="pd-display font-semibold tracking-[-0.01em] text-[#E5192B]">
            {LIMITED_TIME_TERMS.name}
          </span>
          {/* Middot, not an em dash: the terms list already uses it, and the document
              avoids em dashes throughout. */}
          <span className="text-[var(--pd-mid)]"> · </span>
          {LIMITED_TIME_TERMS.terms.join(" · ")}
        </p>
        <p className="mt-1 text-[11.5px] leading-[1.5] text-[var(--pd-dim)]">
          {/* Close date leads here: beside the price is where a reader decides whether to
              move now. */}
          <span className="capitalize">{LIMITED_TIME_TERMS.closes}</span>.{" "}
          {LIMITED_TIME_TERMS.duration}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-7">
      <p className="pd-display text-[15px] font-semibold tracking-[-0.01em]">
        <span className="text-[#E5192B]">{LIMITED_TIME_TERMS.name}</span>
        <span className="font-normal text-[var(--pd-dim)]"> · {LIMITED_TIME_TERMS.closes}</span>
      </p>
      <p className="mt-2 text-[15px] leading-[1.6] text-[var(--pd-ink)]">
        {LIMITED_TIME_TERMS.terms.join(" · ")}
      </p>
      <p className="mt-1.5 text-[12.5px] leading-[1.55] text-[var(--pd-dim)]">
        {LIMITED_TIME_TERMS.duration}
      </p>
    </div>
  );
}
