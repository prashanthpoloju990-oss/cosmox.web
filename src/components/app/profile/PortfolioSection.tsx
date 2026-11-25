import { useRef, type KeyboardEvent } from "react";
import {
  SEED_PROJECTS, SEED_EXPERIENCE, SEED_NOTES,
  type PortfolioTab, type ProjectEntry, type StudentPortfolio, type NoteEntry,
} from "@/data/profile";
import { cn } from "@/utils/cn";
import { ProfileIcon } from "./ProfileIcon";
import { ProjectCover } from "./ProjectCover";

const TABS: { id: PortfolioTab; label: string }[] = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "notes", label: "Articles & Notes" },
];

type Props = {
  profile: StudentPortfolio;
  readOnly: boolean;
  tab: PortfolioTab;
  onTab: (tab: PortfolioTab) => void;
  onAdd: () => void;
  onNote: (note: NoteEntry) => void;
  onProject: (project: ProjectEntry) => void;
};

function ProjectCard({ project, repo, onOpen }: { project: ProjectEntry; repo: string; onOpen: () => void }) {
  const sourceLabel = project.cover === "map" ? "View Code" : "GitHub";
  const hasCode = Boolean(repo) || project.cover !== "notebook";
  const actionClass = "liquid-secondary inline-flex min-h-9 items-center justify-center gap-1.5 px-3.5 py-1.5 text-[12px] font-semibold";

  return (
    <article className="profile-project-card squircle flex min-w-0 flex-col overflow-hidden border border-hairline bg-chalk p-3">
      <div className="profile-project-cover overflow-hidden rounded-2xl bg-stone">
        <ProjectCover project={project} />
      </div>
      <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2 sm:px-3.5 sm:pb-3">
        <p className="mono text-[9px] leading-[1.6] text-cobalt [overflow-wrap:anywhere]">{project.category}</p>
        <h3 className="mt-2 font-display text-[26px] leading-[1.12] text-ink [overflow-wrap:anywhere] sm:text-[29px]">{project.title}</h3>
        <p className="mt-2 text-[13.5px] leading-[1.65] text-graphite [overflow-wrap:anywhere]">{project.summary}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          {project.demoUrl && <a className={actionClass} href={project.demoUrl} target="_blank" rel="noopener noreferrer">Live Demo <ProfileIcon name="external" className="h-3 w-3 text-booster" /></a>}
          {hasCode && (repo
            ? <a className={actionClass} href={repo} target="_blank" rel="noopener noreferrer"><ProfileIcon name="github" className="h-3.5 w-3.5" />{sourceLabel}<ProfileIcon name="external" className="h-3 w-3 text-cobalt" /></a>
            : <button className={actionClass} type="button" aria-haspopup="dialog" onClick={onOpen}><ProfileIcon name={project.cover === "map" ? "projects" : "github"} className="h-3.5 w-3.5" />{sourceLabel}{project.cover === "map" && <ProfileIcon name="external" className="h-3 w-3 text-cobalt" />}</button>)}
          {!hasCode && <button className={actionClass} type="button" onClick={onOpen} aria-haspopup="dialog">View project <ProfileIcon name="arrow" className="h-3.5 w-3.5 text-booster" /></button>}
        </div>
      </div>
    </article>
  );
}

