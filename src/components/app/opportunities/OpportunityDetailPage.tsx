import { cn } from "@/utils/cn";
import { ArrowRight, CheckSeal } from "@/components/Icons";
import {
  CATEGORY_LABEL,
  closingLabel,
  dateFromToday,
  formatDate,
  isClosingSoon,
  type Opportunity,
} from "@/data/opportunities";
import {
  BookmarkIcon,
  CalendarPlusIcon,
  CheckIcon,
  ExternalIcon,
} from "./OpportunityIcons";
import { downloadCalendarEvent } from "@/utils/calendar";
import { navigateApp } from "@/utils/appRoute";

interface OpportunityDetailPageProps {
  item: Opportunity;
  saved: boolean;
  prepSteps: number[];
  applied: boolean;
  registered: boolean;
  invites: string[];
  onBack: () => void;
  onToggleSave: (id: string) => void;
  onTogglePrep: (id: string, index: number) => void;
  onToggleApplied: (id: string) => void;
  onToggleRegistered: (id: string) => void;
  onToggleInvite: (id: string, teammateId: string) => void;
  onToast: (message: string) => void;
}

function downloadCalendarFile(item: Opportunity) {
  const session = item.dates[1] ?? item.dates[0];
  const start = dateFromToday(session.inDays);
  start.setHours(19, 0, 0, 0);
  downloadCalendarEvent({
    uid: item.id,
    title: item.title,
    description: `${item.summary} (Official COSMOX Listing)`,
    location: item.location,
    start,
    end: new Date(start.getTime() + 2 * 3600000),
  });
}

