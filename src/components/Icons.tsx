interface MarkProps {
  className?: string;
  animated?: boolean;
  tone?: "light" | "dark";
}

/**
 * COSMOX mark — fine orbital arc, crosshair reticle and a travelling node.
 */
export function BrandMark({ className, animated = true, tone = "light" }: MarkProps) {
  const outerRing = tone === "dark" ? "rgba(255,255,255,0.28)" : "#DCD8CE";
  const primary = tone === "dark" ? "#FFFFFF" : "#141518";
  const reticle = tone === "dark" ? "rgba(255,255,255,0.52)" : "#575A61";

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="20" cy="20" r="18.5" stroke={outerRing} strokeWidth="1" />
      <ellipse
        cx="20"
        cy="20"
        rx="18.5"
        ry="7.5"
        stroke={primary}
        strokeWidth="1.15"
        transform="rotate(-28 20 20)"
      />
      <path d="M20 1.5v7M20 31.5v7M1.5 20h7M31.5 20h7" stroke={reticle} strokeWidth="1" />
      <circle cx="20" cy="20" r="4.4" stroke={primary} strokeWidth="1.15" />
      <circle cx="20" cy="20" r="1.5" fill={primary} />
      <g className={animated ? "orbit-spin" : undefined} style={{ transformOrigin: "20px 20px" }}>
        <g transform="rotate(-28 20 20)">
          <circle cx="38.5" cy="20" r="2.7" fill="#D94E1F" />
        </g>
      </g>
    </svg>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 8h11M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function ArrowDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 2v11M4 9l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function CheckSeal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 1.4 9.7 3l2.3-.2.5 2.2 2 1.2-1 2.1 1 2.1-2 1.2-.5 2.2-2.3-.2L8 14.6 6.3 13l-2.3.2-.5-2.2-2-1.2 1-2.1-1-2.1 2-1.2.5-2.2L6.3 3 8 1.4Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="m5.6 8 1.7 1.8L10.6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />
    </svg>
  );
}

/** Small registration crosshair used as architectural grid punctuation. */
export function Crosshair({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} aria-hidden="true">
      <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}