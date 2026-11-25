import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/utils/cn";
import { GUIDE_BRANCHES, yearLabel, type GuideBranch } from "@/data/careerGuide";
import { GuideIcon, type GuideIconName } from "./GuideIcon";

export type GuideMode = "roadmap" | "project" | "questions";

export const GUIDE_MODES: { id: GuideMode; label: string; icon: GuideIconName }[] = [
  { id: "roadmap", label: "90-Day Roadmap", icon: "roadmap" },
  { id: "project", label: "Check My Project Idea", icon: "idea" },
  { id: "questions", label: "Quick Career Q&A", icon: "question" },
];

export function ProfileContext({ branch, year, isProfile, onChange }: {
  branch: GuideBranch;
  year: number;
  isProfile: boolean;
  onChange: (branch: GuideBranch) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <div
      ref={root}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          close();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      className="relative z-20 w-full max-w-[408px] shrink-0"
    >
      <div className="guide-context liquid-chip flex min-h-[60px] items-center gap-2 px-2.5 py-2 sm:gap-3 sm:px-2 sm:pl-2.5">
        <span className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border border-cobalt/15 bg-cobalt/[0.07] text-cobalt min-[380px]:grid">
          <GuideIcon name="profile" className="h-[17px] w-[17px]" />
        </span>
        <p aria-live="polite" className="min-w-0 flex-1 pl-1 leading-tight min-[380px]:pl-0">
          <span className="mono block text-[9px] text-graphite">{isProfile ? "Using your profile:" : "Trying a different branch:"}</span>
          <span className="mono mt-1 block text-[9px] leading-[1.5] text-cobalt sm:text-[10px]">
            {GUIDE_BRANCHES[branch]} &bull; {yearLabel(year)}
          </span>
        </p>
        <button
          ref={trigger}
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
          className="liquid-secondary flex min-h-10 shrink-0 items-center gap-1.5 px-3 text-[12px] font-semibold whitespace-nowrap"
        >
          Switch Branch
          <GuideIcon name="chevron" className={cn("h-3.5 w-3.5 transition-transform duration-300", open && "rotate-180")} />
        </button>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="liquid-float guide-panel absolute top-[calc(100%+8px)] right-0 w-full max-w-[255px] p-2"
      >
        <div role="group" aria-label="Choose a branch" className="space-y-1">
          {(Object.keys(GUIDE_BRANCHES) as GuideBranch[]).map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={branch === id}
              onClick={() => { onChange(id); close(); }}
              className={cn(
                "flex min-h-10 w-full items-center justify-between gap-3 rounded-xl px-3 text-left text-[13px] font-semibold transition-colors",
                branch === id ? "bg-cobalt/[0.08] text-cobalt" : "text-ink hover:bg-stone",
              )}
            >
              {GUIDE_BRANCHES[id]}
              {branch === id && <GuideIcon name="check" className="h-4 w-4 shrink-0" />}
            </button>
          ))}
        </div>
        <p className="px-3 pt-2 pb-1 text-[11px] text-graphite">This only changes your guide.</p>
      </div>
    </div>
  );
}

export function GuideTabs({ mode, onChange }: { mode: GuideMode; onChange: (mode: GuideMode) => void }) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = GUIDE_MODES.findIndex((item) => item.id === mode);

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const length = GUIDE_MODES.length;
    const next = event.key === "ArrowRight" ? (index + 1) % length
      : event.key === "ArrowLeft" ? (index + length - 1) % length
        : event.key === "Home" ? 0 : event.key === "End" ? length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    onChange(GUIDE_MODES[next].id);
    buttons.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Career guide tools"
      className="guide-tabs relative grid w-full max-w-[704px] grid-cols-3 rounded-full border border-hairline bg-stone p-1"
    >
      <span className="pointer-events-none absolute inset-1" aria-hidden="true">
        <span
          className="guide-tab-fill block h-full w-1/3 rounded-full bg-booster transition-transform duration-[420ms]"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />
      </span>
      {GUIDE_MODES.map((item, index) => (
        <button
          key={item.id}
          ref={(node) => { buttons.current[index] = node; }}
          type="button"
          role="tab"
          id={`guide-tab-${item.id}`}
          aria-controls={`guide-panel-${item.id}`}
          aria-selected={mode === item.id}
          tabIndex={mode === item.id ? 0 : -1}
          onClick={() => onChange(item.id)}
          onKeyDown={(event) => moveTab(event, index)}
          className={cn(
            "relative flex min-h-[46px] min-w-0 items-center justify-center gap-2 rounded-full px-1.5 py-2 text-[11.5px] leading-[1.3] font-semibold transition-colors duration-300 sm:px-4 sm:text-[13px]",
            mode === item.id ? "text-white" : "text-graphite hover:bg-chalk/55 hover:text-ink",
          )}
        >
          <GuideIcon name={item.icon} className="hidden h-4 w-4 shrink-0 sm:block" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}