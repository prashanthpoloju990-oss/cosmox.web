import { useState } from "react";
import { cn } from "@/utils/cn";
import {
  LAUNCHES,
  NEXT_LAUNCH,
  launchDateLabel,
  splitCountdown,
  type Launch,
} from "@/data/news";
import { useNow } from "@/hooks/useNewsState";
import { ExternalIcon } from "@/components/app/opportunities/OpportunityIcons";
import { BellIcon, ChevronIcon } from "./NewsIcons";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const pad = (n: number) => String(n).padStart(2, "0");

function shortCountdown(ms: number): string {
  const c = splitCountdown(ms);
  if (c.done) return "Launch window open";
  if (c.days > 0) return `in ${c.days}d ${c.hours}h`;
  return `in ${c.hours}h ${c.minutes}m`;
}

interface Props {
  launches: Launch[];
  active: Launch;
  reminders: string[];
  onSelect: (id: string) => void;
  onToggleReminder: (launch: Launch) => void;
}

export function LaunchShowcase({ launches, active, reminders, onSelect, onToggleReminder }: Props) {
  const now = useNow(1000);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const countdown = splitCountdown(active.launchAt - now);
  const isNext = active.id === NEXT_LAUNCH.id;
  const reminderOn = reminders.includes(active.id);

  const timerLabel = countdown.done
    ? "Launch window is open now"
    : `Launch in ${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes`;

  const boxes = [
    { value: countdown.days, label: "Days" },
    { value: countdown.hours, label: "Hrs" },
    { value: countdown.minutes, label: "Min" },
    { value: countdown.seconds, label: "Sec" },
  ];

  return (
    <section aria-label="Upcoming rocket launches" className="reveal" style={{ animationDelay: "60ms" }}>
      <div className="relative overflow-hidden rounded-3xl border border-hairline bg-ink p-4 text-white shadow-[0_34px_70px_-46px_rgba(20,21,24,0.85)] sm:p-6 lg:p-7">
        {/* faint dark grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #26282E 1px, transparent 1px), linear-gradient(to bottom, #26282E 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(120% 90% at 0% 0%, #000 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(120% 90% at 0% 0%, #000 30%, transparent 75%)",
          }}
        />

        <div className="relative grid gap-6 lg:grid-cols-[1.08fr_1fr] lg:gap-8">
          {/* Info column */}
          <div className="order-2 flex flex-col lg:order-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="liquid-chip-dark mono inline-flex items-center gap-2 px-3 py-1.5 text-[9.5px]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-booster opacity-70 [animation:cx-ping_2s_ease-out_infinite]" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-booster" />
                </span>
                {isNext ? "Next upcoming launch" : "Upcoming launch"}
              </span>
              <span className="liquid-chip-dark mono px-3 py-1.5 text-[9.5px] text-white/90">{active.agency}</span>
            </div>

            <div key={active.id} className="swap-in">
              <h2 className="mt-5 font-display text-[32px] leading-[1.04] tracking-[-0.025em] text-white sm:text-[40px]">
                {active.title}
              </h2>
              <p className="mono mt-2 text-[9.5px] text-white/50">{launchDateLabel(active.launchAt)} IST</p>

              <div role="timer" aria-label={timerLabel} className="mt-6 grid grid-cols-4 gap-2 sm:gap-2.5">
                {boxes.map((box) => (
                  <div
                    key={box.label}
                    className="rounded-2xl border border-white/15 bg-white/[0.07] px-2 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md sm:py-3.5"
                  >
                    <p aria-hidden="true" className="mono tnum text-[24px] font-medium leading-none text-white sm:text-[30px]">
                      {pad(box.value)}
                    </p>
                    <p aria-hidden="true" className="mono mt-1.5 text-[8.5px] text-white/55">
                      {box.label}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-[14.5px] leading-[1.6] text-[#D1D5DB]">{active.summary}</p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2.5 lg:mt-auto lg:pt-6">
              <button
                type="button"
                aria-pressed={reminderOn}
                onClick={() => onToggleReminder(active)}
                className={cn(
                  "inline-flex h-12 items-center gap-2 px-5 text-[14px] font-semibold",
                  reminderOn ? "liquid-cobalt text-white" : "liquid-primary",
                )}
              >
                {reminderOn ? (
                  "✓ Reminder Set"
                ) : (
                  <>
                    Set Launch Reminder
                    <BellIcon className="h-4 w-4" />
                  </>
                )}
              </button>
              <button
                type="button"
                aria-expanded={detailsOpen}
                aria-controls="mission-details"
                onClick={() => setDetailsOpen((value) => !value)}
                className="liquid-dark inline-flex h-12 items-center gap-2 px-5 text-[14px] font-medium"
              >
                Mission Details
                <ChevronIcon
                  className={cn("h-4 w-4 transition-transform duration-500", detailsOpen && "rotate-180")}
                />
              </button>
            </div>
          </div>

          {/* Photo column: all launch photos stacked so switching cross-fades */}
          <div className="relative order-1 min-h-[220px] overflow-hidden rounded-2xl border border-white/10 sm:min-h-[300px] lg:order-2 lg:min-h-[400px]">
            {LAUNCHES.map((launch) => (
              <img
                key={launch.id}
                src={launch.image}
                alt={launch.id === active.id ? launch.imageAlt : ""}
                aria-hidden={launch.id !== active.id}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700",
                  launch.id === active.id ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
                )}
                style={{ transitionTimingFunction: EASE }}
              />
            ))}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 80% at 50% 110%, rgba(217,78,31,0.32), transparent 60%), linear-gradient(180deg, rgba(20,21,24,0.35) 0%, transparent 35%, transparent 60%, rgba(20,21,24,0.7) 100%)",
              }}
            />
            <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-white/50" />
            <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-white/50" />
            <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-white/50" />
            <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-white/50" />
            <p className="mono absolute bottom-4 left-5 text-[8.5px] text-white/75">Sample feed preview</p>
          </div>
        </div>

        {/* Mission details */}
        <div
          id="mission-details"
          inert={!detailsOpen}
          className={cn(
            "relative grid transition-[grid-template-rows,opacity] duration-500",
            detailsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
          style={{ transitionTimingFunction: EASE }}
        >
          <div className="overflow-hidden">
            <div key={active.id} className="mt-6 border-t border-white/10 pt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <p className="mono text-[9.5px] text-white/50">About this mission</p>
                  <dl className="mt-3 grid grid-cols-2 gap-2">
                    {active.facts.map((fact) => (
                      <div key={fact.label} className="rounded-2xl border border-white/10 bg-white/[0.05] px-3.5 py-3">
                        <dt className="mono text-[8px] text-white/50">{fact.label}</dt>
                        <dd className="mt-1 text-[13px] font-medium leading-snug text-white">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <p className="mono text-[9.5px] text-white/50">What to watch for</p>
                  <ol className="mt-3 space-y-2.5">
                    {active.watchFor.map((step, index) => (
                      <li key={step.title} className="flex gap-3">
                        <span className="mono mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-booster text-[9px] text-white">
                          {index + 1}
                        </span>
                        <p className="text-[13.5px] leading-[1.55] text-[#D1D5DB]">
                          <span className="font-semibold text-white">{step.title}.</span> {step.body}
                        </p>
                      </li>
                    ))}
                  </ol>
                  <a
                    href={active.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="liquid-dark mt-5 inline-flex h-10 items-center gap-2 px-4 text-[13px] font-medium"
                  >
                    {active.watchLabel}
                    <ExternalIcon className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Launch switcher */}
      {launches.length > 1 && (
        <div role="group" aria-label="Choose a launch" className="mt-3 grid gap-2.5 sm:grid-cols-3">
          {launches.map((launch) => {
            const on = launch.id === active.id;
            const hasReminder = reminders.includes(launch.id);
            return (
              <button
                key={launch.id}
                type="button"
                aria-pressed={on}
                onClick={() => onSelect(launch.id)}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl border bg-chalk px-4 py-3 text-left transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5",
                  on
                    ? "border-booster/60 shadow-[0_0_0_3px_rgba(217,78,31,0.12)]"
                    : "border-hairline hover:border-ink/25",
                )}
                style={{ transitionTimingFunction: EASE }}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-300",
                    on ? "bg-booster" : "bg-hairline group-hover:bg-graphite/40",
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold text-ink">{launch.short}</span>
                  <span className="mono mt-0.5 block truncate text-[8.5px] text-graphite">
                    {launch.agency} • {shortCountdown(launch.launchAt - now)}
                  </span>
                </span>
                {hasReminder && (
                  <span className="shrink-0 text-cobalt" title="Reminder set">
                    <BellIcon className="h-4 w-4" />
                    <span className="sr-only">Reminder set</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
