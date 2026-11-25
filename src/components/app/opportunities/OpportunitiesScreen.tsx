import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { Crosshair } from "@/components/Icons";
import { branchCode, getSession } from "@/utils/session";
import {
  BRANCH_LABEL,
  CATEGORY_LABEL,
  OPPORTUNITIES,
  type BranchId,
  type OpportunityCategory,
} from "@/data/opportunities";
import { useOpportunityState } from "@/hooks/useOpportunityState";
import { OpportunityCard } from "./OpportunityCard";
import { OpportunityDetailPage } from "./OpportunityDetailPage";
import { BookmarkIcon, CloseIcon, SearchIcon, SlidersIcon } from "./OpportunityIcons";

type CategoryFilter = "all" | OpportunityCategory;
type BranchFilter = "all" | BranchId;
type SortKey = "closing" | "newest" | "az";

const CATEGORY_FILTERS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "internship", label: "Internships" },
  { id: "hackathon", label: "Hackathons" },
  { id: "workshop", label: "Workshops & Meetups" },
];

const BRANCH_FILTERS: { id: BranchFilter; label: string }[] = [
  { id: "all", label: "All Branches" },
  { id: "cse", label: BRANCH_LABEL.cse },
  { id: "ece", label: BRANCH_LABEL.ece },
  { id: "mech", label: BRANCH_LABEL.mech },
];

const SORTS: { id: SortKey; label: string }[] = [
  { id: "closing", label: "Closing soon" },
  { id: "newest", label: "Newest first" },
  { id: "az", label: "A to Z" },
];

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function studentBranchId(branch: string): BranchId | null {
  const code = branchCode(branch);
  if (code === "CSE-DS") return "cse";
  if (code === "ECE") return "ece";
  if (code === "MECH") return "mech";
  return null;
}

interface Toast {
  id: number;
  message: string;
  undo?: () => void;
}

