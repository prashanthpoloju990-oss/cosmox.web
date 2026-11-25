import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import {
  CAREER_ROLES,
  ROADMAP_FILTERS,
  type CareerRole,
  type RoadmapFilter,
} from "@/data/careerRoadmaps";
import type { ProjectEntry } from "@/data/profile";
import { useSavedCareerPaths } from "@/hooks/useSavedCareerPaths";
import { RoleRoadmapView } from "./RoleRoadmapView";
import {
  ArrowRightIcon,
  BookmarkIcon,
  CheckIcon,
  RoleIconBadge,
  SearchIcon,
} from "./RoadmapIcons";

interface CareerRoadmapsScreenProps {
  addedProjectIds: string[];
  onAddProject: (project: ProjectEntry) => void;
  onViewProfile: () => void;
}

function RoleCard({
  role,
  saved,
  onOpen,
}: {
  role: CareerRole;
  saved: boolean;
  onOpen: (role: CareerRole) => void;
}) {
  return (
    <article
      onClick={() => onOpen(role)}
      className="group flex h-full cursor-pointer flex-col rounded-[28px] border border-hairline bg-chalk p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_18px_42px_-38px_rgba(20,21,24,0.4)] transition-all duration-500 hover:-translate-y-1.5 hover:border-graphite/35 hover:shadow-[0_28px_54px_-36px_rgba(20,21,24,0.45)]"
    >
      <div className="flex items-start justify-between gap-3">
        <RoleIconBadge kind={role.icon} accent={role.accent} className="h-[52px] w-[52px] rounded-[18px] [&_svg]:h-7 [&_svg]:w-7" />
        <span className="mono rounded-full bg-cobalt px-3 py-1.5 text-right text-[8.5px] leading-[1.35] text-white">
          {role.branchFit}
        </span>
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onOpen(role);
        }}
        className="mt-5 text-left font-display text-[25px] leading-[1.08] tracking-[-0.02em] text-ink transition-colors group-hover:text-booster"
        aria-label={`Open full roadmap for ${role.title}`}
      >
        {role.title}
      </button>
      <p className="mt-2.5 text-[13.5px] leading-[1.6] text-graphite">{role.summary}</p>

      <div className="mt-4 flex flex-wrap gap-1.5" aria-label={`Key tools for ${role.title}`}>
        {role.tools.map((tool) => (
          <span key={tool} className="rounded-full bg-stone px-3 py-1.5 text-[11.5px] font-medium text-ink">
            {tool}
          </span>
        ))}
      </div>

      {saved && (
        <span className="mono mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-booster/[0.08] px-2.5 py-1 text-[8.5px] text-booster">
          <BookmarkIcon className="h-3 w-3" /> Saved to my career path
        </span>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-hairline pt-4">
        <span className={cn("mono text-[8.5px]", role.difficulty === "Beginner Friendly" ? "text-cobalt" : "text-booster")}>
          {role.difficulty}
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen(role);
          }}
          className="liquid-secondary inline-flex h-9 shrink-0 items-center gap-1.5 px-3.5 text-[12px] font-semibold text-booster"
          aria-label={`Open full roadmap for ${role.title}`}
        >
          Open Full Roadmap
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
}

