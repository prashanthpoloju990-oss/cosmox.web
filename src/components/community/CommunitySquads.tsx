import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/utils/cn";
import { ArrowRight, CheckSeal, Crosshair } from "@/components/Icons";
import {
  OPEN_SQUAD_ROLE,
  PROJECT_PREVIEW,
  PROJECT_REVIEWS,
  SQUAD_HEADER,
  SQUAD_MEMBERS,
  type SquadTab,
} from "@/data/squads";

const VALUES = [
  {
    title: "Cross-Branch Squad Matching",
    body: "Pair your coding skills with hardware, CAD, and orbital-design peers.",
  },
  {
    title: "Built for Hackathons & Projects",
    body: "Form focused 2–4 person teams for ISRO & national space challenges.",
  },
  {
    title: "Proof-of-Work Profiles",
    body: "See what teammates have actually built before you team up.",
  },
];

const TONES: Record<string, string> = {
  orange: "bg-booster/[0.09] text-booster ring-booster/20",
  cobalt: "bg-cobalt/[0.08] text-cobalt ring-cobalt/20",
  teal: "bg-[#2F7D6D]/[0.09] text-[#2F7D6D] ring-[#2F7D6D]/20",
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8.4" r="3.3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 19.5c.7-3.3 3.4-5.1 7-5.1s6.3 1.8 7 5.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8.6 8 5 12l3.6 4m6.8-8L19 12l-3.6 4m-2-9.5-2.8 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 5.5v13M5.5 12h13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function MemberTile({ member }: { member: (typeof SQUAD_MEMBERS)[number] }) {
  return (
    <div className="flex min-w-0 flex-col justify-between rounded-2xl border border-hairline bg-stone/80 p-3.5 sm:p-4">
      <div className="flex items-start gap-2.5">
        <span className={cn("mono grid h-9 w-9 shrink-0 place-items-center rounded-full text-[10px] ring-1", TONES[member.tone])}>
          {member.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold leading-tight text-ink">{member.name}</p>
          <p className="mono mt-1 truncate text-[8.5px] text-graphite">
            {member.branch} • {member.year}
          </p>
        </div>
      </div>
      <p className="mt-auto flex items-start gap-1.5 border-t border-hairline/80 pt-2.5 text-[11.5px] leading-[1.45] text-graphite">
        <CheckIcon className="mt-px h-3 w-3 shrink-0 text-cobalt" />
        {member.skills}
      </p>
    </div>
  );
}

function SquadBuilder({ joined, onJoin }: { joined: boolean; onJoin: () => void }) {
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!joined || !pulseRef.current) return;
    const el = pulseRef.current;
    el.classList.remove("squad-celebrate");
    void el.offsetWidth;
    el.classList.add("squad-celebrate");
  }, [joined]);

  return (
    <div>
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-hairline bg-canvas/70 px-3.5 py-2.5">
        <p className="mono flex min-w-0 items-center gap-2 text-[8.5px] leading-[1.6] text-ink">
          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-cobalt" />
          <span className="truncate">
            {SQUAD_HEADER.event.toUpperCase()} • {SQUAD_HEADER.format.toUpperCase()}
          </span>
        </p>
        <span className="mono inline-flex shrink-0 items-center gap-1.5 rounded-full bg-booster px-2.5 py-1 text-[8px] text-white">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          {SQUAD_HEADER.tag}
        </span>
      </div>

      {/* 2×2 member grid */}
      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {SQUAD_MEMBERS.map((member) => <MemberTile key={member.id} member={member} />)}

        {/* open seat */}
        <div
          ref={pulseRef}
          className={cn(
            "relative flex min-w-0 flex-col justify-between rounded-2xl border-2 border-dashed p-3.5 transition-all duration-500 sm:p-4",
            joined ? "border-cobalt/45 bg-cobalt/[0.045]" : "border-booster/55 bg-booster/[0.035]",
          )}
        >
          <div>
            <div className="flex items-start justify-between gap-2">
              <span className={cn("mono grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1", joined ? "bg-cobalt/[0.08] text-cobalt ring-cobalt/20" : "bg-booster/[0.09] text-booster ring-booster/20")}>
                {joined ? <CheckIcon className="h-4 w-4" /> : <PersonIcon className="h-4 w-4" />}
              </span>
              <span className={cn("mono rounded-full px-2 py-1 text-[7.5px] leading-none", joined ? "bg-cobalt text-white" : "bg-booster text-white")}>
                {joined ? "Spot filled" : "Open spot"}
              </span>
            </div>
            <p className="mt-2.5 flex items-center gap-1.5 text-[13.5px] font-semibold leading-tight text-ink">
              {!joined && <PlusIcon className="h-3.5 w-3.5 shrink-0 text-booster" />}
              {joined ? "You · Frontend / UI" : OPEN_SQUAD_ROLE}
            </p>
            <p className="mt-1.5 text-[11.5px] leading-[1.45] text-graphite">
              {joined ? "All four roles are filled. Your seat is reserved." : "Bring a clean interface for this mapping demo."}
            </p>
          </div>

          <button
            type="button"
            aria-pressed={joined}
            onClick={onJoin}
            className={cn(
              "group mt-3.5 inline-flex min-h-10 w-full items-center justify-center gap-2 px-3.5 py-2 text-[12px] font-semibold transition-all duration-300",
              joined ? "liquid-cobalt" : "liquid-primary",
            )}
          >
            {joined ? (
              <>
                <CheckIcon className="h-3.5 w-3.5" />
                Added to Squad Preview
              </>
            ) : (
              <>
                <span>Join This Squad</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </div>

      <p aria-live="polite" className="mono mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[8.5px] text-graphite">
        <span className="h-1 w-1 rounded-full bg-cobalt" />
        {joined ? "Preview only — no group chat, no spam. Your real squad starts after sign-in." : "Verified students only. Skills are checked before a seat is offered."}
      </p>
    </div>
  );
}

function PeerProjectReview() {
  return (
    <div>
      {/* project card */}
      <div className="squircle-inner border border-hairline bg-canvas/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div className="min-w-0">
            <p className="mono text-[8.5px] text-graphite">Peer build · public repo</p>
            <h4 className="mt-1.5 font-display text-[24px] leading-[1.1] text-ink">
              {PROJECT_PREVIEW.title} <span className="text-[17px] text-graphite">— {PROJECT_PREVIEW.version}</span>
            </h4>
            <p className="mono mt-1.5 text-[9px] text-cobalt">{PROJECT_PREVIEW.stack}</p>
          </div>
          <span className="mono inline-flex shrink-0 items-center gap-1.5 rounded-full border border-cobalt/25 bg-chalk px-2.5 py-1 text-[8px] text-cobalt">
            <CodeIcon className="h-3 w-3" />
            2 REVIEWS
          </span>
        </div>

        <p className="mt-2.5 text-[13px] leading-[1.6] text-graphite">
          {PROJECT_PREVIEW.summary}
        </p>

        <div className="mt-3.5 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-hairline bg-hairline">
          {PROJECT_PREVIEW.metrics.map((metric) => (
            <div key={metric.label} className="min-w-0 bg-chalk px-2 py-2.5">
              <p className="mono tnum text-[13px] leading-none text-ink">{metric.value}</p>
              <p className="mono mt-1.5 text-[7.5px] leading-tight text-graphite">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* feedback bubbles */}
      <ul className="mt-3 space-y-2.5">
        {PROJECT_REVIEWS.map((review) => (
          <li key={review.id} className="flex gap-2.5">
            <span className={cn("mono mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[9px] ring-1", TONES[review.tone])}>
              {review.initials}
            </span>
            <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-hairline bg-stone/80 px-3.5 py-2.5">
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                <p className="text-[12.5px] font-semibold text-ink">{review.name}</p>
                <p className="mono text-[7.5px] text-graphite">{review.branch}</p>
              </div>
              <p className="mt-1 text-[12.5px] leading-[1.55] text-graphite">
                &ldquo;{review.note}&rdquo;
              </p>
              <p className="mono mt-1.5 text-[7.5px] text-graphite/80">{review.time} · VERIFIED BUILDER</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mono mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[8.5px] text-graphite">
        <span className="h-1 w-1 rounded-full bg-cobalt" />
        Reviewers are verified by submitted work — not follower counts.
      </p>
    </div>
  );
}

export function CommunitySquads() {
  const [tab, setTab] = useState<SquadTab>("builder");
  const [joined, setJoined] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const tabs: { id: SquadTab; label: string }[] = [
    { id: "builder", label: "Hackathon Squad Builder" },
    { id: "review", label: "Peer Project Review" },
  ];
  const activeIndex = tabs.findIndex((item) => item.id === tab);

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowRight" ? (index + 1) % tabs.length
      : event.key === "ArrowLeft" ? (index + tabs.length - 1) % tabs.length
        : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    setTab(tabs[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <section
      id="community"
      aria-labelledby="community-title"
      className="relative border-b border-hairline bg-canvas py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ── LEFT · crystal-clear message ─────────────────────── */}
          <div className="reveal min-w-0 lg:col-span-5">
            <p className="mono flex items-center gap-2.5 text-[10px] uppercase text-booster">
              <Crosshair className="h-2.5 w-2.5" />
              02 // Student Crews &amp; Squads
            </p>

            <h2
              id="community-title"
              className="mt-5 font-display text-[clamp(2.5rem,4vw,3.25rem)] leading-[1.05] tracking-[-0.025em] text-ink"
            >
              Stop building alone. Find your{" "}
              <em className="italic text-booster">mission</em> crew.
            </h2>

            <p className="mt-4 max-w-[52ch] text-[16px] leading-[1.65] text-graphite">
              Real space projects take more than one branch. Team up with
              verified CSE, ECE, and Mechanical students for national hackathons
              and starter builds—with zero messy WhatsApp spam.
            </p>

            <ul className="mt-6 space-y-3">
              {VALUES.map((value, index) => (
                <li key={value.title} className="flex gap-3">
                  <span className="mono grid h-6 w-6 shrink-0 place-items-center rounded-full border border-hairline bg-chalk text-[9px] text-cobalt">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold leading-snug text-ink">{value.title}</p>
                    <p className="mt-0.5 text-[13px] leading-[1.6] text-graphite">{value.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ── RIGHT · interactive showcase card ────────────────── */}
          <div className="reveal min-w-0 lg:col-span-7" style={{ animationDelay: "90ms" }}>
            <div className="squircle border border-[#DCD8CE] bg-[#FFFFFF] p-5 shadow-sm sm:p-6 md:p-8">
              {/* tab switcher */}
              <div
                role="tablist"
                aria-label="Squad showcase"
                className="relative grid grid-cols-2 rounded-full border border-hairline bg-stone p-1"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-1 grid grid-cols-2"
                >
                  <span
                    className="block h-full rounded-full bg-chalk shadow-[inset_0_1px_0_#fff,0_4px_12px_-8px_rgba(20,21,24,0.5)] ring-1 ring-hairline transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ gridColumn: activeIndex + 1 }}
                  />
                </span>
                {tabs.map((item, index) => (
                  <button
                    key={item.id}
                    ref={(node) => { tabRefs.current[index] = node; }}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${item.id}`}
                    aria-selected={tab === item.id}
                    aria-controls={`${baseId}-panel-${item.id}`}
                    tabIndex={tab === item.id ? 0 : -1}
                    onClick={() => setTab(item.id)}
                    onKeyDown={(event) => onTabKey(event, index)}
                    className={cn(
                      "relative z-10 flex min-h-10 min-w-0 items-center justify-center rounded-full px-2 py-1.5 text-center text-[11.5px] leading-[1.3] font-semibold transition-colors duration-300 sm:text-[12.5px]",
                      tab === item.id ? "text-ink" : "text-graphite hover:text-ink",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {tabs.map((item) => (
                <div
                  key={item.id}
                  role="tabpanel"
                  id={`${baseId}-panel-${item.id}`}
                  aria-labelledby={`${baseId}-tab-${item.id}`}
                  tabIndex={0}
                  hidden={tab !== item.id}
                  className="squad-panel mt-4 rounded-2xl focus-visible:outline-2"
                >
                  {item.id === "builder" && <SquadBuilder joined={joined} onJoin={() => setJoined(true)} />}
                  {item.id === "review" && <PeerProjectReview />}
                </div>
              ))}
            </div>

            <p className="mono mt-3 flex items-center gap-2 px-1 text-[8.5px] text-graphite">
              <CheckSeal className="h-3 w-3 text-cobalt" />
              SAMPLE COHORT PREVIEW · INTERACTIVE
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