export function PortfolioSection({ profile, readOnly, tab, onTab, onAdd, onNote, onProject }: Props) {
  const tabButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const index = TABS.findIndex((t) => t.id === tab);

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, current: number) {
    const next = event.key === "ArrowRight" ? (current + 1) % 3
      : event.key === "ArrowLeft" ? (current + 2) % 3
        : event.key === "Home" ? 0 : event.key === "End" ? 2 : null;
    if (next === null) return;
    event.preventDefault();
    onTab(TABS[next].id);
    tabButtons.current[next]?.focus();
  }

  return (
    <section aria-label="Student portfolio" className="profile-portfolio">
      <div className="profile-portfolio-controls flex flex-wrap items-center justify-between gap-3">
        <h2 className="profile-portfolio-heading font-display text-[27px] leading-tight text-ink">Portfolio</h2>
        <div role="tablist" aria-label="Portfolio sections" className="profile-tabs relative grid min-w-0 grid-cols-3 rounded-full border border-hairline bg-stone p-1">
          <span aria-hidden="true" className="pointer-events-none absolute inset-1"><span className="profile-tab-thumb block h-full w-1/3 rounded-full" style={{ transform: `translateX(${index * 100}%)` }} /></span>
          {TABS.map((item, i) => (
            <button
              key={item.id}
              ref={(node) => { tabButtons.current[i] = node; }}
              type="button" role="tab" aria-selected={item.id === tab}
              id={`portfolio-tab-${item.id}`} aria-controls={`portfolio-panel-${item.id}`}
              tabIndex={item.id === tab ? 0 : -1}
              onClick={() => onTab(item.id)} onKeyDown={(event) => moveTab(event, i)}
              className={cn("relative z-[1] flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-full px-2 py-1.5 text-[12px] leading-[1.35] font-semibold transition-colors duration-300 sm:px-3 sm:text-[13px]", item.id === tab ? "text-white" : "text-graphite hover:bg-chalk/60 hover:text-ink")}
            >
              <ProfileIcon name={item.id} className="profile-tab-icon h-4 w-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </div>
        {!readOnly && <button type="button" onClick={onAdd} aria-haspopup="dialog" className="liquid-primary flex min-h-11 shrink-0 items-center justify-center gap-2 px-5 text-[13.5px] font-semibold"><ProfileIcon name="plus" className="h-4 w-4" />{tab === "projects" ? "Add Project" : "Add Entry"}</button>}
      </div>

      {TABS.map((item) => (
        <div key={item.id} role="tabpanel" tabIndex={0} id={`portfolio-panel-${item.id}`} aria-labelledby={`portfolio-tab-${item.id}`} hidden={tab !== item.id} className="profile-content-panel mt-4 rounded-[26px]">
          {tab === item.id && tab === "projects" && (
            <div className="profile-project-grid grid gap-4 sm:gap-5">
              {[...profile.addedProjects, ...SEED_PROJECTS].map((project) => <ProjectCard key={project.id} project={project} repo={profile.projectLinks[project.id] || project.codeUrl} onOpen={() => onProject(project)} />)}
            </div>
          )}
          {tab === item.id && tab === "experience" && (
            <ol aria-label="Experience timeline" className="profile-timeline grid gap-3">
              {[...profile.addedExperience, ...SEED_EXPERIENCE].map((entry) => (
                <li key={entry.id} className="squircle relative flex min-w-0 gap-3.5 border border-hairline bg-chalk p-4 sm:gap-5 sm:p-5">
                  <span className={`profile-role-art profile-role-${entry.icon} relative z-[1] grid h-11 w-11 shrink-0 place-items-center rounded-2xl sm:h-[50px] sm:w-[50px]`}><ProfileIcon name={entry.icon} className="h-6 w-6 sm:h-7 sm:w-7" /></span>
                  <article className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1"><p className="text-[13px] font-medium text-graphite [overflow-wrap:anywhere]">{entry.organization}</p><span className="mono rounded-full border border-hairline bg-canvas px-2.5 py-0.5 text-[9px] text-graphite">{entry.year}</span></div>
                    <h3 className="mt-1 font-display text-[25px] leading-[1.13] text-ink [overflow-wrap:anywhere]">{entry.role}</h3>
                    <p className="mt-2 max-w-[78ch] text-[13.5px] leading-[1.65] text-graphite [overflow-wrap:anywhere]">{entry.summary}</p>
                  </article>
                </li>
              ))}
            </ol>
          )}
          {tab === item.id && tab === "notes" && (
            <div className="profile-project-grid grid gap-4 sm:gap-5">
              {[...profile.addedNotes, ...SEED_NOTES].map((note, i) => (
                <article key={note.id} className="squircle flex min-w-0 flex-col border border-hairline bg-chalk p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", i%2 === 0 ? "bg-cobalt/[0.08] text-cobalt" : "bg-booster/[0.08] text-booster")}><ProfileIcon name="notes" className="h-5 w-5" /></span>
                    <span className="liquid-chip mono inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] text-graphite"><ProfileIcon name="time" className="h-3 w-3" />{note.minutes} min read</span>
                  </div>
                  <p className="mono mt-4 text-[9px] text-cobalt [overflow-wrap:anywhere]">{note.category}</p>
                  <h3 className="mt-1.5 font-display text-[26px] leading-[1.13] text-ink [overflow-wrap:anywhere]">{note.title}</h3>
                  <p className="mt-2 line-clamp-2 text-[13.5px] leading-[1.65] text-graphite [overflow-wrap:anywhere]">{note.paragraphs[0]}</p>
                  <div className="mt-auto pt-4"><button type="button" onClick={() => onNote(note)} aria-label={`Read note: ${note.title}`} aria-haspopup="dialog" className="liquid-secondary inline-flex min-h-9 items-center gap-2 px-4 text-[12.5px] font-semibold">Read note <ProfileIcon name="arrow" className="h-3.5 w-3.5 text-booster" /></button></div>
                </article>
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}