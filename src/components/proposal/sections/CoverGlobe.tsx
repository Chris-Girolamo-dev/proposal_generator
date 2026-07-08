// Static print rendition of the site's scroll-driven atlas globe: single-red-ink
// orthographic linework — rim, dashed range ring, graticule, depot ticks, and one
// dashed great-circle lane. Rendered on every cover but shown only by the "globe"
// variant (see .pd-globe in globals.css). Vector, so it stays crisp in the PDF.
const DEPOTS: { x: number; y: number; label: string; anchor?: "end" }[] = [
  { x: 150, y: 118, label: "BSL" },
  { x: 92, y: 252, label: "RDU", anchor: "end" },
  { x: 296, y: 168, label: "SIN" },
  { x: 236, y: 306, label: "GRU" },
];

export function CoverGlobe() {
  return (
    <svg
      className="pd-globe pointer-events-none absolute right-[-36px] top-[130px] z-[-1] w-[470px] opacity-[.55]"
      viewBox="0 0 420 420"
      fill="none"
      aria-hidden="true"
    >
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
          fill="rgba(14,20,32,.55)"
          style={{ fontFamily: "var(--font-plex-mono), monospace" }}
        >
          {d.label}
        </text>
      ))}
    </svg>
  );
}