export function CareerRoadmapsScreen({ addedProjectIds, onAddProject, onViewProfile }: CareerRoadmapsScreenProps) {
  const [filter, setFilter] = useState<RoadmapFilter>("all");
  const [query, setQuery] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(() => {
    try {
      const hash = window.location.hash;
      const qIndex = hash.indexOf("?");
      if (qIndex !== -1) {
        const params = new URLSearchParams(hash.slice(qIndex));
        const roleParam = params.get("role");
        if (roleParam && CAREER_ROLES.some((r) => r.id === roleParam)) {
          return roleParam;
        }
      }
    } catch {
      // Fallback
    }
    return null;
  });
  const [toast, setToast] = useState("");
  const { savedIds, toggleSaved, isSaved } = useSavedCareerPaths();
  const toastTimer = useRef(0);
  const directoryScroll = useRef(0);

  const selectedRole = selectedRoleId ? CAREER_ROLES.find((role) => role.id === selectedRoleId) ?? null : null;

  const visibleRoles = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return CAREER_ROLES.filter((role) => {
      if (filter !== "all" && !role.filters.includes(filter)) return false;
      if (!needle) return true;
      const haystack = [
        role.title,
        role.branchFit,
        role.summary,
        role.dayToDay,
        ...role.tools,
        ...role.skills.map((skill) => skill.name),
        ...role.employers,
      ].join(" ").toLowerCase();
      return needle.split(/\s+/).every((word) => haystack.includes(word));
    });
  }, [filter, query]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  useEffect(() => {
    if (selectedRoleId) window.scrollTo({ top: 0, behavior: "auto" });
  }, [selectedRoleId]);

  const notify = (message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(""), 3600);
  };

  const openRole = (role: CareerRole) => {
    directoryScroll.current = window.scrollY;
    setSelectedRoleId(role.id);
  };

  const goBack = () => {
    setSelectedRoleId(null);
    if (window.location.hash.includes("?role=")) {
      window.location.hash = "#/app/roadmaps";
    }
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => window.scrollTo({ top: directoryScroll.current, behavior: "auto" }));
    });
  };

  const handleToggleSaved = (role: CareerRole) => {
    const wasSaved = isSaved(role.id);
    toggleSaved(role.id);
    notify(wasSaved ? `${role.title} removed from your career path.` : `${role.title} saved to your career path.`);
  };

  const handleAddProject = (role: CareerRole) => {
    const id = `roadmap-project-${role.id}`;
    if (addedProjectIds.includes(id)) return;
    onAddProject({
      id,
      title: role.project.title,
      category: `${role.title} • Starter Project`,
      summary: role.project.description,
      cover: "notebook",
      demoUrl: "",
      codeUrl: "",
    });
    notify(`${role.project.title} added to your profile.`);
  };

  if (selectedRole) {
    return (
      <>
        <RoleRoadmapView
          role={selectedRole}
          saved={isSaved(selectedRole.id)}
          projectAdded={addedProjectIds.includes(`roadmap-project-${selectedRole.id}`)}
          onBack={goBack}
          onToggleSaved={handleToggleSaved}
          onAddProject={handleAddProject}
          onViewProfile={onViewProfile}
        />
        {toast && <Toast message={toast} />}
      </>
    );
  }

  return (
    <div className="swap-in">
      {/* Directory hero */}
      <section className="squircle relative overflow-hidden border border-hairline bg-ink text-white">
        <div className="grid lg:grid-cols-12">
          <div className="relative p-6 sm:p-8 lg:col-span-7 lg:p-10">
            <svg viewBox="0 0 520 260" aria-hidden="true" className="pointer-events-none absolute -left-20 -top-24 h-72 w-[520px] text-white opacity-[0.07]" fill="none">
              <circle cx="250" cy="130" r="112" stroke="currentColor" />
              <ellipse cx="250" cy="130" rx="238" ry="78" transform="rotate(-18 250 130)" stroke="currentColor" />
              <ellipse cx="250" cy="130" rx="172" ry="112" transform="rotate(24 250 130)" stroke="currentColor" strokeDasharray="3 7" />
              <path d="M250 0v260M0 130h520" stroke="currentColor" />
            </svg>

            <div className="relative">
              <span className="liquid-chip-dark mono inline-flex items-center gap-2 px-3.5 py-2 text-[9px] text-white">
                <span className="live-dot h-[6px] w-[6px] rounded-full bg-booster" />
                20 verified space-tech career paths
              </span>
              <h1 className="mt-6 max-w-[16ch] font-display text-[36px] leading-[1.05] tracking-[-0.025em] text-white sm:text-[44px]">
                Pick a role. Follow the <em className="italic text-booster">step-by-step</em> map.
              </h1>
              <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.65] text-[#D1D5DB]">
                Click any space job title below to see the exact skills, visual learning flowchart, and starter project you need as a B.Tech student.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-2.5">
                <span className="mono rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[8.5px] text-white/75">
                  {visibleRoles.length} of 20 roles showing
                </span>
                {savedIds.length > 0 && (
                  <span className="mono inline-flex items-center gap-1.5 rounded-full bg-booster px-3 py-1.5 text-[8.5px] text-white">
                    <CheckIcon className="h-3 w-3" /> {savedIds.length} saved path{savedIds.length === 1 ? "" : "s"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="relative min-h-[260px] p-4 sm:p-5 lg:col-span-5">
            <div className="relative h-full min-h-[260px] overflow-hidden rounded-2xl bg-canvas">
              <img
                src="https://images.pexels.com/photos/5118462/pexels-photo-5118462.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400"
                alt="Engineer in protective clothing walking through a bright spacecraft cleanroom"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" aria-hidden="true" />
              <span className="liquid-chip-dark mono absolute bottom-4 left-4 px-3.5 py-2 text-[9px] text-white">
                CSE • ECE • MECH • AERO
              </span>
              <span className="mono absolute right-4 top-4 rounded-full bg-ink/45 px-3 py-1.5 text-[8.5px] text-white backdrop-blur-md">
                Cleanroom • India pathways
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and search */}
      <section aria-label="Filter career roles" className="filter-strip squircle mt-6 p-4 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Branch filters">
            {ROADMAP_FILTERS.map((item) => {
              const count = item.id === "all"
                ? CAREER_ROLES.length
                : CAREER_ROLES.filter((role) => role.filters.includes(item.id as Exclude<RoadmapFilter, "all">)).length;
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-full px-4 text-[12.5px] font-semibold transition-all duration-300",
                    active
                      ? "bg-booster text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_8px_18px_-8px_rgba(217,78,31,0.6)]"
                      : "liquid-chip text-graphite hover:text-ink",
                  )}
                >
                  {item.label}
                  <span className={cn("mono text-[8px]", active ? "text-white/75" : "text-graphite/70")}>{count}</span>
                </button>
              );
            })}
          </div>

          <label className="relative flex h-11 w-full shrink-0 items-center rounded-full bg-stone px-4 ring-1 ring-hairline transition-shadow focus-within:ring-2 focus-within:ring-cobalt/60 xl:w-[320px]">
            <span className="sr-only">Search roles or skills</span>
            <SearchIcon className="h-4 w-4 shrink-0 text-graphite" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search roles or skills"
              className="ml-2.5 h-full w-full bg-transparent text-[13.5px] text-ink outline-none placeholder:text-graphite/75"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="mono shrink-0 px-2 text-[8.5px] text-booster">
                Clear
              </button>
            )}
          </label>
        </div>
      </section>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="mono text-[9px] text-graphite" aria-live="polite">
          Showing {visibleRoles.length} role{visibleRoles.length === 1 ? "" : "s"}
        </p>
        <p className="mono text-[9px] text-graphite">Tap a card to open the full roadmap</p>
      </div>

      {visibleRoles.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleRoles.map((role) => (
            <RoleCard key={role.id} role={role} saved={isSaved(role.id)} onOpen={openRole} />
          ))}
        </div>
      ) : (
        <div className="squircle mt-4 border border-hairline bg-chalk p-8 text-center">
          <p className="font-display text-[30px] text-ink">No roles match that search.</p>
          <p className="mt-2 text-[14px] text-graphite">Try a role name, a branch, or a skill like Python, CAD or radio.</p>
          <button
            type="button"
            onClick={() => { setFilter("all"); setQuery(""); }}
            className="liquid-secondary mt-5 inline-flex h-10 items-center px-5 text-[13px] font-semibold"
          >
            Clear search & filters
          </button>
        </div>
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="toast-in liquid-float fixed bottom-24 left-1/2 z-50 flex w-max max-w-[calc(100vw-2rem)] items-center gap-2.5 px-4 py-3 text-[13px] font-semibold text-ink lg:bottom-6"
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-booster/[0.09] text-booster">
        <CheckIcon className="h-4 w-4" />
      </span>
      {message}
    </div>
  );
}
