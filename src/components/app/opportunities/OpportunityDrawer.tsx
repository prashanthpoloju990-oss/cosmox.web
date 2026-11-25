import { useCallback, useEffect, useRef, useState } from "react";
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
  CloseIcon,
  ExternalIcon,
  PinIcon,
  UsersIcon,
} from "./OpportunityIcons";
import { CATEGORY_THEME } from "./theme";
import { downloadCalendarEvent } from "@/utils/calendar";

interface Props {
  item: Opportunity;
  saved: boolean;
  prepSteps: number[];
  applied: boolean;
  registered: boolean;
  invites: string[];
  onClose: () => void;
  onToggleSave: (id: string) => void;
  onTogglePrep: (id: string, index: number) => void;
  onToggleApplied: (id: string) => void;
  onToggleRegistered: (id: string) => void;
  onToggleInvite: (id: string, teammateId: string) => void;
  onToast: (message: string) => void;
}

/** Builds a calendar file for the live session so the student does not forget it. */
function downloadCalendarFile(item: Opportunity) {
  const session = item.dates[1] ?? item.dates[0];
  const start = dateFromToday(session.inDays);
  start.setHours(19, 0, 0, 0);
  downloadCalendarEvent({
    uid: item.id,
    title: item.title,
    description: `${item.summary} (sample listing)`,
    location: item.location,
    start,
    end: new Date(start.getTime() + 2 * 3600000),
  });
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mono text-[9.5px] text-graphite">{children}</h3>;
}

