import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import {
  DISPATCH_CATEGORIES,
  DISPATCHES,
  type DispatchCategory,
} from "@/data/dispatches";
import { ArrowRight, CheckSeal, Crosshair } from "@/components/Icons";

/* ── Friendly label map (category + title → clean agency label) ──────── */
const AGENCY_LABELS: Record<string, string> = {
  "disp-01": "ISRO Student Scheme",
  "disp-02": "National Hackathon",
  "disp-03": "ISRO R&D Trainee",
  "disp-04": "Space Startup Internship",
};

export function LiveDispatches() {
  const [activeCategory, setActiveCategory] = useState<DispatchCategory>("ALL");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [unlockedIds, setUnlockedIds] = useState<Record<string, boolean>>({});
  const baseId = useId();
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabButtons = useRef<Partial<Record<DispatchCategory, HTMLButtonElement>>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  /* ── Sliding tab indicator measurement ─────────────────────────────── */
  useLayoutEffect(() => {
    const container = tabsRef.current;
    const active = tabButtons.current[activeCategory];
    if (!container || !active) return;

    const measure = () =>
      setIndicator({ left: active.offsetLeft, width: active.offsetWidth });

    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(container);
    DISPATCH_CATEGORIES.forEach((category) => {
      const button = tabButtons.current[category];
      if (button) observer?.observe(button);
    });
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [activeCategory]);

  /* ── Filtered list ─────────────────────────────────────────────────── */
  const filteredDispatches = useMemo(() => {
    if (activeCategory === "ALL") return DISPATCHES;
    return DISPATCHES.filter((d) => d.category === activeCategory);
  }, [activeCategory]);

  /* ── Expand logic: hover vs click/tap ──────────────────────────────── */
  const expandedId = clickedId ?? hoveredId;

  const handleMouseEnter = (id: string) => {
    if (!clickedId) setHoveredId(id);
  };
  const handleMouseLeave = () => {
    if (!clickedId) setHoveredId(null);
  };
  const handleClick = (id: string) => {
    setClickedId((prev) => (prev === id ? null : id));
    setHoveredId(null);
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUnlock = (id: string) => {
    setUnlockedIds((prev) => ({ ...prev, [id]: true }));
    window.dispatchEvent(new Event("cosmox:join"));
  };

  return (
    <section
      id="live"
      aria-labelledby="live-heading"
      className="relative border-b border-hairline bg-canvas py-24 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* ── Section Header ─────────────────────────────────── */}
        <div className="flex flex-col justify-between gap-8 border-b border-hairline pb-8 md:flex-row md:items-end">
          <div>
            <h2
              id="live-heading"
              className="font-display text-[clamp(2.5rem,4.4vw,3.75rem)] leading-[1.03] tracking-[-0.025em] text-ink"
            >
              Verified <em className="italic text-booster">windows</em>, zero noise.
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-graphite">
              Only real deadlines, clear eligibility, and verified programs—hover or tap any row to open full details.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="mono text-[9px] text-graphite">
              Filter by category
            </span>
            <div
              ref={tabsRef}
              role="tablist"
              aria-label="Opportunity categories"
              className="filter-tab-scroll liquid-chip relative flex max-w-full items-center overflow-x-auto p-1"
            >
              {DISPATCH_CATEGORIES.map((cat) => {
                const isActive = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    ref={(node) => { tabButtons.current[cat] = node ?? undefined; }}
                    role="tab"
                    id={`${baseId}-tab-${cat}`}
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "mono relative z-10 shrink-0 rounded-full px-3.5 py-1.5 text-[10px] transition-colors duration-250",
                      isActive
                        ? "text-ink"
                        : "text-graphite hover:text-ink",
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
              {/* Sliding active indicator */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-1 top-1 rounded-full border border-white/80 bg-white/90 shadow-[inset_0_1px_0_#fff,0_3px_9px_-5px_rgba(20,21,24,0.25)] transition-[left,width,opacity] duration-300"
                style={{ left: indicator.left, width: indicator.width, opacity: indicator.width ? 1 : 0 }}
              />
            </div>
          </div>
        </div>

        {/* ── Info bar ────────────────────────────────────────── */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 px-1 py-2">
          <div className="flex items-center gap-2">
            <Crosshair className="h-3 w-3 text-booster" />
            <span className="mono text-[9px] text-graphite">
              {DISPATCHES.length} verified opportunities tracked
            </span>
          </div>
          <span className="mono text-[9px] text-graphite">
            Updated {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()} 2026
          </span>
        </div>

        {/* ── Dispatch Cards ─────────────────────────────────── */}
        <div className="mt-4 space-y-4">
          {filteredDispatches.map((item) => {
            const isExpanded = expandedId === item.id;
            const isUnlocked = !!unlockedIds[item.id];
            const isSaved = !!savedIds[item.id];
            const agencyLabel = AGENCY_LABELS[item.id] ?? item.category;

            return (
              <div
                key={item.id}
                className={cn(
                  "group overflow-hidden rounded-3xl border border-hairline bg-chalk transition-all duration-300 ease-out",
                  isExpanded
                    ? "shadow-[0_4px_24px_-8px_rgba(20,21,24,0.10)]"
                    : "hover:shadow-[0_2px_12px_-4px_rgba(20,21,24,0.06)]",
                )}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* ── Collapsed Summary Row ──────────────────────── */}
                <button
                  type="button"
                  onClick={() => handleClick(item.id)}
                  aria-expanded={isExpanded}
                  className="flex w-full flex-col gap-4 px-5 py-5 text-left sm:px-7 md:flex-row md:items-center md:justify-between md:py-6"
                >
                  {/* Left: status dot + agency pill + title */}
                  <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:gap-4">
                    <div className="flex items-center gap-3">
                      {/* Status dot */}
                      <span className="relative flex h-[7px] w-[7px] shrink-0 items-center justify-center">
                        {item.deadlineUrgent && (
                          <span className="absolute inline-flex h-full w-full rounded-full bg-booster opacity-70 [animation:cx-ping_2s_ease-out_infinite]" />
                        )}
                        <span
                          className={cn(
                            "relative inline-flex h-[7px] w-[7px] rounded-full",
                            item.deadlineUrgent ? "bg-booster" : "bg-cobalt",
                          )}
                        />
                      </span>

                      {/* Agency pill */}
                      <span className="liquid-chip mono shrink-0 px-2.5 py-1 text-[9px] text-graphite">
                        {agencyLabel.toUpperCase()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-[17px] font-semibold leading-snug text-ink sm:text-[18px]">
                      {item.title}
                    </h3>
                  </div>

                  {/* Right: deadline pill + hover cue */}
                  <div className="flex items-center gap-3 self-stretch md:self-auto md:justify-end">
                    {/* Deadline + branch badge */}
                    <span
                      className={cn(
                        "mono shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-[9.5px]",
                        item.deadlineUrgent
                          ? "border-booster/30 bg-booster/5 font-bold text-booster"
                          : "border-cobalt/30 bg-cobalt/5 text-cobalt",
                      )}
                    >
                      {item.deadline} • {item.branchBadge}
                    </span>

                    {/* Hover-to-open cue */}
                    <span
                      className={cn(
                        "mono hidden shrink-0 text-[9px] transition-colors duration-200 md:inline-flex md:items-center md:gap-1",
                        isExpanded ? "text-booster" : "text-graphite group-hover:text-booster",
                      )}
                    >
                      {isExpanded ? "Tap to close ▴" : "Hover to open ▾"}
                    </span>

                    {/* Animated toggle icon */}
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-hairline bg-canvas text-ink transition-all duration-300 group-hover:border-ink",
                        isExpanded && "border-ink bg-ink text-white",
                      )}
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 12 12"
                        className={cn(
                          "h-3 w-3 transition-transform duration-300",
                          isExpanded && "rotate-45",
                        )}
                        fill="none"
                      >
                        <path
                          d="M6 1.5v9M1.5 6h9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="square"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* ── Expanded Detail Panel ──────────────────────── */}
                <div
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-350 ease-out",
                    isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-hairline bg-canvas p-5 sm:p-7">
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                        {/* Left: Image */}
                        <div className="squircle-media relative overflow-hidden border border-hairline bg-ink lg:col-span-5">
                          <div className="relative aspect-[16/10] w-full overflow-hidden">
                            <img
                              src={item.image.url}
                              alt={item.image.alt}
                              loading="lazy"
                              className="h-full w-full object-cover saturate-[0.85] filter transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-ink/15 mix-blend-multiply" />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

                            {/* Bottom caption */}
                            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                              <span className="mono text-[8.5px] tracking-wider text-white/90">
                                {item.image.schematicLabel}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <CheckSeal className="h-2.5 w-2.5 text-green-400" />
                                <span className="mono text-[8px] text-green-400">
                                  Verified
                                </span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between bg-stone px-3 py-1.5">
                            <span className="mono text-[8px] text-graphite">
                              {item.image.telemetryText}
                            </span>
                            <span className="mono text-[8px] text-graphite">
                              {item.sampleTag}
                            </span>
                          </div>
                        </div>

                        {/* Right: Details + Action */}
                        <div className="flex flex-col justify-between space-y-5 lg:col-span-7">
                          <div className="space-y-5">
                            {/* Quick Details Section */}
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite">
                                Quick Details
                              </p>

                              <ul className="mt-4 space-y-4">
                                {/* Who can apply */}
                                <li className="flex items-start gap-3">
                                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone text-[10px] font-semibold text-ink">
                                    ✓
                                  </span>
                                  <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-graphite">
                                      Who can apply
                                    </p>
                                    <p className="mt-0.5 text-[13.5px] leading-snug text-ink">
                                      {item.flightSpec.eligibility}
                                    </p>
                                  </div>
                                </li>

                                {/* What you'll need */}
                                <li className="flex items-start gap-3">
                                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cobalt/10 text-[10px] font-semibold text-cobalt">
                                    ⚡
                                  </span>
                                  <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-graphite">
                                      What you&apos;ll need
                                    </p>
                                    <p className="mt-0.5 text-[13.5px] leading-snug text-ink">
                                      {item.flightSpec.stack}
                                    </p>
                                  </div>
                                </li>

                                {/* What you get */}
                                <li className="flex items-start gap-3">
                                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-booster/10 text-[10px] font-semibold text-booster">
                                    ★
                                  </span>
                                  <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-graphite">
                                      What you get
                                    </p>
                                    <p className="mt-0.5 text-[13.5px] leading-snug text-ink">
                                      {item.flightSpec.cohortKit}
                                    </p>
                                  </div>
                                </li>
                              </ul>
                            </div>

                            {/* Eligibility tags */}
                            <div className="flex flex-wrap gap-2">
                              {item.branchBadge.split(" / ").map((tag) => (
                                <span
                                  key={tag}
                                  className="liquid-chip mono px-2.5 py-1 text-[9px] text-ink"
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                              <span className="liquid-chip mono px-2.5 py-1 text-[9px] text-cobalt">
                                {item.category === "INTERNSHIPS"
                                  ? "Internship"
                                  : item.category === "HACKATHONS"
                                    ? "Hackathon"
                                    : "Startup"}
                              </span>
                              {item.deadlineUrgent && (
                                <span className="liquid-chip mono border-booster/30 bg-booster/5 px-2.5 py-1 text-[9px] font-bold text-booster">
                                  Closing soon
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Row */}
                          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
                            <button
                              type="button"
                              onClick={() => toggleSave(item.id)}
                              className={cn(
                                "liquid-secondary mono inline-flex h-[38px] items-center gap-2 px-4 text-[12px] transition-all duration-200",
                                isSaved ? "text-cobalt" : "text-graphite hover:text-ink",
                              )}
                            >
                              {isSaved ? "✓ Window Saved" : "☆ Save Window"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleUnlock(item.id)}
                              className={cn(
                                "group/cta inline-flex h-[38px] items-center gap-2 px-4 text-[13px] font-semibold transition-all duration-200",
                                isUnlocked
                                  ? "liquid-cobalt text-white"
                                  : "liquid-primary text-white",
                              )}
                            >
                              {isUnlocked ? (
                                <>
                                  <CheckSeal className="h-3.5 w-3.5" />
                                  <span>Details Unlocked</span>
                                </>
                              ) : (
                                <>
                                  <span>Open Full Details</span>
                                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-[3px]" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer note ────────────────────────────────────── */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-graphite">
          <p className="mono text-[9.5px]">
            ↳ Every listing is verified against official portals and program announcements before it appears here.
          </p>
          <span className="mono text-[9px]">
            {DISPATCHES.length} programs • all verified
          </span>
        </div>
      </div>
    </section>
  );
}
