import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/utils/cn";
import { navigateApp, navigateToEvent } from "@/utils/appRoute";
import { getSession } from "@/utils/session";
import { ArrowRight } from "@/components/Icons";
import { buildGuidePlan } from "@/data/careerGuide";
import type { GuideProgress } from "@/hooks/useGuideProgress";
import {
  CHECKLIST,
  EVENTS_PREVIEW,
  FOCUS_TITLE,
  INTERNSHIP_PREVIEW,
  LATEST_UPDATE,
  NEXT_LAUNCH_AT,
} from "@/data/appData";

/* ── Helpers ──────────────────────────────────────────────── */

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function greetingFor(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function useCountdown(target: number): string {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, []);

  const remaining = Math.max(0, target - now);
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(days)}D ${pad(hours)}H`;
}

function CheckMark() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden="true">
      <path d="M2 6.2 4.8 9 10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function cardMotion(delay: number): CSSProperties {
  return { animationDelay: `${delay}ms` };
}

/* ── Quiz Data ────────────────────────────────────────────── */

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const DAILY_CHALLENGES: Record<string, QuizQuestion> = {
  "Space Quiz": {
    question: "What is the approximate orbital altitude of the International Space Station?",
    options: ["160 km", "408 km", "1,200 km"],
    correct: 1,
    explanation: "The ISS orbits at roughly 408 km above Earth — well within Low Earth Orbit (LEO).",
  },
  "Coding Puzzle": {
    question: "In Python, what does `len([x for x in range(100) if x % 7 == 0])` return?",
    options: ["14", "15", "13"],
    correct: 1,
    explanation: "Numbers divisible by 7 from 0 to 99: 0, 7, 14 … 98 — that's 15 values (including 0).",
  },
  "Orbit Mini-Game": {
    question: "To move a satellite from low orbit to a higher orbit, what manoeuvre do you perform?",
    options: ["Retrograde burn", "Hohmann transfer", "Gravity assist"],
    correct: 1,
    explanation: "A Hohmann transfer uses two engine burns to move between circular orbits efficiently.",
  },
};

const SPACE_FACT = {
  eyebrow: "TODAY'S SPACE FACT • 1 OF 3",
  headline: "India's AstroSat spotted X-ray flares from a distant neutron star",
  body: "AstroSat, India's first multi-wavelength space telescope, recently captured rapid X-ray bursts from a neutron star 20,000 light-years away — data that helps scientists understand how matter behaves under extreme gravity.",
};

/* ── Today's Knowledge Banner ─────────────────────────────── */

function KnowledgeBanner({ open }: { open: boolean }) {
  return (
    <div
      className="grid transition-[grid-template-rows] duration-500"
      style={{
        gridTemplateRows: open ? "1fr" : "0fr",
        transitionTimingFunction: EASE,
      }}
    >
      <div className="overflow-hidden">
        <div className="mt-3 border-t border-b border-hairline py-5 px-1">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative aspect-video w-full sm:w-64 shrink-0 overflow-hidden rounded-2xl bg-stone shadow-xs">
              <img
                src={LATEST_UPDATE.image}
                alt={LATEST_UPDATE.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <p className="mono text-[9px] font-semibold tracking-wider text-booster uppercase">
                {SPACE_FACT.eyebrow}
              </p>
              <h3 className="mt-1.5 font-display text-[22px] leading-[1.15] tracking-[-0.02em] text-ink sm:text-[24px]">
                {SPACE_FACT.headline}
              </h3>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-graphite">
                {SPACE_FACT.body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Daily Challenges Strip (De-boxed Swiss Editorial) ─────── */

function DailyChallengesStrip({ delay }: { delay: number }) {
  const tabs = Object.keys(DAILY_CHALLENGES);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const challenge = DAILY_CHALLENGES[activeTab];

  function switchTab(tab: string) {
    setActiveTab(tab);
    setSelectedAnswer(null);
  }

  return (
    <section
      aria-label="Daily challenges"
      className="squircle reveal border border-hairline bg-chalk p-5 shadow-xs sm:p-6"
      style={cardMotion(delay)}
    >
      {/* Top Header Row with Typographic Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3.5">
        <div className="flex items-center gap-2">
          <span className="live-dot h-2 w-2 rounded-full bg-booster" />
          <span className="mono text-[10px] font-bold uppercase tracking-wider text-booster">
            DAILY CHALLENGE // 60-SEC DRILL
          </span>
        </div>

        {/* Typographic Mode Switchers */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {tabs.map((tab, idx) => (
            <div key={tab} className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => switchTab(tab)}
                className={cn(
                  "rounded-full px-3 py-1 text-[12px] font-semibold transition-all duration-200",
                  activeTab === tab
                    ? "bg-ink text-white shadow-xs"
                    : "text-graphite hover:bg-stone hover:text-ink",
                )}
              >
                {tab}
              </button>
              {idx < tabs.length - 1 && (
                <span aria-hidden="true" className="text-hairline font-light">
                  /
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Question & Options */}
      <div className="mt-4">
        <p className="text-[15.5px] font-semibold leading-snug text-ink sm:text-[16.5px]">
          {challenge.question}
        </p>

        <div className="mt-3.5 flex flex-wrap gap-2.5">
          {challenge.options.map((option, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrect = i === challenge.correct;
            const answered = selectedAnswer !== null;

            return (
              <button
                key={option}
                type="button"
                disabled={answered}
                onClick={() => setSelectedAnswer(i)}
                className={cn(
                  "rounded-xl border px-4 py-2 text-[13px] font-medium transition-all duration-200",
                  !answered &&
                    "border-hairline bg-canvas/60 text-ink hover:border-graphite/40 hover:bg-white hover:shadow-xs",
                  answered &&
                    isCorrect &&
                    "border-emerald-500/60 bg-emerald-50 text-emerald-800 font-semibold shadow-xs",
                  answered &&
                    isSelected &&
                    !isCorrect &&
                    "border-rose-400/60 bg-rose-50 text-rose-800 font-semibold",
                  answered &&
                    !isSelected &&
                    !isCorrect &&
                    "border-hairline/60 bg-stone/30 text-graphite/60",
                )}
                style={{ transitionTimingFunction: EASE }}
              >
                {option}
                {answered && isCorrect && " ✓"}
                {answered && isSelected && !isCorrect && " ✗"}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <p
            className="mt-3 text-[13px] leading-relaxed text-graphite reveal-fade"
            style={cardMotion(0)}
          >
            {challenge.explanation}
          </p>
        )}
      </div>
    </section>
  );
}

/* ── Career Path Section (open, no card border) ───────────── */

function CareerPathSection({ delay, guideProgress }: { delay: number; guideProgress: GuideProgress }) {
  const [defaultChecks, setDefaultChecks] = useState(() => CHECKLIST.filter((item) => item.done).map((item) => item.id));
  const plan = guideProgress.homePlan ? buildGuidePlan(guideProgress.homePlan) : null;
  const steps = plan ? plan.months.flatMap((month) => month.steps) : CHECKLIST;
  const checked = plan ? guideProgress.checks[plan.id] ?? [] : defaultChecks;
  const completed = checked.length;
  const percent = Math.round((completed / steps.length) * 100);

  function toggle(id: string) {
    if (plan) guideProgress.toggleStep(plan.id, id);
    else setDefaultChecks((previous) => previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]);
  }

  return (
    <section aria-labelledby="career-path-title" className="reveal" style={cardMotion(delay)}>
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="mono text-[9px] tracking-wider text-graphite">
            {plan ? "FROM YOUR 90-DAY PLAN" : "YOUR CURRENT CAREER PATH"}
          </p>
          <h2
            id="career-path-title"
            className="mt-2 font-display text-[26px] leading-[1.1] tracking-[-0.02em] text-ink"
          >
            {plan?.title ?? FOCUS_TITLE}
          </h2>
        </div>
        {plan && (
          <button
            type="button"
            onClick={() => navigateApp("ai-guide")}
            className="group inline-flex items-center gap-1 text-[12px] font-semibold text-cobalt hover:underline"
          >
            View plan <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="mt-5 flex items-center gap-3">
        <span className="text-[13.5px] font-semibold text-ink">
          {completed} of {steps.length} steps done
        </span>
        <span className="mono tnum text-[11px] text-booster">{percent}%</span>
      </div>
      <div
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-hairline"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Career path progress"
      >
        <div
          className="h-full rounded-full bg-booster transition-[width] duration-700"
          style={{ width: `${percent}%`, transitionTimingFunction: EASE }}
        />
      </div>

      {/* Checklist rows — open, hairline-separated */}
      <ul className="mt-6">
        {steps.map((item, i) => {
          const done = checked.includes(item.id);
          return (
            <li
              key={item.id}
              className={cn(
                "py-3.5",
                i < steps.length - 1 && "border-b border-hairline",
              )}
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={done}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center gap-4 text-left group"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                    done ? "border-booster bg-booster text-white" : "border-graphite/40 bg-transparent group-hover:border-ink/50",
                  )}
                >
                  {done && <CheckMark />}
                </span>
                <span
                  className={cn(
                    "min-w-0 flex-1 text-[14.5px] font-medium leading-snug transition-colors duration-200",
                    done ? "text-graphite line-through decoration-hairline" : "text-ink",
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => navigateApp("roadmaps")}
        className="group mt-4 inline-flex items-center gap-2 text-[13.5px] font-semibold text-cobalt transition-colors hover:text-ink"
      >
        Open Full Roadmap
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
      </button>
    </section>
  );
}

/* ── Internships Section (open, hairline-separated) ───────── */

function InternshipsSection({ delay }: { delay: number }) {
  return (
    <section aria-labelledby="internships-title" className="reveal mt-10" style={cardMotion(delay)}>
      <p className="mono text-[9px] tracking-wider text-graphite">PICKED FOR YOUR BRANCH & YEAR</p>
      <h2
        id="internships-title"
        className="mt-2 font-display text-[26px] leading-[1.1] tracking-[-0.02em] text-ink"
      >
        Recommended Internships &amp; Roles
      </h2>

      <div className="mt-5">
        {INTERNSHIP_PREVIEW.map((item, i) => (
          <article
            key={item.id}
            className={cn(
              "py-4",
              i < INTERNSHIP_PREVIEW.length - 1 && "border-b border-hairline",
            )}
          >
            <h3 className="text-[16px] font-semibold leading-snug text-ink">{item.title}</h3>
            <p className="mt-1 text-[13px] leading-snug text-graphite">{item.org}</p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="mono rounded-full border border-cobalt/30 px-2.5 py-0.5 text-[9px] text-cobalt"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                const targetId = item.id === "i1" ? "isro-summer-45" : "skyroot-hardware";
                window.location.hash = `#/app/opportunities?id=${targetId}`;
              }}
              className="group mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-cobalt transition-colors hover:text-ink"
            >
              View Full Details
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-[3px]" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── Events Section (open, hairline-separated) ────────────── */

