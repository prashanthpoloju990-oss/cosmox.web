import { useRef } from "react";
import { cn } from "@/utils/cn";
import { CAREER_STAGES } from "@/data/career";
import { useCenterTracker } from "@/hooks/useCenterTracker";
import { Crosshair } from "@/components/Icons";
import { StageArtifact } from "@/components/career/StageArtifacts";

const pad = (n: number) => String(n).padStart(2, "0");
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function TelemetryField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="mono text-[8.5px] text-graphite">{label}</p>
      <p className="mt-1.5 text-[13px] font-medium leading-snug text-ink">{value}</p>
    </div>
  );
}

export function CareerGuidance() {
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const total = CAREER_STAGES.length;
  const { index, progress } = useCenterTracker(cardRefs, total);
  const stage = CAREER_STAGES[index];

  const jumpTo = (i: number) => {
    const el = cardRefs.current[i];
    if (!el) return;
    const r = el.getBoundingClientRect();
    const top = window.scrollY + r.top + r.height / 2 - window.innerHeight / 2;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  return (
    <section
      id="career"
      aria-labelledby="career-title"
      className="relative border-b border-hairline bg-canvas py-24 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-x-12 lg:grid-cols-12 lg:items-start">
          {/* ── LEFT · sticky briefing + live stage rail ─────────────── */}
          <aside className="lg:sticky lg:top-[96px] lg:col-span-5 lg:self-start">
            <p className="mono flex items-center gap-2.5 text-[10px] text-graphite">
              <Crosshair className="h-2.5 w-2.5 text-booster" />
              01 // Career Architecture
            </p>

            <h2
              id="career-title"
              className="mt-6 font-display text-[clamp(2.75rem,4vw,3.5rem)] leading-[1.04] tracking-[-0.025em] text-ink"
            >
              Clarity from{" "}
              <em className="italic text-booster">first semester</em> to first launch.
            </h2>

            <p className="mt-6 max-w-[46ch] text-[16.5px] leading-[1.62] text-graphite">
              Most engineering students think space-tech requires an Aerospace
              degree. Cosmox maps your exact B.Tech branch to real industry
              workflows, open-source tools, and official internship eligibility
              rules.
            </p>

            {/* Mobile / tablet: compact step pills */}
            <div className="mt-10 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {CAREER_STAGES.map((s, i) => (
                <button
                  key={s.index}
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-current={i === index ? "step" : undefined}
                  className={cn(
                    "mono shrink-0 px-3 py-2 text-[9px] transition-colors duration-300",
                    i === index
                      ? "liquid-ink text-white"
                      : "liquid-secondary text-graphite hover:text-ink",
                  )}
                >
                  {s.index} · {s.navLabel}
                </button>
              ))}
            </div>

            {/* Desktop: vertical stage rail */}
            <ol className="relative mt-12 hidden lg:block">
              {CAREER_STAGES.map((s, i) => {
                const fill = clamp01(progress * (total - 1) - i);
                const isActive = i === index;
                const isPast = i < index;
                const last = i === total - 1;
                return (
                  <li key={s.index} className={cn("relative", !last && "pb-9")}>
                    {!last && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-3 left-[11.5px] top-6 w-px bg-hairline"
                      >
                        <span
                          className="block h-full origin-top bg-booster transition-transform duration-500 ease-out"
                          style={{ transform: `scaleY(${fill})` }}
                        />
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => jumpTo(i)}
                      aria-current={isActive ? "step" : undefined}
                      className="group flex w-full items-center gap-4 text-left"
                    >
                      <span
                        className={cn(
                          "mono relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[9px] transition-all duration-500",
                          isActive
                            ? "border-booster bg-booster text-white ring-4 ring-booster/15"
                            : isPast
                              ? "border-ink bg-ink text-white"
                              : "border-hairline bg-chalk text-graphite group-hover:border-ink",
                        )}
                      >
                        {s.index}
                      </span>
                      <span
                        className={cn(
                          "text-[15px] font-semibold leading-6 transition-colors duration-300",
                          isActive ? "text-ink" : "text-graphite group-hover:text-ink",
                        )}
                      >
                        {s.rail}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* Dynamic telemetry readout */}
            <div className="liquid-panel mt-10 overflow-hidden">
              <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
                <span className="mono text-[9px] text-ink">
                  Live Stage // {pad(index + 1)} of {pad(total)}
                </span>
                <span className="mono flex items-center gap-1.5 text-[8.5px] text-booster">
                  <span className="live-dot h-[5px] w-[5px] rounded-full bg-booster" />
                  Live
                </span>
              </div>

              <div key={stage.index} className="swap-in grid grid-cols-2 gap-4 p-4">
                <TelemetryField label="Output artifact" value={stage.telemetry.output} />
                <TelemetryField label="Target benchmark" value={stage.telemetry.benchmark} />
              </div>

              <div className="border-t border-hairline px-4 py-3.5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="mono text-[8.5px] text-graphite">Readiness</span>
                  <span className="mono tnum text-[9px] text-ink">
                    {stage.telemetry.readiness}%
                  </span>
                </div>
                <div className="h-[3px] w-full overflow-hidden rounded-full bg-hairline" aria-hidden="true">
                  <div
                    className="h-full bg-booster transition-[width] duration-700 ease-out"
                    style={{ width: `${stage.telemetry.readiness}%` }}
                  />
                </div>

                <div className="mt-3.5 flex items-center justify-between">
                  <span className="mono text-[8.5px] text-graphite">Status</span>
                  <span
                    key={stage.index}
                    className="swap-in mono rounded-full border border-cobalt bg-white/50 px-2 py-1 text-[8.5px] text-cobalt"
                  >
                    {stage.telemetry.status}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* ── RIGHT · four scroll-choreographed stage cards ────────── */}
          <div className="mt-24 space-y-24 lg:col-span-7 lg:mt-0">
            {CAREER_STAGES.map((s, i) => {
              const active = i === index;
              return (
                <article
                  key={s.index}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  id={`stage-${s.index}`}
                  aria-labelledby={`stage-${s.index}-title`}
                  className={cn(
                    "stage-card squircle relative overflow-hidden border border-hairline bg-chalk p-6 transition-opacity duration-700 sm:p-10",
                    active ? "lg:opacity-100" : "lg:opacity-60",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-3 -top-12 select-none font-mono text-[210px] font-normal leading-none tracking-[-0.06em] text-sand"
                  >
                    {s.index}
                  </span>

                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 top-0 h-[2px] origin-left bg-booster transition-transform duration-700 ease-out",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="mono text-[9.5px] text-graphite">
                      Stage {s.index} // 04
                    </span>
                    <span className="mono text-[9px] text-ink">{s.kicker}</span>
                  </div>

                  <h3
                    id={`stage-${s.index}-title`}
                    className="relative z-10 mt-8 max-w-[20ch] font-display text-[clamp(2rem,3.4vw,2.75rem)] leading-[1.04] tracking-[-0.025em] text-ink"
                  >
                    {s.title}
                  </h3>

                  <p className="relative z-10 mt-5 max-w-xl text-[15.5px] leading-[1.65] text-graphite">
                    {s.body}
                  </p>

                  <div className="relative z-10 mt-10">
                    <StageArtifact index={i} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