export function OpportunityDetailPage({
  item,
  saved,
  prepSteps,
  applied,
  registered,
  invites,
  onBack,
  onToggleSave,
  onTogglePrep,
  onToggleApplied,
  onToggleRegistered,
  onToggleInvite,
  onToast,
}: OpportunityDetailPageProps) {
  const urgent = isClosingSoon(item.closesInDays);
  const daysLeft = Math.max(0, item.closesInDays);
  const windowDays = 30;
  const timeLeft = Math.min(100, Math.round((daysLeft / windowDays) * 100));
  const prepPercent = Math.round((prepSteps.length / item.prep.length) * 100);

  const handleApplyClick = () => {
    if (item.action.kind === "apply") {
      onToggleApplied(item.id);
      window.open(item.action.url, "_blank", "noopener,noreferrer");
      onToast("Opening official portal in a new tab.");
    } else if (item.action.kind === "register") {
      onToggleRegistered(item.id);
      onToast(registered ? "Seat cancelled." : "Seat reserved! Calendar invite ready.");
    } else if (item.action.kind === "teammates") {
      const el = document.getElementById("teammates-section");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="swap-in w-full space-y-8 pb-16">
      {/* ═════════════════════════════════════════════════════════
          1. TOP NAVIGATION STRIP
         ═════════════════════════════════════════════════════════ */}
      <nav
        aria-label="Back to opportunities"
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <button
          type="button"
          onClick={onBack}
          className="liquid-secondary group inline-flex h-11 items-center gap-2 px-5 text-[13.5px] font-semibold text-ink"
        >
          <svg
            viewBox="0 0 16 16"
            className="h-4 w-4 text-booster transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M14 8H3M7 4L3 8L7 12"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Jobs &amp; Events
        </button>

        <div className="flex items-center gap-2.5">
          <span className="liquid-chip mono px-3 py-1 text-[9.5px] text-cobalt">
            {CATEGORY_LABEL[item.category].toUpperCase()}
          </span>
          <span
            className={cn(
              "mono rounded-full px-3 py-1 text-[9.5px] font-semibold",
              urgent ? "bg-booster/10 text-booster" : "bg-stone text-graphite",
            )}
          >
            {closingLabel(item.closesInDays)}
          </span>
        </div>
      </nav>

      {/* ═════════════════════════════════════════════════════════
          2. EDITORIAL HERO HEADER
         ═════════════════════════════════════════════════════════ */}
      <header className="squircle overflow-hidden border border-hairline bg-chalk p-6 shadow-[0_16px_40px_-30px_rgba(20,21,24,0.12)] sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="mono rounded-full bg-cobalt px-3.5 py-1 text-[9.5px] font-medium tracking-wide text-white">
            {item.org.toUpperCase()}
          </span>
          <span className="mono text-[9px] text-graphite">• {item.orgKind}</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
            <CheckSeal className="h-3.5 w-3.5" />
            Verified Opportunity
          </span>
        </div>

        <h1 className="mt-4 font-display text-[34px] leading-[1.08] tracking-[-0.025em] text-ink sm:text-[44px]">
          {item.title}
        </h1>

        <p className="mt-3 max-w-3xl text-[16px] leading-[1.65] text-graphite">
          {item.summary}
        </p>

        {/* Quick Facts Bar */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {item.facts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-2xl border border-hairline bg-stone/70 p-4"
            >
              <p className="mono text-[9px] text-graphite">{fact.label}</p>
              <p className="mt-1 text-[14px] font-semibold text-ink">{fact.value}</p>
            </div>
          ))}
        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════
          3. CLEAN 2-COLUMN WORKSPACE (8 COLS + 4 COLS)
         ═════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* ── LEFT COLUMN (lg:col-span-8): Structured Overview ── */}
        <div className="space-y-8 lg:col-span-8">
          {/* Section 1: What You Will Do */}
          <section
            aria-labelledby="what-you-will-do-heading"
            className="squircle border border-hairline bg-chalk p-6 sm:p-8"
          >
            <p className="mono text-[10px] text-booster">PROGRAM EXPERIENCE</p>
            <h2
              id="what-you-will-do-heading"
              className="mt-1 font-display text-[26px] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[30px]"
            >
              What You Will Do
            </h2>
            <p className="mt-2 text-[14px] leading-[1.6] text-graphite">
              Every verified program in Cosmox is scoped so you gain actual engineering proof-of-work.
            </p>

            <div className="mt-6 space-y-3.5">
              {item.whatYouWillDo.map((task, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-2xl border border-hairline bg-canvas/60 p-4 transition-colors hover:border-graphite/35"
                >
                  <span className="mono mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cobalt text-[11px] font-bold text-white">
                    0{i + 1}
                  </span>
                  <p className="text-[14.5px] leading-[1.6] text-ink">{task}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Who Can Apply (Eligibility) */}
          <section
            aria-labelledby="who-can-apply-heading"
            className="squircle border border-hairline bg-chalk p-6 sm:p-8"
          >
            <p className="mono text-[10px] text-booster">REQUIREMENTS</p>
            <h2
              id="who-can-apply-heading"
              className="mt-1 font-display text-[26px] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[30px]"
            >
              Who Can Apply
            </h2>

            <ul className="mt-5 space-y-3">
              {item.whoCanApply.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-hairline bg-canvas/40 p-3.5"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700">
                    ✓
                  </span>
                  <span className="text-[14px] leading-[1.55] text-ink">{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-hairline pt-5">
              <span className="mono text-[9px] text-graphite">Eligible Skills &amp; Stacks:</span>
              {item.skills.map((skill) => (
                <span
                  key={skill}
                  className="liquid-chip mono px-3 py-1 text-[9px] text-ink"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Section 3: 3-Step Practical Prep Checklist */}
          <section
            aria-labelledby="prep-checklist-heading"
            className="squircle border border-hairline bg-chalk p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mono text-[10px] text-booster">ACTION PLAN</p>
                <h2
                  id="prep-checklist-heading"
                  className="mt-1 font-display text-[26px] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[30px]"
                >
                  3-Step Prep Checklist
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="mono text-[9.5px] font-semibold text-graphite">
                  {prepSteps.length} of {item.prep.length} steps ready
                </span>
                <span className="mono text-[9.5px] font-bold text-booster">
                  • {prepPercent}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div
              className="mt-4 h-1.5 overflow-hidden rounded-full bg-stone"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={prepPercent}
              aria-label="Preparation checklist progress"
            >
              <div
                className="h-full rounded-full bg-booster transition-[width] duration-500 ease-out"
                style={{ width: `${prepPercent}%` }}
              />
            </div>

            <ul className="mt-5 space-y-3">
              {item.prep.map((step, i) => {
                const checked = prepSteps.includes(i);
                return (
                  <li key={i}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      onClick={() => onTogglePrep(item.id, i)}
                      className={cn(
                        "group flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-300",
                        checked
                          ? "border-booster/40 bg-booster/[0.05]"
                          : "border-hairline bg-canvas/60 hover:border-graphite/40",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                          checked
                            ? "border-booster bg-booster text-white shadow-xs"
                            : "border-graphite/40 bg-white group-hover:border-ink",
                        )}
                      >
                        {checked && <CheckIcon className="h-3 w-3" />}
                      </span>
                      <span
                        className={cn(
                          "text-[14px] leading-[1.6]",
                          checked
                            ? "text-graphite line-through decoration-hairline"
                            : "text-ink font-medium",
                        )}
                      >
                        {step}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Section 4: Hackathon Teammates (if available) */}
          {item.teammates && item.teammates.length > 0 && (
            <section
              id="teammates-section"
              aria-labelledby="teammates-heading"
              className="squircle border border-hairline bg-chalk p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="mono text-[10px] text-cobalt">PEER MATCHMAKING</p>
                  <h2
                    id="teammates-heading"
                    className="mt-1 font-display text-[26px] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[30px]"
                  >
                    Find Hackathon Teammates
                  </h2>
                </div>
                <span className="mono rounded-full bg-cobalt/10 px-3 py-1 text-[9px] font-semibold text-cobalt">
                  {item.teammates.length} Students Looking for Squads
                </span>
              </div>

              <p className="mt-2 text-[14px] leading-[1.6] text-graphite">
                Team up across colleges in India. Connect directly with students from complementary branches.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {item.teammates.map((mate) => {
                  const isInvited = invites.includes(mate.id);
                  return (
                    <article
                      key={mate.id}
                      className="flex flex-col justify-between rounded-2xl border border-hairline bg-canvas/60 p-4 transition-all hover:border-cobalt/40"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-ink">{mate.name}</h3>
                          <span className="mono text-[8.5px] text-graphite">
                            {mate.city}
                          </span>
                        </div>
                        <p className="mono mt-1 text-[9px] text-cobalt">
                          {mate.branch} • {mate.year}
                        </p>
                        <p className="mt-2 text-[12.5px] leading-snug text-graphite">
                          Focus: {mate.skill}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleInvite(item.id, mate.id)}
                        className={cn(
                          "mt-4 flex h-8 w-full items-center justify-center gap-1.5 rounded-full text-[11.5px] font-semibold transition-all",
                          isInvited
                            ? "liquid-cobalt text-white"
                            : "liquid-secondary text-ink",
                        )}
                      >
                        {isInvited ? "Squad Invite Sent ✓" : "Invite to Squad +"}
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* Section 5: Timeline Dates */}
          <section
            aria-labelledby="dates-heading"
            className="squircle border border-hairline bg-chalk p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="mono text-[10px] text-booster">SCHEDULE</p>
                <h2
                  id="dates-heading"
                  className="mt-1 font-display text-[26px] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[30px]"
                >
                  Important Timeline Dates
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  downloadCalendarFile(item);
                  onToast("Calendar file (.ics) downloaded.");
                }}
                className="liquid-secondary inline-flex h-9 items-center gap-1.5 px-3.5 text-[12px] font-semibold text-ink"
              >
                <CalendarPlusIcon className="h-3.5 w-3.5 text-cobalt" />
                Add to Calendar (.ics)
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {item.dates.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-hairline bg-canvas/40 px-4 py-3"
                >
                  <span className="text-[14px] font-medium text-ink">{d.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="mono text-[11px] font-semibold text-cobalt">
                      {formatDate(d.inDays)}
                    </span>
                    <span className="mono rounded-full bg-stone px-2 py-0.5 text-[8.5px] text-graphite">
                      in {d.inDays} days
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN (lg:col-span-4 lg:sticky lg:top-6): Pass Card ── */}
        <aside
          aria-label="Application pass card"
          className="squircle lg:sticky lg:top-6 lg:col-span-4 border border-hairline bg-chalk p-6 shadow-[0_20px_48px_-28px_rgba(20,21,24,0.18)] sm:p-7"
        >
          {/* Urgency Counter */}
          <div className="border-b border-hairline pb-4">
            <div className="flex items-center justify-between">
              <span className="mono text-[9px] font-semibold text-graphite">
                DEADLINE WINDOW
              </span>
              <span
                className={cn(
                  "mono text-[10px] font-bold",
                  urgent ? "text-booster" : "text-cobalt",
                )}
              >
                {closingLabel(item.closesInDays)}
              </span>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-stone">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  urgent ? "bg-booster" : "bg-cobalt",
                )}
                style={{ width: `${timeLeft}%` }}
              />
            </div>
          </div>

          {/* Org & Verification Seal */}
          <div className="mt-5 rounded-2xl border border-hairline bg-stone/70 p-4">
            <p className="text-[13.5px] font-semibold text-ink">{item.org}</p>
            <p className="mt-0.5 text-[12px] text-graphite">{item.orgKind}</p>
            <div className="mt-3 flex items-center gap-1.5 text-emerald-800">
              <CheckSeal className="h-4 w-4 text-emerald-600" />
              <span className="mono text-[9px] font-semibold">
                Verified ICRB / IN-SPACe Notice
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleApplyClick}
              className="liquid-primary group flex h-12 w-full items-center justify-center gap-2 rounded-full text-[14px] font-semibold text-white transition-all"
            >
              <span>
                {item.action.kind === "apply"
                  ? applied
                    ? "Applied on Official Site ✓"
                    : "Apply on Official Site"
                  : item.action.kind === "register"
                    ? registered
                      ? "Seat Reserved ✓"
                      : "Reserve Free Seat"
                    : "Find Hackathon Teammates"}
              </span>
              {item.action.kind === "apply" ? (
                <ExternalIcon className="h-3.5 w-3.5" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </button>

            {/* Secondary CTA: Save Opportunity Toggle */}
            <button
              type="button"
              onClick={() => onToggleSave(item.id)}
              aria-pressed={saved}
              className={cn(
                "group flex h-11 w-full items-center justify-center gap-2 rounded-full text-[13px] font-semibold transition-all duration-300",
                saved ? "liquid-cobalt text-white" : "liquid-secondary text-ink",
              )}
            >
              <BookmarkIcon className="h-4 w-4" />
              <span>{saved ? "Saved to My Opportunities ✓" : "Save Opportunity"}</span>
            </button>

            {/* Add to Calendar button */}
            <button
              type="button"
              onClick={() => {
                downloadCalendarFile(item);
                onToast("Deadline added to your calendar file (.ics).");
              }}
              className="liquid-secondary flex h-10 w-full items-center justify-center gap-2 rounded-full text-[12px] font-medium text-graphite hover:text-ink"
            >
              <CalendarPlusIcon className="h-3.5 w-3.5 text-cobalt" />
              Add Deadline to Calendar (.ics)
            </button>
          </div>

          {/* Help & Support note */}
          <div className="mt-7 border-t border-hairline pt-5">
            <p className="mono text-[9px] text-graphite">HAVE QUESTIONS?</p>
            <p className="mt-1 text-[12.5px] leading-[1.6] text-graphite">
              Need assistance preparing your department NOC, cover letter, or portfolio demo for this listing?
            </p>
            <button
              type="button"
              onClick={() => navigateApp("ai-guide")}
              className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-cobalt hover:underline"
            >
              Ask AI Career Guide →
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
