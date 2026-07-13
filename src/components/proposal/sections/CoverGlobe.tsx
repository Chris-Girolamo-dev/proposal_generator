// Static print rendition of the site's scroll-driven atlas globe: single-red-ink
// orthographic linework — rim, dashed range ring, graticule, depot ticks, and one
// dashed great-circle lane. Vector, so it stays crisp in the PDF.
//
// Two cover mounts (visibility is variant-driven, see globals.css):
// - .pd-globe        — unclipped, bleeds to the page edge (globe / dark-globe)
// - .pd-globe-plate  — clipped to the plate frame so no linework reaches the
//                      margin; the frame reads as the top layer (plate-globe /
//                      plate-globe-dark). Offsets keep the globe in the same
//                      spot relative to the page as the unclipped mount.
const DEPOTS: { x: number; y: number; label: string; anchor?: "end" }[] = [
  { x: 150, y: 118, label: "BSL" },
  { x: 92, y: 252, label: "RDU", anchor: "end" },
  { x: 296, y: 168, label: "SIN" },
  { x: 236, y: 306, label: "GRU" },
];

export function GlobeArt({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 420 420" fill="none" aria-hidden="true">
      <g stroke="#E5192B">
        {/* dashed range ring + rim */}
        <circle cx="210" cy="210" r="209" strokeOpacity=".22" strokeWidth="1" strokeDasharray="2 7" />
        <circle cx="210" cy="210" r="196" strokeOpacity=".6" strokeWidth="1.1" />
        {/* meridians */}
        <line x1="210" y1="14" x2="210" y2="406" strokeOpacity=".3" strokeWidth="0.9" />
        <ellipse cx="210" cy="210" rx="68" ry="196" strokeOpacity=".3" strokeWidth="0.9" />
        <ellipse cx="210" cy="210" rx="133" ry="196" strokeOpacity=".3" strokeWidth="0.9" />
        <ellipse cx="210" cy="210" rx="178" ry="196" strokeOpacity=".3" strokeWidth="0.9" />
        {/* parallels (chords of the visible disc) */}
        <line x1="23" y1="210" x2="397" y2="210" strokeOpacity=".45" strokeWidth="0.9" />
        <line x1="23" y1="151" x2="397" y2="151" strokeOpacity=".3" strokeWidth="0.9" />
        <line x1="23" y1="269" x2="397" y2="269" strokeOpacity=".3" strokeWidth="0.9" />
        <line x1="53" y1="92" x2="367" y2="92" strokeOpacity=".3" strokeWidth="0.9" />
        <line x1="53" y1="328" x2="367" y2="328" strokeOpacity=".3" strokeWidth="0.9" />
        <line x1="107" y1="43" x2="313" y2="43" strokeOpacity=".26" strokeWidth="0.9" />
        <line x1="107" y1="377" x2="313" y2="377" strokeOpacity=".26" strokeWidth="0.9" />
        {/* great-circle lane BSL → GRU */}
        <path d="M150 118 Q 240 190 236 306" strokeOpacity=".5" strokeWidth="1" strokeDasharray="3 6" />
        {/* depot ticks */}
        {DEPOTS.map((d) => (
          <g key={d.label} strokeOpacity=".85" strokeWidth="1.1">
            <line x1={d.x - 5} y1={d.y} x2={d.x + 5} y2={d.y} />
            <line x1={d.x} y1={d.y - 5} x2={d.x} y2={d.y + 5} />
          </g>
        ))}
      </g>
      {DEPOTS.map((d) => (
        <text
          key={d.label}
          x={d.anchor === "end" ? d.x - 9 : d.x + 9}
          y={d.y + 3}
          textAnchor={d.anchor ?? "start"}
          fontSize="8.5"
          letterSpacing=".08em"
          fill="var(--pd-dim)"
          style={{ fontFamily: "var(--font-plex-mono), monospace" }}
        >
          {d.label}
        </text>
      ))}
    </svg>
  );
}

export function CoverGlobe() {
  return (
    <>
      <GlobeArt className="pd-globe pointer-events-none absolute right-[-36px] top-[177px] z-[-1] w-[470px] opacity-[.55]" />
      {/* Clipped mount: the wrapper matches the plate frame (inset 26px) and hides
          any linework that would spill into the margin outside the border. Its top offset
          stays exactly 26px less than the unclipped mount's, so both land the globe in the
          same spot on the page. */}
      <div className="pd-globe-plate pointer-events-none absolute inset-[26px] z-[-1] overflow-hidden">
        <GlobeArt className="absolute right-[-62px] top-[151px] w-[470px] opacity-[.55]" />
      </div>
    </>
  );
}

/** Corner globe for the plate-globe variants' continuous pages: sits behind the
    frame's lower-right quadrant, clipped so nothing reaches the margin. */
export function CornerGlobe() {
  return (
    <div className="pd-globe-corner pointer-events-none absolute inset-[26px] z-[-1] overflow-hidden">
      <GlobeArt className="absolute bottom-[-225px] right-[-225px] w-[450px] opacity-[.45]" />
    </div>
  );
}
