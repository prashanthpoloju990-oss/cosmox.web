import { useMemo, useRef, type FormEvent } from "react";
import { ArrowRight } from "@/components/Icons";
import {
  buildGuidePlan,
  GUIDE_EXPERIENCE,
  GUIDE_GOALS,
  ISRO_RULES_URL,
  type GuideGoal,
  type GuidePlanOptions,
} from "@/data/careerGuide";
import type { GuideProgress } from "@/hooks/useGuideProgress";
import { cn } from "@/utils/cn";
import { GuideIcon, type GuideIconName } from "./GuideIcon";
import { useGuideTask } from "./useGuideTask";

export type GuideChoices = Pick<GuidePlanOptions, "goal" | "experience">;

const goalIcons: Record<GuideGoal, GuideIconName> = {
  startup: "work",
  isro: "institute",
  hackathon: "trophy",
};

function RoadmapDrawing({ complete, active }: { complete: boolean[]; active: number }) {
  return (
    <svg viewBox="0 0 144 91" className="guide-path-art h-[91px] w-36 shrink-0" fill="none" aria-hidden="true">
      <path d="M5 20h133M5 44h133M5 68h133M22 6v77M70 6v77M118 6v77" stroke="var(--color-hairline)" strokeDasharray="2 4" />
      <path d="M12 72C40 72 42 47 71 45s42 0 61-30" stroke="var(--color-cobalt)" strokeOpacity=".36" strokeWidth="1.3" />
      {[[12, 72], [71, 45], [132, 15]].map(([x, y], index) => (
        <g key={index}>
          <circle cx={x} cy={y} r="7" stroke={complete[index] ? "var(--color-cobalt)" : "var(--color-hairline)"} />
          <circle cx={x} cy={y} r="3.4" fill={complete[index] ? "var(--color-cobalt)" : active === index ? "var(--color-booster)" : "var(--color-chalk)"} stroke={active === index || complete[index] ? "none" : "var(--color-graphite)"} strokeWidth=".7" />
          <text x={x - (index === 2 ? 25 : 5)} y={y + (index === 2 ? -2 : 17)} className="font-mono" fontSize="8" fill="var(--color-graphite)">0{index + 1}</text>
        </g>
      ))}
    </svg>
  );
}

interface RoadmapModeProps {
  options: GuidePlanOptions;
  choices: GuideChoices;
  progress: GuideProgress;
  onChoices: (changes: GuideChoices) => void;
  onGenerate: (choices: GuideChoices) => void;
  onAdd: (options: GuidePlanOptions) => void;
  onHome: () => void;
}

