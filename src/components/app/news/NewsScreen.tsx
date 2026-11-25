import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { Crosshair } from "@/components/Icons";
import {
  ARTICLES,
  NEWS_FILTERS,
  launchesSorted,
  type Launch,
  type NewsFilter,
} from "@/data/news";
import { useNewsState } from "@/hooks/useNewsState";
import { downloadCalendarEvent } from "@/utils/calendar";
import { BookmarkIcon } from "@/components/app/opportunities/OpportunityIcons";
import { LaunchShowcase } from "./LaunchShowcase";
import { LaunchSchedule } from "./LaunchSchedule";
import { ArticleCard } from "./ArticleCard";
import { ArticleReader } from "./ArticleReader";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
/* Switcher order follows the brief; the schedule is sorted by time. */
const SWITCHER_ORDER = ["pslv-c62", "vikram-1-test", "starlink-group"];

interface Toast {
  message: string;
  action?: { label: string; run: () => void };
}

function addLaunchToCalendar(launch: Launch) {
  downloadCalendarEvent({
    uid: launch.id,
    title: `${launch.short} launch`,
    description: `${launch.summary} Watch live: ${launch.watchUrl} (sample feed preview)`,
    location: launch.agency,
    start: new Date(launch.launchAt),
    end: new Date(launch.launchAt + 3600000),
    alarmMinutes: 60,
  });
}

