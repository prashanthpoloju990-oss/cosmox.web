import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { getSession } from "@/utils/session";
import { ArrowRight } from "@/components/Icons";

const STEPS = [
  "Loading your branch roadmap...",
  "Checking upcoming hackathons...",
  "Ready!",
];

const EXIT_AT = 2000;
const EXIT_DURATION = 650;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Two-second welcome after sign-in. The background moves from Carbon Slate to
 * Warm Alabaster, the orbit draws itself, and the screen lifts away at 2.0s.
 */
export function IntroSequence({ onDone }: { onDone: () => void }) {
  const [light, setLight] = useState(false);
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<number[]>([]);
  const exiting = useRef(false);
  const doneRef = useRef(onDone);
  const firstName = getSession().name.split(" ")[0];

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  const finish = () => {
    if (exiting.current) return;
    exiting.current = true;
    timers.current.forEach((id) => window.clearTimeout(id));
    setStep(STEPS.length);
    setLeaving(true);
    timers.current = [window.setTimeout(() => doneRef.current(), EXIT_DURATION)];
  };

  useEffect(() => {
    const schedule = (ms: number, fn: () => void) => {
      timers.current.push(window.setTimeout(fn, ms));
    };
    schedule(250, () => setLight(true));
    schedule(600, () => setStep(1));
    schedule(1250, () => setStep(2));
    schedule(1850, () => setStep(3));
    schedule(EXIT_AT, finish);
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
    // Timers are scheduled once per mount; the intro is re-mounted for replays.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = (Math.min(step, STEPS.length) / STEPS.length) * 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to COSMOX"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-5 transition-[background-color,opacity,transform]",
        light ? "bg-canvas" : "bg-ink",
        leaving
          ? "pointer-events-none -translate-y-[12%] opacity-0 duration-[650ms]"
          : "translate-y-0 opacity-100 duration-[900ms]",
      )}
      style={{ transitionTimingFunction: EASE }}
    >
      <button
        type="button"
        onClick={finish}
        className="liquid-secondary absolute right-5 top-5 inline-flex h-10 items-center gap-1.5 px-4 text-[13px] font-medium sm:right-8 sm:top-8"
      >
        Skip
        <ArrowRight className="h-3.5 w-3.5" />
      </button>

      <div className="flex w-full max-w-[440px] flex-col items-center">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          aria-hidden="true"
          className={cn(
            "h-44 w-44 transition-colors duration-[900ms]",
            light ? "text-ink" : "text-white",
          )}
        >
          <circle cx="100" cy="100" r="92" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" />
          <circle
            cx="100"
            cy="100"
            r="22"
            stroke="currentColor"
            strokeWidth="1.4"
            pathLength={100}
            className="intro-draw"
            style={{ animationDelay: "120ms" }}
          />
          <ellipse
            cx="100"
            cy="100"
            rx="86"
            ry="32"
            transform="rotate(-28 100 100)"
            stroke="#D94E1F"
            strokeWidth="1.6"
            pathLength={100}
            className="intro-draw"
            style={{ animationDelay: "250ms", animationDuration: "1.4s" }}
          />
          <path d="M100 6v16M100 178v16M6 100h16M178 100h16" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
          <circle cx="100" cy="100" r="3" fill="currentColor" />
          <g className="orbit-spin" style={{ transformOrigin: "100px 100px" }}>
            <g transform="rotate(-28 100 100)">
              <circle cx="186" cy="100" r="4.5" fill="#D94E1F" />
            </g>
          </g>
        </svg>

        <div className="liquid-panel reveal mt-4 w-full rounded-[24px] p-7 text-center sm:p-8">
          <p className="mono text-[10px] text-graphite">Cosmox // Welcome</p>
          <h2 className="mt-3 font-display text-[40px] leading-[1.04] tracking-[-0.025em] text-ink sm:text-[44px]">
            Welcome aboard, <em className="italic text-booster">{firstName}</em>
          </h2>

          <ul aria-live="polite" className="mt-6 space-y-3 text-left">
            {STEPS.map((label, i) => {
              const isDone = step > i;
              const isActive = step === i;
              return (
                <li
                  key={label}
                  className={cn(
                    "flex items-center gap-3 transition-opacity duration-500",
                    step < i ? "opacity-40" : "opacity-100",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-500",
                      isDone
                        ? "border-booster bg-booster text-white"
                        : isActive
                          ? "border-booster"
                          : "border-graphite/40",
                    )}
                  >
                    {isDone && (
                      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden="true">
                        <path d="M2 6.2 4.8 9 10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {isActive && <span className="h-2 w-2 animate-pulse rounded-full bg-booster" />}
                  </span>
                  <span className="text-[14.5px] font-medium text-ink">{label}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-hairline" aria-hidden="true">
            <div
              className="h-full rounded-full bg-booster transition-[width] duration-700"
              style={{ width: `${progress}%`, transitionTimingFunction: EASE }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
