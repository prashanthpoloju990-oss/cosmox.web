import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import {
  BRANCH_PRESETS,
  MILESTONES,
  OPPORTUNITIES,
  SQUAD,
  type BranchPresetId,
} from "@/data/demoWorkspace";
import { ArrowRight, BrandMark, CheckSeal, Crosshair } from "@/components/Icons";
import { navigateToAuth } from "@/utils/authNavigation";

/**
 * Cosmox Demo Workspace overlay.
 * Opened from anywhere via: window.dispatchEvent(new Event("cosmox:demo"))
 * The AI planner may attach a saved roadmap: new CustomEvent("cosmox:demo", { detail: { flightCode } })
 */
export function DemoWorkspace() {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [entered, setEntered] = useState(false);
  const [name, setName] = useState("Aarav Sharma");
  const [branch, setBranch] = useState<BranchPresetId>("CSE-DS");
  const [checked, setChecked] = useState<boolean[]>([true, false, false, false]);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [lockedPlan, setLockedPlan] = useState<string | null>(null);
  const [pinged, setPinged] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const closeTimer = useRef(0);
  const toastTimer = useRef(0);
  const nameRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const openOverlay = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setMounted(true);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setShown(true)),
    );
  }, []);

  const closeOverlay = useCallback(() => {
    setShown(false);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setMounted(false);
      setEntered(false);
      setName("Aarav Sharma");
      setBranch("CSE-DS");
      setChecked([true, false, false, false]);
      setBookmarks({});
      setLockedPlan(null);
      setPinged(false);
      setToast(null);
      returnFocusRef.current?.focus({ preventScroll: true });
    }, 300);
  }, []);

  /* Global trigger: any "Demo Login" / "Save Roadmap" button on the page */
  useEffect(() => {
    const onDemo = (e: Event) => {
      const detail = (e as CustomEvent<{ flightCode?: string }>).detail;
      if (detail?.flightCode) setLockedPlan(detail.flightCode);
      openOverlay();
    };
    window.addEventListener("cosmox:demo", onDemo);
    return () => window.removeEventListener("cosmox:demo", onDemo);
  }, [openOverlay]);

  /* Scroll-lock + Escape-to-close while mounted */
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
      if (e.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, closeOverlay]);

  /* Focus the name field once the sign-in card is visible */
  useEffect(() => {
    if (mounted && shown && !entered) {
      const id = window.setTimeout(
        () => nameRef.current?.focus({ preventScroll: true }),
        320,
      );
      return () => window.clearTimeout(id);
    }
  }, [mounted, shown, entered]);

  useEffect(
    () => () => {
      window.clearTimeout(closeTimer.current);
      window.clearTimeout(toastTimer.current);
    },
    [],
  );

  const flash = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const selectBranch = (id: BranchPresetId) => {
    setBranch(id);
    setChecked([true, false, false, false]);
  };

  const toggleMilestone = (i: number) => {
    setChecked((prev) => {
      const next = prev.map((v, j) => (j === i ? !v : v));
      const done = next.filter(Boolean).length;
      if (done === next.length) {
        window.setTimeout(
          () => flash("TRACK COMPLETE — READINESS 100% • MENTOR REVIEW QUEUED"),
          350,
        );
      }
      return next;
    });
  };

  const toggleBookmark = (id: string, title: string) => {
    setBookmarks((prev) => {
      const on = !prev[id];
      window.setTimeout(
        () => flash(on ? `BOOKMARKED — ${title.toUpperCase()}` : `REMOVED — ${title.toUpperCase()}`),
        60,
      );
      return { ...prev, [id]: on };
    });
  };

  const pingSquad = () => {
    setPinged(true);
    flash("SQUAD PINGED — 3/4 CREW ONLINE • STANDUP 19:00 IST");
    window.setTimeout(() => setPinged(false), 2600);
  };

  const handleEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      nameRef.current?.focus();
      flash("ENTER YOUR NAME TO ISSUE A CADET PASS");
      return;
    }
    setEntered(true);
    flash(`WELCOME ABOARD, ${name.trim().split(" ")[0].toUpperCase()} — DAY 01 SYNCED`);
  };

  if (!mounted) return null;

  const preset = BRANCH_PRESETS.find((p) => p.id === branch) ?? BRANCH_PRESETS[0];
  const milestones = MILESTONES[branch];
  const doneCount = checked.filter(Boolean).length;
  const score = Math.round((doneCount / milestones.length) * 100);
  const firstName = (name.trim().split(" ")[0] || "CADET").toUpperCase();

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={entered ? "Cosmox demo workspace" : "Demo sign in"}
      className="demo-overlay fixed inset-0 z-[100]"
    >
      {/* backdrop */}
      <div
        aria-hidden="true"
        onClick={closeOverlay}
        className={cn(
          "absolute inset-0 bg-ink/70 backdrop-blur-[18px] transition-opacity duration-300",
          shown ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="relative h-full overflow-y-auto">
        {!entered ? (
          /* ── STEP A · Quick Demo Sign-In ─────────────────────── */
          <div
            className="flex min-h-full items-center justify-center p-4 sm:p-8"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeOverlay();
            }}
          >
            <div
              className={cn(
                "liquid-modal relative w-full max-w-[480px] overflow-hidden transition-all duration-300",
                shown
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-8 scale-[0.97] opacity-0",
              )}
            >
              <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-ink/20" />
              <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-ink/20" />
              <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-ink/20" />
              <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-ink/20" />

              {/* header bar */}
              <div className="flex items-center justify-between gap-3 border-b border-hairline bg-stone px-5 py-2.5">
                <span className="mono text-[9px] text-ink">
                  Cosmox Cockpit // Demo Access
                </span>
                <span className="mono flex items-center gap-1.5 text-[8.5px] text-booster">
                  <span className="live-dot h-[5px] w-[5px] rounded-full bg-booster" />
                  Sandbox Live
                </span>
              </div>

              <form onSubmit={handleEnter} className="px-5 py-6 sm:px-7 sm:py-7">
                <div className="flex items-center gap-3">
                  <BrandMark className="h-9 w-9 shrink-0" />
                  <h2 className="font-display text-[30px] leading-[1.05] text-ink sm:text-[34px]">
                    Enter the Cosmox Cockpit
                  </h2>
                </div>
                <p className="mt-2 text-[13.5px] leading-[1.6] text-graphite">
                  A read-only preview of the Cohort-01 member workspace. No
                  account needed — pick a branch and step inside.
                </p>

                {/* student name */}
                <label
                  htmlFor="demo-name"
                  className="mono mt-6 block text-[9.5px] text-graphite"
                >
                  Student Name
                </label>
                <input
                  ref={nameRef}
                  id="demo-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aarav Sharma"
                  autoComplete="off"
                  maxLength={32}
                  className="glass-input mt-2 h-[44px] w-full px-3.5 text-[15px] font-medium text-ink outline-none placeholder:text-graphite/60"
                />

                {/* branch preset selector */}
                <span className="mono mt-5 block text-[9.5px] text-graphite">
                  1-Click Branch Preset
                </span>
                <div className="mt-2 grid grid-cols-3 gap-2" role="group" aria-label="Branch preset">
                  {BRANCH_PRESETS.map((p) => {
                    const isActive = p.id === branch;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => selectBranch(p.id)}
                        className={cn(
                          "px-2 py-2.5 text-center transition-all duration-200",
                          isActive
                            ? "liquid-ink text-white"
                            : "liquid-secondary text-ink",
                        )}
                      >
                        <span className="mono block text-[10px] leading-tight">
                          {p.id}
                        </span>
                        <span
                          className={cn(
                            "mono mt-1 block text-[8px] leading-tight",
                            isActive ? "text-white/70" : "text-graphite",
                          )}
                        >
                          {p.id === "ECE" ? "3rd Year" : "2nd Year"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mono mt-2 text-[8.5px] text-cobalt" aria-live="polite">
                  → {preset.code} · {preset.track}
                </p>

                {/* actions */}
                <button
                  type="submit"
                  className="liquid-primary group mt-6 inline-flex h-[48px] w-full items-center justify-center gap-2.5 px-6 text-[15px] font-semibold"
                >
                  Enter Demo Workspace
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[4px]" />
                </button>
                <button
                  type="button"
                  onClick={closeOverlay}
                  className="mono mx-auto mt-4 block text-[10px] text-graphite underline-offset-4 transition-colors hover:text-ink hover:underline"
                >
                  ← Back to Landing Page
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeOverlay();
                    window.setTimeout(() => navigateToAuth("signin"), 340);
                  }}
                  className="mono mx-auto mt-2 block text-[9px] text-cobalt underline-offset-4 hover:underline"
                >
                  Sign in or create an account →
                </button>
              </form>

              <div className="flex items-center justify-between border-t border-hairline bg-stone px-5 py-2.5">
                <span className="mono text-[8.5px] text-graphite">
                  Demo Mode · Nothing Leaves Browser
                </span>
                <span className="mono text-[8.5px] text-graphite">v1.0</span>
              </div>
            </div>
          </div>
        ) : (
          /* ── STEP B · Member Dashboard Preview ───────────────── */
          <div
            className={cn(
              "min-h-full bg-canvas transition-all duration-300",
              shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
          >
            {/* top bar */}
            <div className="liquid-nav sticky top-0 z-10 border-b border-hairline">
              <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-3 px-5 py-3 sm:px-8">
                <span className="liquid-ink mono inline-flex items-center gap-2 px-2.5 py-1.5 text-[9px] text-white">
                  <span className="live-dot h-[5px] w-[5px] rounded-full bg-booster" />
                  Cosmox Workspace // Demo Mode
                </span>
                <span className="liquid-chip mono inline-flex items-center gap-2 px-2.5 py-1.5 text-[9px] text-ink">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cobalt text-[7px] text-white">
                    {firstName.slice(0, 1)}
                  </span>
                  {name.trim() || "Cadet"} · {preset.id}
                </span>
                <span className="mono hidden text-[9px] text-graphite md:inline">
                  Day 01 // {preset.track}
                </span>
                <button
                  type="button"
                  onClick={closeOverlay}
                  className="liquid-secondary group ml-auto inline-flex h-[36px] items-center gap-2 px-4 text-[13px] font-medium"
                >
                  Exit Demo
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]">
                    ↗
                  </span>
                </button>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8 lg:py-10">
              {/* greeting row */}
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="mono flex items-center gap-2 text-[10px] text-graphite">
                    <Crosshair className="h-2.5 w-2.5 text-booster" />
                    Cadet Dashboard // {preset.code}
                  </p>
                  <h2 className="mt-3 font-display text-[clamp(2rem,4vw,2.9rem)] leading-[1.04] text-ink">
                    Morning, <em className="italic text-booster">{firstName.toLowerCase()}</em> — here&apos;s your orbit.
                  </h2>
                </div>
                <div className="flex flex-col items-start gap-1.5 sm:items-end">
                  {lockedPlan ? (
                    <span className="liquid-chip mono inline-flex items-center gap-1.5 border-cobalt px-2.5 py-1.5 text-[9px] text-cobalt">
                      <CheckSeal className="h-3.5 w-3.5" />
                      Roadmap Locked · {lockedPlan}
                    </span>
                  ) : (
                    <span className="liquid-chip mono px-2.5 py-1.5 text-[9px] text-graphite">
                      No Saved Roadmap Yet · Try AI Co-Pilot ↓
                    </span>
                  )}
                  <span className="mono text-[9px] text-graphite">
                    Synced 12 FEB 2026 · 04:12 UTC
                  </span>
                </div>
              </div>

              {/* 3-column workspace grid */}
              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* 1 · 90-day track checklist */}
                <section
                  aria-label="90-day track checklist"
                  className="workspace-panel squircle swap-in flex flex-col border border-hairline bg-chalk"
                  style={{ animationDelay: "60ms" }}
                >
                  <div className="flex items-center justify-between border-b border-hairline bg-stone px-4 py-2.5">
                    <span className="mono text-[9px] text-ink">
                      My 90-Day Track Checklist
                    </span>
                    <span className="mono text-[8.5px] text-graphite">
                      {doneCount}/{milestones.length} Done
                    </span>
                  </div>

                  <div className="border-b border-hairline px-4 py-4">
                    <div className="flex items-center justify-between">
                      <span className="mono text-[9px] text-graphite">Readiness Score</span>
                      <span className="mono tnum text-[20px] leading-none text-ink">
                        {score}%
                      </span>
                    </div>
                    <div className="mt-2.5 h-[5px] w-full overflow-hidden rounded-full bg-hairline" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label="Readiness score">
                      <div
                        className="h-full bg-booster transition-[width] duration-500 ease-out"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <p className="mono mt-2 text-[8.5px] text-graphite">
                      {preset.track} · {preset.id}
                    </p>
                  </div>

                  <ul className="flex-1 space-y-2 p-4">
                    {milestones.map((m, i) => {
                      const on = checked[i];
                      return (
                        <li key={m.id}>
                          <button
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggleMilestone(i)}
                            className={cn(
                              "liquid-secondary flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors duration-200",
                              on
                                ? "bg-stone/80"
                                : "hover:border-ink",
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={cn(
                                "mt-[2px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
                                on ? "border-booster bg-booster text-white" : "border-graphite bg-chalk",
                              )}
                            >
                              {on && (
                                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                                  <path d="M2 6.2 4.8 9 10 3" stroke="currentColor" strokeWidth="1.8" />
                                </svg>
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span
                                className={cn(
                                  "block text-[13.5px] font-semibold leading-snug transition-colors",
                                  on ? "text-graphite line-through decoration-hairline" : "text-ink",
                                )}
                              >
                                {m.title}
                              </span>
                              <span className="mt-0.5 block text-[12px] leading-snug text-graphite">
                                {m.meta}
                              </span>
                            </span>
                            <span className="mono shrink-0 text-[8px] text-graphite">{m.tag}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                {/* 2 · matched opportunities */}
                <section
                  aria-label="Matched opportunities"
                  className="workspace-panel squircle swap-in flex flex-col border border-hairline bg-chalk"
                  style={{ animationDelay: "140ms" }}
                >
                  <div className="flex items-center justify-between border-b border-hairline bg-stone px-4 py-2.5">
                    <span className="mono text-[9px] text-ink">
                      Matched Opportunities
                    </span>
                    <span className="mono text-[8.5px] text-cobalt">Eligibility-Filtered</span>
                  </div>

                  <div className="flex-1 space-y-3 p-4">
                    {OPPORTUNITIES.map((o) => {
                      const saved = !!bookmarks[o.id];
                      return (
                        <article key={o.id} className="squircle-inner border border-hairline bg-canvas p-4">
                          <div className="flex items-center justify-between gap-2">
                            <span className="mono text-[8.5px] text-graphite">{o.org}</span>
                            <span className="mono text-[8.5px] font-semibold text-booster">
                              {o.deadline}
                            </span>
                          </div>
                          <h3 className="mt-2 text-[16px] font-semibold leading-snug text-ink">
                            {o.title}
                          </h3>
                          <p className="mt-1 text-[12.5px] text-graphite">{o.criteria}</p>
                          <p className="liquid-chip mono mt-2.5 inline-block border-cobalt/40 px-2 py-1 text-[8.5px] text-cobalt">
                            {o.fit[branch]}
                          </p>
                          <button
                            type="button"
                            aria-pressed={saved}
                            onClick={() => toggleBookmark(o.id, o.title)}
                            className={cn(
                              "mono mt-3 flex h-[34px] w-full items-center justify-center gap-2 text-[9px] transition-all duration-200",
                              saved
                                ? "liquid-cobalt text-white"
                                : "liquid-secondary text-ink",
                            )}
                          >
                            <svg viewBox="0 0 12 14" className="h-3 w-3" fill="none" aria-hidden="true">
                              <path
                                d="M1 1h10v12l-5-3.5L1 13V1Z"
                                stroke="currentColor"
                                strokeWidth="1.3"
                                strokeLinejoin="round"
                                fill={saved ? "currentColor" : "none"}
                                fillOpacity={saved ? 0.35 : 0}
                              />
                            </svg>
                            {saved ? "Bookmarked ✓" : "Bookmark"}
                          </button>
                        </article>
                      );
                    })}
                  </div>

                  <div className="border-t border-hairline px-4 py-2.5">
                    <span className="mono text-[8.5px] text-graphite">
                      02 of 14 windows match {preset.id} today
                    </span>
                  </div>
                </section>

                {/* 3 · squad status */}
                <section
                  aria-label="Hackathon squad status"
                  className="workspace-panel squircle swap-in flex flex-col border border-hairline bg-chalk"
                  style={{ animationDelay: "220ms" }}
                >
                  <div className="flex items-center justify-between border-b border-hairline bg-stone px-4 py-2.5">
                    <span className="mono text-[9px] text-ink">My Hackathon Squad</span>
                    <span className="mono flex items-center gap-1.5 text-[8.5px] text-booster">
                      <span className="live-dot h-[5px] w-[5px] rounded-full bg-booster" />
                      Active
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="squircle-inner border border-ink bg-canvas p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="liquid-ink mono px-2 py-1 text-[9px] text-white">
                          {SQUAD.id}
                        </span>
                        <span className="mono text-[8.5px] text-graphite">4/4 Filled</span>
                      </div>
                      <p className="mono mt-2.5 text-[10px] leading-relaxed text-ink">
                        {SQUAD.event}
                      </p>
                      <p className="mono mt-1 text-[8.5px] text-cobalt">{SQUAD.problem}</p>
                    </div>

                    <ul className="squircle-inner mt-3 divide-y divide-hairline border border-hairline">
                      {SQUAD.members.map((m) => (
                        <li key={m.code} className="flex items-center gap-3 bg-chalk px-3 py-2.5">
                          <span
                            className={cn(
                              "mono flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[8px]",
                              m.you ? "bg-booster text-white" : "border border-hairline bg-stone text-ink",
                            )}
                          >
                            {m.code}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="mono block text-[9.5px] text-ink">{m.role}</span>
                            <span className="mono block text-[8px] text-graphite">
                              {m.you ? name.trim() || "Cadet" : `Cadet ${m.code}`} · {m.status}
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className={cn(
                              "h-[7px] w-[7px] shrink-0 rounded-full",
                              m.status === "ONLINE" && "bg-booster",
                              m.status === "IN LAB" && "bg-cobalt",
                              m.status === "REVIEWING" && "bg-graphite",
                            )}
                          />
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={pingSquad}
                      className={cn(
                        "group mt-3 inline-flex h-[42px] w-full items-center justify-center gap-2 text-[14px] font-semibold transition-all duration-200",
                        pinged ? "liquid-cobalt text-white" : "liquid-primary text-white",
                      )}
                    >
                      {pinged ? "Ping Sent ✓" : "Ping Squad"}
                      {!pinged && (
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
                      )}
                    </button>
                    <p className="mono mt-2.5 text-center text-[8.5px] text-graphite">
                      Next standup · Today 19:00 IST · Squad channel
                    </p>
                  </div>
                </section>
              </div>

              {/* dashboard footnote */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
                <p className="mono text-[9px] text-graphite">
                  Demo preview · Milestones, bookmarks &amp; pings reset on exit
                </p>
                <p className="mono text-[9px] text-graphite">
                  Cosmox Workspace // Cohort-01 Sandbox
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* toast */}
      {toast && (
        <div
          role="status"
          className="toast-in liquid-chip-dark absolute bottom-6 left-1/2 z-20 max-w-[calc(100vw-2rem)] px-4 py-2.5"
        >
          <p className="mono text-center text-[9.5px] leading-relaxed text-white">{toast}</p>
        </div>
      )}
    </div>
  );
}