export function NewsScreen() {
  const { state, toggleSaved, toggleReminder } = useNewsState();
  const [filter, setFilter] = useState<NewsFilter>("all");
  const [savedOnly, setSavedOnly] = useState(false);
  const [selectedLaunchId, setSelectedLaunchId] = useState(SWITCHER_ORDER[0]);
  const [readerId, setReaderId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef(0);
  const showcaseRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((next: Toast) => {
    window.clearTimeout(toastTimer.current);
    setToast(next);
    toastTimer.current = window.setTimeout(() => setToast(null), 5000);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const allLaunches = useMemo(
    () => SWITCHER_ORDER.map((id) => launchesSorted().find((launch) => launch.id === id)!).filter(Boolean),
    [],
  );

  const matches = useCallback(
    (tags: string[]) => filter === "all" || tags.includes(filter),
    [filter],
  );

  const visibleLaunches = savedOnly ? [] : allLaunches.filter((launch) => matches(launch.tags));
  const activeLaunch =
    visibleLaunches.find((launch) => launch.id === selectedLaunchId) ?? visibleLaunches[0];

  const visibleArticles = ARTICLES.filter(
    (article) => matches(article.tags) && (!savedOnly || state.saved.includes(article.id)),
  );

  const counts = useMemo(() => {
    const result = {} as Record<NewsFilter, number>;
    NEWS_FILTERS.forEach(({ id }) => {
      const has = (tags: string[]) => id === "all" || tags.includes(id);
      result[id] =
        allLaunches.filter((launch) => has(launch.tags)).length +
        ARTICLES.filter((article) => has(article.tags)).length;
    });
    return result;
  }, [allLaunches]);

  const handleReminder = useCallback(
    (launch: Launch) => {
      const wasOn = state.reminders.includes(launch.id);
      toggleReminder(launch.id);
      if (wasOn) {
        showToast({
          message: `Reminder removed for ${launch.short}`,
          action: { label: "Undo", run: () => toggleReminder(launch.id) },
        });
      } else {
        showToast({
          message: `Reminder set for ${launch.short}`,
          action: { label: "Add to calendar", run: () => addLaunchToCalendar(launch) },
        });
      }
    },
    [state.reminders, toggleReminder, showToast],
  );

  const handleSave = useCallback(
    (id: string) => {
      const wasSaved = state.saved.includes(id);
      toggleSaved(id);
      showToast(
        wasSaved
          ? { message: "Removed from saved articles", action: { label: "Undo", run: () => toggleSaved(id) } }
          : { message: "Article saved for later" },
      );
    },
    [state.saved, toggleSaved, showToast],
  );

  const viewLaunch = (id: string) => {
    setSelectedLaunchId(id);
    showcaseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const readerArticle = readerId ? ARTICLES.find((item) => item.id === readerId) ?? null : null;
  const filterLabel = NEWS_FILTERS.find((item) => item.id === filter)?.label ?? "";

  const summaryParts: string[] = [];
  if (visibleArticles.length) {
    summaryParts.push(`${visibleArticles.length} ${visibleArticles.length === 1 ? "story" : "stories"}`);
  }
  if (visibleLaunches.length) {
    summaryParts.push(`${visibleLaunches.length} ${visibleLaunches.length === 1 ? "launch" : "launches"}`);
  }

  return (
    <div className="relative">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="reveal relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="mono flex items-center gap-2 text-[10px] text-graphite">
            <span className="live-dot h-[6px] w-[6px] rounded-full bg-booster" />
            Updated today • {allLaunches.length} launches • {ARTICLES.length} stories
          </p>
          <h1 className="mt-3.5 font-display text-[36px] leading-[1.04] tracking-[-0.025em] text-ink sm:text-[44px]">
            Space news &amp; live <em className="italic text-booster">launches</em>.
          </h1>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-[1.6] text-graphite">
            Stay updated on rocket launches, ISRO milestones, and Indian space startups—with clear
            takeaways for students.
          </p>
        </div>

        <button
          type="button"
          aria-pressed={savedOnly}
          onClick={() => setSavedOnly((value) => !value)}
          className={cn(
            "inline-flex h-11 shrink-0 items-center gap-2 self-start px-4 text-[13.5px] font-semibold",
            savedOnly ? "liquid-ink text-white" : "liquid-secondary text-ink",
          )}
        >
          <BookmarkIcon className="h-4 w-4" filled={savedOnly || state.saved.length > 0} />
          Saved ({state.saved.length})
        </button>
      </header>

      {/* ── Filter pills ───────────────────────────────────── */}
      <div
        role="group"
        aria-label="Filter updates"
        className="filter-tab-scroll reveal -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        style={{ animationDelay: "40ms" }}
      >
        {NEWS_FILTERS.map((item) => {
          const on = filter === item.id && !savedOnly;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setFilter(item.id);
                setSavedOnly(false);
              }}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[13px] font-semibold transition-all duration-300",
                on
                  ? "bg-booster text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_22px_-12px_rgba(217,78,31,0.65)]"
                  : "border border-hairline bg-chalk/80 text-graphite backdrop-blur-md hover:border-ink/30 hover:text-ink",
              )}
              style={{ transitionTimingFunction: EASE }}
            >
              {item.label}
              <span className={cn("mono tnum text-[9px]", on ? "text-white/80" : "text-graphite/70")}>
                {counts[item.id]}
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-4 text-[13.5px] text-graphite">
        {savedOnly ? (
          <>
            Showing your <span className="font-semibold text-ink">{visibleArticles.length}</span> saved{" "}
            {visibleArticles.length === 1 ? "article" : "articles"}
          </>
        ) : (
          <>
            {filter === "all" ? "Everything new" : filterLabel}:{" "}
            <span className="font-semibold text-ink">{summaryParts.join(" • ") || "nothing yet"}</span>
          </>
        )}
      </p>

      {/* ── Launches ───────────────────────────────────────── */}
      {visibleLaunches.length > 0 && activeLaunch && (
        <div ref={showcaseRef} className="mt-5 scroll-mt-24">
          <LaunchShowcase
            launches={visibleLaunches}
            active={activeLaunch}
            reminders={state.reminders}
            onSelect={setSelectedLaunchId}
            onToggleReminder={handleReminder}
          />
        </div>
      )}

      {filter === "launches" && !savedOnly && (
        <div className="mt-6">
          <LaunchSchedule
            launches={launchesSorted()}
            activeId={activeLaunch?.id ?? ""}
            reminders={state.reminders}
            onView={viewLaunch}
            onToggleReminder={handleReminder}
          />
        </div>
      )}

      {/* ── Articles ───────────────────────────────────────── */}
      {visibleArticles.length > 0 && (
        <section aria-labelledby="stories-title" className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 id="stories-title" className="font-display text-[30px] leading-tight tracking-[-0.02em] text-ink">
              {savedOnly ? "Saved articles" : "Latest stories"}
            </h2>
            <p className="mono text-[8.5px] text-graphite/70">Sample feed preview</p>
          </div>
          <div key={`${filter}-${savedOnly}`} className="mt-4 grid gap-5 lg:grid-cols-2">
            {visibleArticles.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                index={index}
                saved={state.saved.includes(article.id)}
                onOpen={setReaderId}
              />
            ))}
          </div>
        </section>
      )}

      {visibleArticles.length === 0 && (savedOnly || filter !== "launches") && (
        <div className="squircle mt-8 flex flex-col items-center border border-hairline bg-chalk px-6 py-14 text-center">
          <svg viewBox="0 0 120 120" aria-hidden="true" className="h-20 w-20 text-hairline" fill="none" stroke="currentColor">
            <circle cx="60" cy="60" r="52" strokeWidth="2" />
            <ellipse cx="60" cy="60" rx="52" ry="20" strokeWidth="2" transform="rotate(-28 60 60)" />
            <circle cx="60" cy="60" r="8" strokeWidth="2" />
          </svg>
          <h2 className="mt-5 font-display text-[28px] leading-tight text-ink">
            {savedOnly ? "No saved articles yet" : "No stories here yet"}
          </h2>
          <p className="mt-2 max-w-sm text-[14px] leading-[1.6] text-graphite">
            {savedOnly
              ? "Open any story and tap Save Article — it will wait for you here."
              : "Check back soon, or look at all updates for now."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSavedOnly(false);
              setFilter("all");
            }}
            className="liquid-primary mt-6 inline-flex h-11 items-center px-5 text-[13.5px] font-semibold"
          >
            See all updates
          </button>
        </div>
      )}

      <p className="mono mt-10 flex items-center gap-2 text-[9px] text-graphite">
        <Crosshair className="h-3 w-3 text-booster" />
        Sample feed preview for the founding batch. Launch times move often — always check the
        agency&apos;s official site.
      </p>

      {readerArticle && (
        <ArticleReader
          article={readerArticle}
          saved={state.saved.includes(readerArticle.id)}
          onToggleSave={handleSave}
          onNavigate={setReaderId}
          onClose={() => setReaderId(null)}
        />
      )}

      {toast && (
        <div
          role="status"
          className="toast-in liquid-chip-dark fixed bottom-24 left-1/2 z-[80] flex max-w-[calc(100vw-2rem)] items-center gap-3 px-4 py-2.5 lg:bottom-6"
        >
          <p className="text-[13px] font-medium text-white">{toast.message}</p>
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action?.run();
                setToast(null);
              }}
              className="mono shrink-0 rounded-full border border-white/30 px-2.5 py-1 text-[9px] text-white transition-colors hover:bg-white/15"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
