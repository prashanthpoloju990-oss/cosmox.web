import { cn } from "@/utils/cn";
import { launchDateLabel, splitCountdown, type Launch } from "@/data/news";
import { useNow } from "@/hooks/useNewsState";
import { BellIcon, RocketIcon } from "./NewsIcons";

interface Props {
  launches: Launch[];
  activeId: string;
  reminders: string[];
  onView: (id: string) => void;
  onToggleReminder: (launch: Launch) => void;
}

function countdownText(ms: number): string {
  const c = splitCountdown(ms);
  if (c.done) return "Launch window open";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(c.days)}d ${pad(c.hours)}h ${pad(c.minutes)}m`;
}

/** Full list of upcoming launches, shown under the Live Launches filter. */
export function LaunchSchedule({ launches, activeId, reminders, onView, onToggleReminder }: Props) {
  const now = useNow(30000);

  return (
    <section aria-labelledby="schedule-title" className="squircle reveal border border-hairline bg-chalk p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="mono text-[9.5px] text-graphite">Next {launches.length} launches</p>
          <h2 id="schedule-title" className="mt-1.5 font-display text-[28px] leading-tight tracking-[-0.02em] text-ink">
            Full launch schedule
          </h2>
        </div>
        <p className="mono text-[8.5px] text-graphite/70">Sample feed preview • times in IST</p>
      </div>

      <ul className="mt-5 space-y-2.5">
        {launches.map((launch) => {
          const hasReminder = reminders.includes(launch.id);
          const on = launch.id === activeId;
          return (
            <li
              key={launch.id}
              className={cn(
                "flex flex-col gap-3 rounded-2xl border bg-canvas p-3.5 sm:flex-row sm:items-center",
                on ? "border-booster/50" : "border-hairline",
              )}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3.5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink text-white">
                  <RocketIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-ink">{launch.title}</p>
                  <p className="mono mt-0.5 truncate text-[8.5px] text-graphite">
                    {launch.agency} • {launchDateLabel(launch.launchAt)}
                  </p>
                  <p className="mono tnum mt-1 text-[10px] text-booster">{countdownText(launch.launchAt - now)}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  aria-pressed={hasReminder}
                  aria-label={hasReminder ? `Remove reminder for ${launch.short}` : `Set reminder for ${launch.short}`}
                  onClick={() => onToggleReminder(launch)}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 px-3.5 text-[12.5px] font-semibold",
                    hasReminder ? "liquid-cobalt text-white" : "liquid-secondary text-ink",
                  )}
                >
                  <BellIcon className="h-4 w-4" />
                  {hasReminder ? "Reminder set" : "Remind me"}
                </button>
                <button
                  type="button"
                  onClick={() => onView(launch.id)}
                  className="liquid-secondary inline-flex h-10 items-center px-3.5 text-[12.5px] font-semibold"
                >
                  {on ? "Showing" : "View"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