export function OpportunityDrawer({
  item,
  saved,
  prepSteps,
  applied,
  registered,
  invites,
  onClose,
  onToggleSave,
  onTogglePrep,
  onToggleApplied,
  onToggleRegistered,
  onToggleInvite,
  onToast,
}: Props) {
  const [shown, setShown] = useState(false);
  const [showTeammates, setShowTeammates] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const teammatesRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const closingRef = useRef(false);
  const closeTimer = useRef(0);

  const theme = CATEGORY_THEME[item.category];
  const urgent = isClosingSoon(item.closesInDays);
  const daysLeft = Math.max(0, item.closesInDays);
  const windowDays = 30;
  const timeLeft = Math.min(100, Math.round((daysLeft / windowDays) * 100));
  const prepPercent = Math.round((prepSteps.length / item.prep.length) * 100);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setShown(false);
    closeTimer.current = window.setTimeout(onClose, 320);
  }, [onClose]);

  /* Enter animation, scroll lock, focus handling */
  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    const frame = window.requestAnimationFrame(() => setShown(true));
    const focusTimer = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 120);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(focusTimer);
      window.clearTimeout(closeTimer.current);
      document.body.style.overflow = previousOverflow;
      restoreRef.current?.focus({ preventScroll: true });
    };
  }, []);

  /* Escape to close, Tab stays inside the panel */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        requestClose();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [requestClose]);

  const openTeammates = () => {
    setShowTeammates(true);
    window.setTimeout(() => {
      teammatesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  const handleRegister = () => {
    if (registered) {
      downloadCalendarFile(item);
      onToast("Calendar file downloaded");
      return;
    }
    onToggleRegistered(item.id);
    onToast("Seat booked — we saved it to your list");
  };

  return (
    <div className="fixed inset-0 z-[70]" role="presentation">
      <div
        aria-hidden="true"
        onClick={requestClose}
        className={cn(
          "absolute inset-0 bg-ink/55 backdrop-blur-[14px] transition-opacity duration-300",
          shown ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="opportunity-drawer-title"
        className={cn(
          "liquid-modal absolute bottom-2 right-2 top-2 flex w-[calc(100%-1rem)] max-w-[560px] flex-col overflow-hidden transition-[transform,opacity] duration-300 sm:bottom-3 sm:right-3 sm:top-3 sm:w-[calc(100%-1.5rem)]",
          shown ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        {/* Header */}
        <div className="relative shrink-0 border-b border-hairline bg-stone/70 px-5 pb-5 pt-4 sm:px-7">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("mono rounded-full border px-2.5 py-1 text-[9px]", theme.badge)}>
                {CATEGORY_LABEL[item.category]}
              </span>
              <span className="mono rounded-full border border-hairline bg-chalk px-2.5 py-1 text-[8.5px] text-graphite">
                Sample listing
              </span>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={requestClose}
              aria-label="Close details"
              className="liquid-secondary flex h-9 w-9 shrink-0 items-center justify-center"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3.5 text-[13px] font-semibold text-ink">{item.org}</p>
          <h2
            id="opportunity-drawer-title"
            className="mt-1 font-display text-[30px] leading-[1.06] tracking-[-0.025em] text-ink sm:text-[34px]"
          >
            {item.title}
          </h2>
          <p className="mt-2 text-[14px] leading-[1.6] text-graphite">{item.summary}</p>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[12.5px]">
              <span className={cn("font-semibold", urgent ? "text-booster" : "text-ink")}>
                {closingLabel(item.closesInDays)}
              </span>
              <span className="mono text-[9px] text-graphite">{formatDate(item.closesInDays)}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-hairline" aria-hidden="true">
              <div
                className={cn("h-full rounded-full transition-[width] duration-700", urgent ? "bg-booster" : "bg-cobalt")}
                style={{ width: `${Math.max(timeLeft, 4)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
          <ul className="grid grid-cols-3 gap-2">
            {item.facts.map((fact) => (
              <li key={fact.label} className="rounded-2xl border border-hairline bg-canvas px-3 py-2.5">
                <p className="mono text-[8px] text-graphite">{fact.label}</p>
                <p className="mt-1 text-[12.5px] font-semibold leading-snug text-ink">{fact.value}</p>
              </li>
            ))}
          </ul>

          <section className="mt-7">
            <SectionTitle>What you will do</SectionTitle>
            <ul className="mt-3 space-y-2.5">
              {item.whatYouWillDo.map((line, index) => (
                <li key={line} className="flex gap-3">
                  <span className="mono mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-hairline bg-canvas text-[8.5px] text-graphite">
                    {index + 1}
                  </span>
                  <p className="text-[14px] leading-[1.6] text-ink">{line}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-7">
            <SectionTitle>Who can apply</SectionTitle>
            <ul className="mt-3 space-y-2.5">
              {item.whoCanApply.map((line) => (
                <li key={line} className="flex gap-3">
                  <CheckIcon className="mt-[3px] h-4 w-4 shrink-0 text-cobalt" />
                  <p className="text-[14px] leading-[1.6] text-ink">{line}</p>
                </li>
              ))}
            </ul>
            <p className="mono mt-3 inline-flex items-center gap-1.5 rounded-full border border-hairline bg-canvas px-2.5 py-1 text-[8.5px] text-graphite">
              <PinIcon className="h-3 w-3" />
              {item.location}
            </p>
          </section>

          <section className="mt-7">
            <SectionTitle>Important dates</SectionTitle>
            <ul className="mt-3 divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline">
              {item.dates.map((date) => (
                <li key={date.label} className="flex items-center justify-between gap-3 bg-canvas px-3.5 py-3">
                  <span className="text-[13.5px] text-ink">{date.label}</span>
                  <span className="mono shrink-0 text-[9.5px] text-graphite">{formatDate(date.inDays)}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Prep box */}
          <section className="mt-7 rounded-2xl bg-stone p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-[15px] font-semibold text-ink">How to prepare (3 quick steps)</h3>
              <span className="mono text-[9px] text-booster">
                {prepSteps.length}/{item.prep.length} done
              </span>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-hairline" aria-hidden="true">
              <div
                className="h-full rounded-full bg-booster transition-[width] duration-500"
                style={{ width: `${prepPercent}%` }}
              />
            </div>

            <ul className="mt-4 space-y-2">
              {item.prep.map((step, index) => {
                const done = prepSteps.includes(index);
                return (
                  <li key={step}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={done}
                      onClick={() => onTogglePrep(item.id, index)}
                      className="flex w-full items-start gap-3 rounded-2xl border border-hairline bg-chalk px-3.5 py-3 text-left transition-colors duration-300 hover:border-ink/30"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                          done ? "border-booster bg-booster text-white" : "border-graphite/40 bg-chalk",
                        )}
                      >
                        {done && <CheckIcon className="h-3 w-3" />}
                      </span>
                      <span
                        className={cn(
                          "text-[13.5px] leading-[1.55]",
                          done ? "text-graphite line-through decoration-hairline" : "text-ink",
                        )}
                      >
                        {step}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mono mt-3 text-[8.5px] text-graphite">
              Your ticks are saved on this device
            </p>
          </section>

          {/* Status row */}
          <section className="mt-6 flex flex-wrap items-center gap-2">
            {item.action.kind === "apply" && (
              <button
                type="button"
                role="checkbox"
                aria-checked={applied}
                onClick={() => {
                  onToggleApplied(item.id);
                  onToast(applied ? "Marked as not applied" : "Nice — marked as applied");
                }}
                className={cn(
                  "inline-flex h-10 items-center gap-2 px-4 text-[13px] font-semibold",
                  applied ? "liquid-cobalt text-white" : "liquid-secondary text-ink",
                )}
              >
                <CheckSeal className="h-4 w-4" />
                {applied ? "Applied" : "I've applied"}
              </button>
            )}

            {item.action.kind === "register" && registered && (
              <button
                type="button"
                onClick={() => {
                  onToggleRegistered(item.id);
                  onToast("Seat cancelled");
                }}
                className="liquid-secondary inline-flex h-10 items-center px-4 text-[13px] font-medium"
              >
                Cancel my seat
              </button>
            )}

            {item.action.kind === "teammates" && !showTeammates && (
              <button
                type="button"
                onClick={openTeammates}
                className="liquid-secondary inline-flex h-10 items-center gap-2 px-4 text-[13px] font-medium"
              >
                <UsersIcon className="h-4 w-4" />
                See students looking for a team
              </button>
            )}
          </section>

          {/* Teammates */}
          {item.action.kind === "teammates" && showTeammates && item.teammates && (
            <section ref={teammatesRef} className="swap-in mt-6 rounded-2xl border border-hairline bg-canvas p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-[15px] font-semibold text-ink">Students looking for a team</h3>
                <span className="mono text-[9px] text-cobalt">{invites.length} invited</span>
              </div>
              <p className="mt-1 text-[12.5px] text-graphite">
                Sample profiles from the Cosmox community. Send an invite and they see your branch and year.
              </p>

              <ul className="mt-4 space-y-2">
                {item.teammates.map((mate) => {
                  const invited = invites.includes(mate.id);
                  return (
                    <li
                      key={mate.id}
                      className="flex items-center gap-3 rounded-2xl border border-hairline bg-chalk px-3.5 py-3"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cobalt text-[13px] font-semibold text-white">
                        {mate.name.charAt(0)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-semibold text-ink">{mate.name}</p>
                        <p className="mono truncate text-[8.5px] text-graphite">
                          {mate.branch} • {mate.year} • {mate.city}
                        </p>
                        <p className="mt-0.5 truncate text-[12px] text-graphite">{mate.skill}</p>
                      </div>
                      <button
                        type="button"
                        aria-pressed={invited}
                        onClick={() => {
                          onToggleInvite(item.id, mate.id);
                          onToast(invited ? `Invite withdrawn` : `Invite sent to ${mate.name}`);
                        }}
                        className={cn(
                          "h-9 shrink-0 px-3.5 text-[12.5px] font-semibold",
                          invited ? "liquid-cobalt text-white" : "liquid-secondary text-ink",
                        )}
                      >
                        {invited ? "Invited ✓" : "Invite"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>

        {/* Sticky action bar */}
        <div className="shrink-0 border-t border-hairline bg-stone/80 px-5 py-4 sm:px-7">
          <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center">
            <button
              type="button"
              aria-pressed={saved}
              onClick={() => onToggleSave(item.id)}
              className={cn(
                "inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap px-4 text-[13.5px] font-semibold sm:w-auto",
                saved ? "liquid-ink text-white" : "liquid-secondary text-ink",
              )}
            >
              <BookmarkIcon className="h-4 w-4" filled={saved} />
              {saved ? "Saved" : "Save Opportunity"}
            </button>

            {item.action.kind === "apply" ? (
              <a
                href={item.action.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onToast("Opening the official site in a new tab")}
                className="liquid-primary inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap px-5 text-[14px] font-semibold sm:flex-1"
              >
                {item.action.label}
                <ExternalIcon className="h-4 w-4" />
              </a>
            ) : item.action.kind === "teammates" ? (
              <button
                type="button"
                onClick={openTeammates}
                className="liquid-primary inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap px-5 text-[14px] font-semibold sm:flex-1"
              >
                {item.action.label}
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRegister}
                className={cn(
                  "inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap px-5 text-[14px] font-semibold sm:flex-1",
                  registered ? "liquid-cobalt text-white" : "liquid-primary",
                )}
              >
                {registered ? "Add to Calendar" : item.action.label}
                {registered ? <CalendarPlusIcon className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