export function OpportunitiesScreen({ initialInternshipBranch }: { initialInternshipBranch?: BranchId }) {
  const session = getSession();
  const myBranch = studentBranchId(session.branch);
  const myYear = Number.parseInt(session.year, 10) || 1;

  const {
    state,
    toggleSaved,
    setSaved,
    togglePrepStep,
    toggleApplied,
    toggleRegistered,
    toggleInvite,
  } = useOpportunityState();

  const [category, setCategory] = useState<CategoryFilter>(initialInternshipBranch ? "internship" : "all");
  const [branch, setBranch] = useState<BranchFilter>(initialInternshipBranch ?? "all");
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("closing");
  const [activeId, setActiveId] = useState<string | null>(() => {
    try {
      const hash = window.location.hash;
      const qIndex = hash.indexOf("?");
      if (qIndex !== -1) {
        const params = new URLSearchParams(hash.slice(qIndex));
        return params.get("id");
      }
    } catch {
      // Fallback
    }
    return null;
  });
  const [toast, setToast] = useState<Toast | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string, undo?: () => void) => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message, undo });
    toastTimer.current = window.setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  /* Press "/" anywhere on the page to jump into search */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (activeId) return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  const handleToggleSave = useCallback(
    (id: string) => {
      const wasSaved = state.saved.includes(id);
      toggleSaved(id);
      const item = OPPORTUNITIES.find((entry) => entry.id === id);
      if (wasSaved) {
        showToast(`Removed ${item?.org ?? "listing"} from saved`, () => {
          setSaved(id, true);
          showToast("Saved again");
        });
      } else {
        showToast(`Saved ${item?.org ?? "listing"} for later`);
      }
    },
    [state.saved, toggleSaved, setSaved, showToast],
  );

  const matchesQuery = useCallback(
    (item: (typeof OPPORTUNITIES)[number]) => {
      const needle = query.trim().toLowerCase();
      if (!needle) return true;
      const haystack = [
        item.title,
        item.org,
        item.orgKind,
        item.summary,
        item.location,
        CATEGORY_LABEL[item.category],
        ...item.skills,
        ...item.applyTags,
      ]
        .join(" ")
        .toLowerCase();
      return needle.split(/\s+/).every((word) => haystack.includes(word));
    },
    [query],
  );

  /** Shared filters, ignoring category, so each category pill can show a live count. */
  const preCategory = useMemo(
    () =>
      OPPORTUNITIES.filter((item) => {
        if (branch !== "all" && !item.branches.includes(branch)) return false;
        if (savedOnly && !state.saved.includes(item.id)) return false;
        return matchesQuery(item);
      }),
    [branch, savedOnly, state.saved, matchesQuery],
  );

  const counts = useMemo(() => {
    const base: Record<CategoryFilter, number> = {
      all: preCategory.length,
      internship: 0,
      hackathon: 0,
      workshop: 0,
    };
    preCategory.forEach((item) => {
      base[item.category] += 1;
    });
    return base;
  }, [preCategory]);

  const visible = useMemo(() => {
    const list = preCategory.filter((item) => category === "all" || item.category === category);
    const sorted = [...list];
    if (sort === "closing") sorted.sort((a, b) => a.closesInDays - b.closesInDays);
    if (sort === "newest") sorted.sort((a, b) => a.addedDaysAgo - b.addedDaysAgo);
    if (sort === "az") sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [preCategory, category, sort]);

  const activeItem = activeId ? OPPORTUNITIES.find((item) => item.id === activeId) ?? null : null;
  const filtersOn = category !== "all" || branch !== "all" || query.trim() !== "" || savedOnly;

  const clearFilters = () => {
    setCategory("all");
    setBranch("all");
    setQuery("");
    setSavedOnly(false);
  };

  const goodFitFor = (item: (typeof OPPORTUNITIES)[number]) =>
    !!myBranch &&
    item.branches.includes(myBranch) &&
    myYear >= item.yearRange[0] &&
    myYear <= item.yearRange[1];

  /* ── Dedicated Full-Screen Detail View ───────────────────── */
  if (activeItem) {
    return (
      <div className="swap-in">
        <OpportunityDetailPage
          key={activeItem.id}
          item={activeItem}
          saved={state.saved.includes(activeItem.id)}
          prepSteps={state.prep[activeItem.id] ?? []}
          applied={state.applied.includes(activeItem.id)}
          registered={state.registered.includes(activeItem.id)}
          invites={state.invites[activeItem.id] ?? []}
          onBack={() => {
            setActiveId(null);
            if (window.location.hash.includes("?id=")) {
              window.location.hash = "#/app/opportunities";
            }
          }}
          onToggleSave={handleToggleSave}
          onTogglePrep={togglePrepStep}
          onToggleApplied={toggleApplied}
          onToggleRegistered={toggleRegistered}
          onToggleInvite={toggleInvite}
          onToast={showToast}
        />

        {toast && (
          <div
            role="status"
            className="toast-in liquid-chip-dark fixed bottom-24 left-1/2 z-[80] flex max-w-[calc(100vw-2rem)] items-center gap-3 px-4 py-2.5 lg:bottom-6"
          >
            <p className="text-[13px] font-medium text-white">{toast.message}</p>
            {toast.undo && (
              <button
                type="button"
                onClick={() => {
                  toast.undo?.();
                }}
                className="mono shrink-0 rounded-full border border-white/30 px-2.5 py-1 text-[9px] text-white transition-colors hover:bg-white/15"
              >
                Undo
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="reveal relative">
        <svg
          viewBox="0 0 420 200"
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-10 hidden h-40 w-80 text-ink opacity-[0.07] lg:block"
          fill="none"
          stroke="currentColor"
        >
          <ellipse cx="210" cy="100" rx="200" ry="72" strokeWidth="1.4" transform="rotate(-14 210 100)" />
          <ellipse cx="210" cy="100" rx="140" ry="50" strokeWidth="1.4" transform="rotate(-14 210 100)" />
          <circle cx="210" cy="100" r="26" strokeWidth="1.4" />
          <circle cx="386" cy="66" r="5" fill="#D94E1F" stroke="none" />
        </svg>

        <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <p className="mono flex items-center gap-2 text-[10px] text-graphite">
              <span className="live-dot h-[6px] w-[6px] rounded-full bg-booster" />
              {OPPORTUNITIES.length} open listings • checked this week
            </p>
            <h1 className="mt-3.5 font-display text-[36px] leading-[1.04] tracking-[-0.025em] text-ink sm:text-[44px]">
              Internships, hackathons &amp; <em className="italic text-booster">events</em>.
            </h1>
            <p className="mt-3 max-w-xl text-[15.5px] leading-[1.6] text-graphite">
              Verified opportunities for engineering students—filtered by your branch and semester.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSavedOnly((value) => !value)}
            aria-pressed={savedOnly}
            className={cn(
              "inline-flex h-11 shrink-0 items-center gap-2 self-start px-4 text-[13.5px] font-semibold",
              savedOnly ? "liquid-ink text-white" : "liquid-secondary text-ink",
            )}
          >
            <BookmarkIcon className="h-4 w-4" filled={savedOnly || state.saved.length > 0} />
            Saved ({state.saved.length})
          </button>
        </div>
      </header>

      {/* ── Filter strip ───────────────────────────────────── */}
      <section
        aria-label="Filter opportunities"
        className="filter-strip reveal mt-7 rounded-3xl p-4 sm:p-5"
        style={{ animationDelay: "70ms" }}
      >
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Category">
          {CATEGORY_FILTERS.map((filter) => {
            const on = category === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={on}
                onClick={() => setCategory(filter.id)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-semibold transition-all duration-300",
                  on
                    ? "bg-booster text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_22px_-12px_rgba(217,78,31,0.65)]"
                    : "border border-hairline bg-chalk/70 text-graphite hover:border-ink/30 hover:text-ink",
                )}
                style={{ transitionTimingFunction: EASE }}
              >
                {filter.label}
                <span className={cn("mono tnum text-[9px]", on ? "text-white/80" : "text-graphite/70")}>
                  {counts[filter.id]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3.5 flex flex-wrap items-center gap-2" role="group" aria-label="Branch">
          {BRANCH_FILTERS.map((filter) => {
            const on = branch === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={on}
                onClick={() => setBranch(filter.id)}
                className={cn(
                  "inline-flex h-9 items-center rounded-full px-3.5 text-[12.5px] font-medium transition-all duration-300",
                  on
                    ? "bg-cobalt text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_20px_-12px_rgba(30,77,140,0.6)]"
                    : "border border-hairline bg-chalk/70 text-graphite hover:border-cobalt/40 hover:text-ink",
                )}
                style={{ transitionTimingFunction: EASE }}
              >
                {filter.label}
              </button>
            );
          })}

          {myBranch && branch !== myBranch && (
            <button
              type="button"
              onClick={() => setBranch(myBranch)}
              className="mono inline-flex h-9 items-center gap-1.5 rounded-full border border-dashed border-cobalt/45 px-3 text-[9px] text-cobalt transition-colors duration-300 hover:bg-cobalt/[0.06]"
            >
              <Crosshair className="h-3 w-3" />
              Match my branch
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2.5 border-t border-hairline pt-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, skill, or organization"
              aria-label="Search opportunities by title, skill, or organization"
              className="h-11 w-full rounded-full border border-hairline bg-stone pl-11 pr-24 text-[13.5px] text-ink outline-none transition-colors duration-300 placeholder:text-graphite/70 focus:border-cobalt focus:bg-chalk"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-graphite transition-colors hover:bg-chalk hover:text-ink"
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="mono pointer-events-none absolute right-3.5 top-1/2 hidden -translate-y-1/2 rounded-full border border-hairline bg-chalk px-2 py-0.5 text-[8.5px] text-graphite sm:block">
                Press /
              </kbd>
            )}
          </div>

          <label className="relative flex h-11 shrink-0 items-center gap-2 rounded-full border border-hairline bg-stone pl-4 pr-3">
            <SlidersIcon className="h-4 w-4 text-graphite" />
            <span className="mono text-[8.5px] text-graphite">Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              aria-label="Sort opportunities"
              className="h-full cursor-pointer appearance-none bg-transparent pr-4 text-[13px] font-semibold text-ink outline-none"
            >
              {SORTS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="pointer-events-none absolute right-3 h-3 w-3 text-graphite"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="m4 6.5 4 4 4-4" strokeLinecap="round" />
            </svg>
          </label>
        </div>
      </section>

      {/* ── Result summary ─────────────────────────────────── */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-[13.5px] text-graphite">
          Showing <span className="font-semibold text-ink">{visible.length}</span> of {OPPORTUNITIES.length}
          {savedOnly && " saved"} {visible.length === 1 ? "listing" : "listings"}
          {branch !== "all" && ` for ${BRANCH_LABEL[branch]}`}
        </p>
        {filtersOn && (
          <button
            type="button"
            onClick={clearFilters}
            className="mono inline-flex items-center gap-1.5 rounded-full border border-hairline bg-chalk px-3 py-1.5 text-[9px] text-graphite transition-colors duration-300 hover:border-ink/30 hover:text-ink"
          >
            <CloseIcon className="h-3 w-3" />
            Clear filters
          </button>
        )}
      </div>

      {/* ── Grid ───────────────────────────────────────────── */}
      {visible.length > 0 ? (
        <div
          ref={gridRef}
          key={`${category}-${branch}-${savedOnly}-${sort}`}
          className="mt-4 grid gap-5 lg:grid-cols-2"
        >
          {visible.map((item, index) => (
            <OpportunityCard
              key={item.id}
              item={item}
              index={index}
              saved={state.saved.includes(item.id)}
              applied={state.applied.includes(item.id)}
              registered={state.registered.includes(item.id)}
              prepDone={(state.prep[item.id] ?? []).length}
              goodFit={goodFitFor(item)}
              onToggleSave={handleToggleSave}
              onOpen={setActiveId}
            />
          ))}
        </div>
      ) : (
        <div className="squircle mt-4 flex flex-col items-center border border-hairline bg-chalk px-6 py-16 text-center">
          <svg viewBox="0 0 120 120" aria-hidden="true" className="h-20 w-20 text-hairline" fill="none" stroke="currentColor">
            <circle cx="60" cy="60" r="52" strokeWidth="2" />
            <ellipse cx="60" cy="60" rx="52" ry="20" strokeWidth="2" transform="rotate(-28 60 60)" />
            <circle cx="60" cy="60" r="8" strokeWidth="2" />
          </svg>
          <h2 className="mt-5 font-display text-[28px] leading-tight text-ink">
            {savedOnly && state.saved.length === 0 ? "Nothing saved yet" : "No listings match this"}
          </h2>
          <p className="mt-2 max-w-sm text-[14px] leading-[1.6] text-graphite">
            {savedOnly && state.saved.length === 0
              ? "Tap the bookmark on any card and it will wait for you here."
              : "Try a different branch, or clear the search to see everything again."}
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="liquid-primary mt-6 inline-flex h-11 items-center px-5 text-[13.5px] font-semibold"
          >
            {savedOnly && state.saved.length === 0 ? "Browse all listings" : "Clear filters"}
          </button>
        </div>
      )}

      <p className="mono mt-8 flex items-center gap-2 text-[9px] text-graphite">
        <Crosshair className="h-3 w-3 text-booster" />
        These are sample listings for the founding batch. Always check the official site before you apply.
      </p>

      {/* ── Toast ──────────────────────────────────────────── */}
      {toast && (
        <div
          role="status"
          className="toast-in liquid-chip-dark fixed bottom-24 left-1/2 z-[80] flex max-w-[calc(100vw-2rem)] items-center gap-3 px-4 py-2.5 lg:bottom-6"
        >
          <p className="text-[13px] font-medium text-white">{toast.message}</p>
          {toast.undo && (
            <button
              type="button"
              onClick={() => {
                toast.undo?.();
              }}
              className="mono shrink-0 rounded-full border border-white/30 px-2.5 py-1 text-[9px] text-white transition-colors hover:bg-white/15"
            >
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