function EventsSection({ delay }: { delay: number }) {
  const [interested, setInterested] = useState<Record<string, boolean>>({});

  return (
    <section aria-labelledby="events-title" className="reveal" style={cardMotion(delay)}>
      <p className="mono text-[9px] tracking-wider text-graphite">COMING UP</p>
      <h2
        id="events-title"
        className="mt-2 font-display text-[26px] leading-[1.1] tracking-[-0.02em] text-ink"
      >
        Upcoming Hackathons &amp; Events
      </h2>

      <ul className="mt-5">
        {EVENTS_PREVIEW.map((event, i) => {
          const on = !!interested[event.id];
          const eventId = event.id === "e1" ? "evt-01" : event.id === "e2" ? "evt-02" : "evt-03";
          return (
            <li
              key={event.id}
              onClick={() => navigateToEvent(eventId)}
              className={cn(
                "group/evt flex cursor-pointer items-center gap-4 py-4 transition-colors hover:opacity-85",
                i < EVENTS_PREVIEW.length - 1 && "border-b border-hairline",
              )}
            >
              {/* Typographic Date */}
              <div className="w-12 shrink-0">
                <span className="mono block text-[9.5px] font-bold uppercase tracking-wider text-booster leading-none">
                  {event.month}
                </span>
                <span className="mono tnum text-[21px] font-bold leading-tight text-ink">
                  {event.day}
                </span>
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-semibold leading-snug text-ink group-hover/evt:text-booster transition-colors">
                  {event.title}
                </p>
                <p className="mono mt-1 text-[10px] text-graphite">
                  <span
                    className={cn(
                      "font-semibold",
                      event.format === "Online" ? "text-cobalt" : "text-booster",
                    )}
                  >
                    {event.format}
                  </span>{" "}
                  • Student Window
                </p>
              </div>

              {/* Interested toggle */}
              <button
                type="button"
                aria-pressed={on}
                onClick={(e) => {
                  e.stopPropagation();
                  setInterested((prev) => ({ ...prev, [event.id]: !prev[event.id] }));
                }}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-all duration-300 whitespace-nowrap",
                  on ? "liquid-cobalt text-white" : "liquid-secondary text-ink hover:text-cobalt",
                )}
                style={{ transitionTimingFunction: EASE }}
              >
                {on ? "Interested ✓" : "Interested"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ── Launch & Space Update Section ────────────────────────── */

function LaunchSection({ delay }: { delay: number }) {
  const countdown = useCountdown(NEXT_LAUNCH_AT);

  return (
    <section aria-labelledby="latest-title" className="reveal mt-10" style={cardMotion(delay)}>
      <p className="mono text-[9px] tracking-wider text-graphite">LATEST SPACE UPDATE</p>
      <h2
        id="latest-title"
        className="mt-2 font-display text-[26px] leading-[1.1] tracking-[-0.02em] text-ink"
      >
        Next Rocket Launch
      </h2>

      {/* Image */}
      <div className="squircle-media relative mt-4 aspect-video overflow-hidden border border-hairline bg-ink">
        <img
          src={LATEST_UPDATE.image}
          alt={LATEST_UPDATE.alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" aria-hidden="true" />
        <span className="liquid-chip-dark mono absolute left-3 top-3 px-3 py-1.5 text-[9.5px] text-white live-dot">
          NEXT LAUNCH IN {countdown}
        </span>
      </div>

      <p className="mt-4 text-[14px] leading-[1.6] text-graphite">
        <span className="font-semibold text-ink">What you can learn:</span> every launch is a team
        effort — engineers test, check and plan before liftoff.
      </p>

      <button
        type="button"
        onClick={() => navigateApp("news")}
        className="group mt-4 inline-flex items-center gap-2 text-[13.5px] font-semibold text-cobalt transition-colors hover:text-ink"
      >
        Read Space News
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
      </button>
    </section>
  );
}

/* ── Dashboard ────────────────────────────────────────────── */

export function HomeDashboard({ guideProgress }: { guideProgress: GuideProgress }) {
  const session = getSession();
  const firstName = session.name.split(" ")[0];
  const greeting = greetingFor(new Date().getHours());
  const branchLine = `${session.branch} • ${session.year}`.toUpperCase();

  const [knowledgeOpen, setKnowledgeOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* ── 1. Top Greeting + Utility Bar ─────────────────────── */}
      <header className="reveal" style={cardMotion(0)}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Left — Greeting */}
          <div className="min-w-0">
            <h1 className="font-display text-[36px] leading-[1.04] tracking-[-0.025em] text-ink sm:text-[44px]">
              {greeting},{" "}
              <em className="italic text-booster">{firstName}</em>.
              <span className="liquid-chip mono ml-3 inline-flex translate-y-[-4px] px-3 py-1 text-[10px] text-cobalt align-middle">
                {branchLine}
              </span>
            </h1>
          </div>

          {/* Right — Utility group */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Lightbulb knowledge toggle */}
            <button
              type="button"
              aria-pressed={knowledgeOpen}
              onClick={() => setKnowledgeOpen((v) => !v)}
              className={cn(
                "liquid-secondary relative inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-all duration-300",
                knowledgeOpen && "ring-2 ring-cobalt/30",
              )}
            >
              💡
              {!knowledgeOpen && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-booster live-dot" />
              )}
              <span className="hidden sm:inline">Today's Knowledge</span>
            </button>

            {/* Notifications bell */}
            <button
              type="button"
              className="liquid-secondary flex h-10 w-10 items-center justify-center rounded-full text-[16px]"
              aria-label="Notifications"
            >
              🔔
            </button>

            {/* Ask AI Guide */}
            <button
              type="button"
              onClick={() => navigateApp("ai-guide")}
              className="liquid-primary group inline-flex h-10 items-center gap-2 px-5 text-[13.5px] font-semibold text-white"
            >
              Ask AI Guide
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
            </button>
          </div>
        </div>

        {/* Expandable knowledge banner */}
        <KnowledgeBanner open={knowledgeOpen} />
      </header>

      {/* ── 2. Daily Challenges Strip ─────────────────────────── */}
      <DailyChallengesStrip delay={60} />

      {/* ── 3. Two-Column Workspace ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
        {/* Left column */}
        <div className="lg:col-span-7">
          <CareerPathSection delay={120} guideProgress={guideProgress} />
          <InternshipsSection delay={180} />
        </div>

        {/* Right column */}
        <div className="lg:col-span-5">
          <EventsSection delay={150} />
          <LaunchSection delay={210} />
        </div>
      </div>
    </div>
  );
}