export function RoadmapMode({ options, choices, progress, onChoices, onGenerate, onAdd, onHome }: RoadmapModeProps) {
  const { pending, start } = useGuideTask(600);
  const output = useRef<HTMLElement>(null);
  const plan = useMemo(() => buildGuidePlan(options), [options]);
  const added = progress.homePlan && buildGuidePlan(progress.homePlan).id === plan.id;
  const checked = progress.checks[plan.id] ?? [];
  const total = plan.months.reduce((count, month) => count + month.steps.length, 0);
  const completeMonths = plan.months.map((month) => month.steps.every((step) => checked.includes(step.id)));
  const activeMonth = completeMonths.findIndex((complete) => !complete);
  const changed = choices.goal !== options.goal || choices.experience !== options.experience;

  function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    start(() => {
      onGenerate(choices);
      const section = output.current;
      if (section?.getClientRects().length && section.getBoundingClientRect().top > window.innerHeight - 100) {
        section.scrollIntoView({ block: "start" });
      }
    });
  }

  return (
    <div className="guide-roadmap grid items-start gap-5">
      <form onSubmit={generate} aria-label="Build your roadmap" className="squircle guide-settings min-w-0 border border-hairline bg-chalk p-5 sm:p-6">
        <p className="mono flex items-center gap-2 text-[10px] text-graphite">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-booster" /> Plan settings
        </p>
        <fieldset disabled={pending} className="mt-3 min-w-0">
          <legend className="font-display text-[29px] leading-[1.08] font-normal text-ink sm:text-[32px]">What is your main goal right now?</legend>
          <div className="mt-4 grid gap-2.5">
            {GUIDE_GOALS.map((goal) => (
              <label
                key={goal.id}
                className={cn("guide-goal relative flex cursor-pointer items-center gap-3 rounded-2xl border p-3", choices.goal === goal.id ? "guide-goal-active border-booster" : "border-hairline bg-stone/65 hover:border-graphite/45")}
              >
                <input
                  type="radio"
                  name="guide-goal"
                  value={goal.id}
                  checked={choices.goal === goal.id}
                  onChange={() => onChoices({ ...choices, goal: goal.id })}
                  className="sr-only"
                  aria-label={goal.title}
                />
                <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl border bg-chalk", choices.goal === goal.id ? "border-booster/30 text-booster" : "border-hairline text-graphite")}>
                  <GuideIcon name={goalIcons[goal.id]} className="h-[17px] w-[17px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] leading-[1.4] font-semibold text-ink">{goal.title}</span>
                  <span className="mt-1 block text-[12px] leading-[1.5] text-graphite">{goal.hint}</span>
                </span>
                <span aria-hidden="true" className={cn("grid h-4 w-4 shrink-0 place-items-center rounded-full border bg-chalk", choices.goal === goal.id ? "border-booster" : "border-graphite/40")}>
                  {choices.goal === goal.id && <span className="h-2 w-2 rounded-full bg-booster" />}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset disabled={pending} className="mt-6 min-w-0">
          <legend className="text-sm font-semibold text-ink">Experience level</legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {GUIDE_EXPERIENCE.map((level) => {
              const selected = choices.experience === level.id;
              return (
                <label
                  key={level.id}
                  className={cn("guide-level relative flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] leading-tight font-medium", selected ? "border-cobalt/35 bg-cobalt/[0.08] text-cobalt" : "border-hairline bg-chalk text-graphite hover:border-graphite/40 hover:text-ink")}
                >
                  <input type="radio" name="guide-experience" value={level.id} checked={selected} onChange={() => onChoices({ ...choices, experience: level.id })} className="sr-only" />
                  {selected && <GuideIcon name="check" className="h-3.5 w-3.5 shrink-0" />}
                  {level.label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-6 border-t border-hairline pt-5">
          <button type="submit" disabled={pending} className="liquid-primary flex min-h-11 w-full items-center justify-center gap-2 px-5 py-2 text-[14px] font-semibold">
            {pending ? "Building your plan..." : "Generate My 90-Day Plan"}
            <GuideIcon name="spark" className="h-4 w-4 shrink-0" />
          </button>
          {changed && !pending && <p className="mt-2.5 text-center text-[12px] text-graphite">Generate again to use your new choices.</p>}
        </div>
      </form>

      <section
        ref={output}
        aria-labelledby="guide-plan-title"
        aria-busy={pending}
        className="squircle guide-output relative min-w-0 scroll-mt-12 overflow-hidden border border-hairline bg-chalk p-4 sm:p-5"
      >
        <p className="sr-only" role="status">{pending ? "Building your plan" : `Your 90-day plan: ${plan.title}. ${plan.time}.`}</p>
        <div key={plan.id} className="guide-panel" inert={pending}>
          <div className="overflow-hidden rounded-2xl border border-hairline bg-stone">
            <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
              <div className="min-w-0">
                <p className="mono text-[10px] text-graphite">Your 90-day plan</p>
                <h2 id="guide-plan-title" className="mt-1.5 font-display text-[28px] leading-[1.1] text-ink sm:text-[34px]">{plan.title}</h2>
                <p className="mt-2 flex items-center gap-1.5 text-[12.5px] font-medium text-graphite">
                  <GuideIcon name="clock" className="h-4 w-4 text-cobalt" /> {plan.time}
                </p>
              </div>
              <RoadmapDrawing complete={completeMonths} active={activeMonth} />
            </div>
            <div className="flex items-start gap-2 border-t border-hairline bg-chalk/50 px-4 py-2.5 text-[12px] leading-[1.55] text-cobalt sm:px-5">
              <GuideIcon name="idea" className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                <strong className="font-semibold">Tip:</strong> {plan.note}
                {plan.options.goal === "isro" && <> <a href={ISRO_RULES_URL} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">Check ISRO's rules</a>.</>}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-1">
            <h3 className="text-[15px] font-semibold text-ink">Your next 90 days</h3>
            <div className="flex items-center gap-2.5">
              <span aria-live="polite" className="mono tnum text-[9px] text-graphite">{checked.length} of {total} steps done</span>
              <div className="h-1.5 w-14 overflow-hidden rounded-full bg-stone sm:w-[76px]" role="progressbar" aria-label="Roadmap progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={checked.length}>
                <div className="h-full rounded-full bg-booster transition-[width] duration-[450ms]" style={{ width: `${(checked.length / total) * 100}%` }} />
              </div>
            </div>
          </div>

          <ol className="guide-timeline relative mt-3 grid gap-2.5">
            {plan.months.map((month, index) => (
              <li key={month.title} className="relative grid grid-cols-[28px_minmax(0,1fr)] items-start gap-2.5 sm:grid-cols-[32px_minmax(0,1fr)]">
                <span aria-hidden="true" className={cn(
                  "mono z-[1] mt-3 grid h-7 w-7 place-items-center rounded-full border text-[9px] sm:h-8 sm:w-8",
                  completeMonths[index] ? "border-cobalt/25 bg-cobalt text-white" : index === activeMonth ? "guide-month-current border-booster/30 text-booster-deep" : "border-hairline bg-canvas text-graphite",
                )}>
                  {completeMonths[index] ? <GuideIcon name="check" className="h-4 w-4" /> : `0${index + 1}`}
                </span>
                <section className="rounded-2xl border border-hairline bg-canvas/65 px-3.5 py-3 sm:px-4">
                  <h4 className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[14px] font-semibold text-ink">
                    <span className="mono text-[9px] text-graphite">Month {index + 1}:</span> {month.title}
                  </h4>
                  <ul className="mt-1.5 space-y-0.5">
                    {month.steps.map((step) => {
                      const done = checked.includes(step.id);
                      return (
                        <li key={step.id}>
                          <label className="group flex min-h-8 cursor-pointer items-start gap-2 rounded-lg py-1.5 text-[13px] leading-[1.45]">
                            <input type="checkbox" className="peer sr-only" checked={done} onChange={() => progress.toggleStep(plan.id, step.id)} />
                            <span aria-hidden="true" className={cn(
                              "mt-px grid h-[17px] w-[17px] shrink-0 place-items-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-cobalt peer-focus-visible:ring-offset-2",
                              done ? "border-booster bg-booster text-white" : "border-hairline bg-chalk group-hover:border-cobalt/60",
                            )}>
                              {done && <GuideIcon name="check" className="h-3.5 w-3.5" />}
                            </span>
                            <span className={done ? "text-graphite line-through decoration-graphite/50" : "text-ink"}>{step.label}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-1.5 flex flex-wrap gap-1.5" aria-label="Helpful tools">
                    {month.tools.map((tool) => <span key={tool} className="rounded-full border border-hairline bg-chalk px-2 py-0.5 text-[10.5px] font-medium text-graphite">{tool}</span>)}
                  </div>
                </section>
              </li>
            ))}
          </ol>

          <div className="mt-5 rounded-2xl border border-hairline bg-stone px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="mono flex items-center gap-1.5 text-[9px] text-cobalt"><GuideIcon name="idea" className="h-4 w-4" /> Recommended starter project</p>
              <span className="mono rounded-full border border-hairline bg-chalk px-2 py-0.5 text-[9px] text-graphite">2 weeks</span>
            </div>
            <h3 className="mt-2 font-display text-[26px] leading-[1.1] text-ink">{plan.project.title}</h3>
            <p className="mt-2 text-[13px] leading-[1.6] text-graphite">{plan.project.description}</p>
            <button
              type="button"
              onClick={() => added ? onHome() : onAdd(options)}
              className={cn("group mt-4 inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 text-left text-[13px] font-semibold", added ? "liquid-cobalt" : "liquid-secondary")}
            >
              {added ? "View My Home Checklist" : "Add Plan to My Home Checklist"}
              {added ? <ArrowRight className="h-4 w-4 shrink-0" /> : <GuideIcon name="check" className="h-4 w-4 shrink-0 text-cobalt" />}
            </button>
            {!added && progress.homePlan && <p className="mt-2 text-xs text-graphite">This replaces the plan shown on Home. Your past checks are kept.</p>}
          </div>
        </div>

        {pending && (
          <div className="guide-loading absolute inset-0 z-10 bg-chalk/95 p-5 sm:p-6">
            <div className="rounded-2xl border border-hairline bg-stone p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink"><GuideIcon name="spark" className="h-4 w-4 text-booster" /> Putting your plan together...</p>
              <div className="guide-shimmer mt-4 h-7 w-3/4 rounded-full" />
              <div className="guide-shimmer mt-3 h-3 w-1/3 rounded-full" />
            </div>
            {[1, 2, 3].map((item) => (
              <div key={item} className="mt-4 rounded-2xl border border-hairline bg-canvas p-4">
                <div className="guide-shimmer h-4 w-1/3 rounded-full" />
                <div className="guide-shimmer mt-4 h-3 w-5/6 rounded-full" />
                <div className="guide-shimmer mt-2.5 h-3 w-2/3 rounded-full" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}