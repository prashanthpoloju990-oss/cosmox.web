import { useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { BRANCHES, type BranchId } from "@/data/branches";
import { ArrowRight, CheckSeal } from "@/components/Icons";

function tracePath(values: number[], w: number, h: number) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = Math.max(max - min, 1);
  return values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / span) * (h - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
}

export function BranchBriefingCard() {
  const [activeId, setActiveId] = useState<BranchId>("cse");
  const [expanded, setExpanded] = useState(false);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const index = BRANCHES.findIndex((b) => b.id === activeId);
  const branch = BRANCHES[index] ?? BRANCHES[0];
  const pts = tracePath(branch.trace, 320, 52);

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next =
      e.key === "ArrowRight"
        ? (i + 1) % BRANCHES.length
        : (i - 1 + BRANCHES.length) % BRANCHES.length;
    setActiveId(BRANCHES[next].id);
    tabsRef.current[next]?.focus();
  };

  return (
    <div className="relative">
      {/* registration ticks */}
      <span className="pointer-events-none absolute -left-[6px] -top-[6px] h-3 w-3 border-l border-t border-ink/40" />
      <span className="pointer-events-none absolute -bottom-[6px] -right-[6px] h-3 w-3 border-b border-r border-ink/40" />

      <div className="squircle overflow-hidden border border-hairline bg-chalk shadow-[0_28px_60px_-52px_rgba(20,21,24,0.55)]">
        {/* Header bar */}
        <div className="flex items-center justify-between gap-3 border-b border-hairline bg-stone px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-[7px] w-[7px] items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-booster opacity-60 [animation:cx-ping_2.4s_cubic-bezier(0,0,0.2,1)_infinite]" />
              <span className="live-dot relative inline-flex h-[7px] w-[7px] rounded-full bg-booster" />
            </span>
            <span className="mono text-[9.5px] text-ink">
              Mission Briefing // Branch Translator
            </span>
          </div>
          <span className="mono hidden text-[9.5px] text-graphite sm:inline">
            03 Branches
          </span>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Engineering branch"
          className="liquid-chip relative mx-4 mt-4 grid grid-cols-3 gap-1 p-1 sm:mx-5"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-1 left-1 top-1 rounded-full border border-white/80 bg-white/85 shadow-[inset_0_1px_0_#fff,0_3px_9px_-5px_rgba(20,21,24,0.35)] transition-transform duration-400"
            style={{
              width: "calc((100% - 16px) / 3)",
              transform: `translate3d(calc(${index * 100}% + ${index * 4}px), 0, 0)`,
            }}
          />
          {BRANCHES.map((b, i) => {
            const isActive = b.id === activeId;
            return (
              <button
                key={b.id}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                role="tab"
                id={`tab-${b.id}`}
                aria-selected={isActive}
                aria-controls="branch-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveId(b.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={cn(
                  "mono relative z-10 rounded-full py-3 text-[10.5px] transition-colors duration-250",
                  isActive
                    ? "text-ink"
                    : "text-graphite hover:bg-white/40 hover:text-ink",
                )}
              >
                {b.tab}
              </button>
            );
          })}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[6px] left-1 h-[2px] rounded-full bg-booster transition-transform duration-400"
            style={{
              width: "calc((100% - 16px) / 3)",
              transform: `translate3d(calc(${index * 100}% + ${index * 4}px), 0, 0)`,
            }}
          />
        </div>

        {/* Panel */}
        <div
          id="branch-panel"
          role="tabpanel"
          aria-labelledby={`tab-${branch.id}`}
          className="px-5 pb-5 pt-5 sm:px-6"
        >
          <div key={branch.id} className="space-y-5">
            <div
              className="swap-in flex items-center justify-between"
              style={{ animationDelay: "0ms" }}
            >
              <span className="mono text-[9.5px] text-graphite">{branch.code}</span>
              <span className="mono flex items-center gap-1.5 text-[9.5px] text-cobalt">
                <span className="h-[5px] w-[5px] rotate-45 bg-cobalt" />
                Auto-matched
              </span>
            </div>

            <div className="swap-in" style={{ animationDelay: "40ms" }}>
              <p className="mono mb-2 text-[9.5px] text-graphite">
                Target Space Role
              </p>
              <h3 className="font-display text-[27px] text-ink sm:text-[30px]">
                {branch.role}
              </h3>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-graphite">
                {branch.roleNote}
              </p>
            </div>

            <div className="swap-in" style={{ animationDelay: "80ms" }}>
              <p className="mono mb-2 text-[9.5px] text-graphite">Key Stack</p>
              <div className="flex flex-wrap items-center gap-1.5">
                {branch.stack.map((s) => (
                  <span
                    key={s}
                    className="liquid-chip mono px-2 py-[5px] text-[10px] text-ink transition-colors duration-200 hover:border-ink"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="swap-in squircle-inner border border-hairline bg-canvas p-3.5"
              style={{ animationDelay: "120ms" }}
            >
              <div className="flex items-start gap-3">
                <span className="mono mt-[3px] shrink-0 rounded-full border border-booster px-1.5 py-[2px] text-[9px] text-booster">
                  01
                </span>
                <div>
                  <p className="mono mb-1 text-[9.5px] text-graphite">
                    Starter Proof-of-Work
                  </p>
                  <p className="text-[14px] leading-[1.55] text-ink">
                    {branch.project}
                  </p>
                  <p className="mono mt-2 text-[9px] text-graphite">
                    {branch.projectMeta}
                  </p>
                </div>
              </div>
            </div>

            <div className="swap-in" style={{ animationDelay: "160ms" }}>
              <div className="liquid-cobalt inline-flex items-center gap-2 px-3 py-2 text-white">
                <CheckSeal className="h-3.5 w-3.5 shrink-0" />
                <span className="mono text-[10px] leading-none">
                  {branch.benchmark}
                </span>
              </div>
              <p className="mt-2 text-[12px] leading-[1.5] text-graphite">
                {branch.benchmarkNote}
              </p>
            </div>

            {/* Hiring signal trace */}
            <div
              className="swap-in border-t border-hairline pt-4"
              style={{ animationDelay: "200ms" }}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="mono text-[9.5px] text-graphite">
                  Hiring Signal · 12 MO
                </span>
                <span className="mono text-[9.5px] text-booster">
                  +{branch.trace[branch.trace.length - 1] - branch.trace[0]}%
                </span>
              </div>
              <svg
                viewBox="0 0 320 52"
                preserveAspectRatio="none"
                className="h-[52px] w-full"
                aria-hidden="true"
              >
                <line x1="0" y1="51.5" x2="320" y2="51.5" stroke="#DCD8CE" strokeWidth="1" />
                <line x1="0" y1="26" x2="320" y2="26" stroke="#DCD8CE" strokeWidth="1" strokeDasharray="2 4" />
                <polygon
                  points={`0,52 ${pts.join(" ")} 320,52`}
                  fill="#D94E1F"
                  opacity="0.08"
                />
                <polyline
                  points={pts.join(" ")}
                  fill="none"
                  stroke="#D94E1F"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  pathLength={320}
                  className="trace-draw"
                />
              </svg>
              <div className="mt-3 grid grid-cols-3 divide-x divide-hairline border-t border-hairline pt-3">
                {branch.metrics.map((m) => (
                  <div key={m.label} className="px-2 first:pl-0 last:pr-0">
                    <p className="mono text-[9px] text-graphite">{m.label}</p>
                    <p className="mono tnum mt-1 text-[11.5px] text-ink">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Expandable roadmap */}
            <div className="swap-in" style={{ animationDelay: "240ms" }}>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                aria-controls="roadmap-panel"
                className="liquid-secondary group flex w-full items-center justify-between px-3.5 py-2.5 text-left"
              >
                <span className="mono text-[10px] text-ink">
                  {expanded ? "Collapse Roadmap" : "Open Full Roadmap"}
                </span>
                <ArrowRight
                  className={cn(
                    "h-3.5 w-3.5 text-booster transition-transform duration-400",
                    expanded ? "-rotate-90" : "rotate-90 group-hover:translate-x-[2px]",
                  )}
                />
              </button>
              <div
                id="roadmap-panel"
                inert={!expanded}
                className={cn(
                  "grid transition-[grid-template-rows] duration-500 ease-out",
                  expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <ul className="squircle-inner mt-2 border border-hairline bg-canvas">
                    {branch.phases.map((p) => (
                      <li
                        key={p.tag}
                        className="flex gap-3 border-b border-hairline px-3.5 py-3 last:border-b-0"
                      >
                        <span className="mono mt-[2px] shrink-0 text-[9px] text-booster">
                          {p.tag}
                        </span>
                        <div>
                          <p className="text-[13px] font-semibold leading-tight text-ink">
                            {p.title}
                          </p>
                          <p className="mt-1 text-[12.5px] leading-[1.5] text-graphite">
                            {p.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline bg-stone px-4 py-2.5">
          <span className="mono text-[9px] text-graphite">
            Source: ICRB / IN-SPACe public notices
          </span>
          <span className="mono text-[9px] text-graphite">
            Synced 12 FEB 2026 · 04:12 UTC
          </span>
        </div>
      </div>

      <p className="mono mt-3 text-[9.5px] leading-[1.8] text-graphite">
        ↳ Benchmarks are eligibility mirrors, not guarantees. Cosmox re-checks
        every notice weekly.
      </p>
    </div>
  );
}