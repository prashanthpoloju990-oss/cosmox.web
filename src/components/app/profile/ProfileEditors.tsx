import { useId, useState, type FormEvent } from "react";
import { PROFILE_BRANCHES, PROFILE_YEARS, type PortfolioTab, type ProfileInfo } from "@/data/profile";
import type { PortfolioStore } from "@/hooks/useStudentPortfolio";
import { newEntryId, publicLink, readingTime } from "@/utils/profileStorage";
import { ProfileDialog } from "./ProfileDialog";
import { ProfileIcon } from "./ProfileIcon";

type Errors = Partial<Record<string, string>>;

export function TextField({ label, name, value, change, max = 110, placeholder, rows, error, optional, list }: {
  label: string; name: string; value: string; change: (value: string) => void; max?: number;
  placeholder?: string; rows?: number; error?: string; optional?: boolean; list?: string;
}) {
  const id = useId();
  const common = {
    id, name, value, maxLength: max, placeholder, required: !optional,
    "aria-invalid": !!error, "aria-describedby": error ? `${id}-error` : undefined,
    className: "glass-input block min-h-11 w-full px-3.5 py-2.5 text-[14px] leading-[1.55] text-ink placeholder:text-graphite/65",
  };
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-ink">{label}{optional && <span className="ml-1 text-[11px] font-normal text-graphite">(optional)</span>}</label>
      {rows
        ? <textarea {...common} rows={rows} onChange={(event) => change(event.target.value)} style={{ resize: "vertical" }} />
        : <input {...common} type="text" list={list} inputMode={name.toLowerCase().includes("url") || name === "github" || name === "linkedin" ? "url" : "text"} onChange={(event) => change(event.target.value)} />}
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-booster-deep">{error}</p>}
    </div>
  );
}

function FormActions({ form, label, onClose, add = false }: { form: string; label: string; onClose: () => void; add?: boolean }) {
  return <><button type="button" onClick={onClose} className="liquid-secondary min-h-10 px-4 text-[13px] font-medium">Cancel</button><button type="submit" form={form} className="liquid-primary inline-flex min-h-10 items-center gap-2 px-5 text-[13px] font-semibold"><ProfileIcon name={add ? "plus" : "check"} className="h-3.5 w-3.5" />{label}</button></>;
}

function firstError(form: HTMLFormElement, errors: Errors) {
  const field = form.elements.namedItem(Object.keys(errors)[0]);
  if (field instanceof HTMLElement) field.focus();
}

export function EditProfileDialog({ info, focusField = "name", onSave, onClose }: {
  info: ProfileInfo; focusField?: "name" | "github" | "linkedin"; onSave: (next: ProfileInfo) => void; onClose: () => void;
}) {
  const id = useId();
  const [draft, setDraft] = useState(info);
  const [errors, setErrors] = useState<Errors>({});
  const change = (key: keyof ProfileInfo, value: string) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found: Errors = {};
    if (draft.name.trim().length < 2) found.name = "Enter a name with at least two characters.";
    if (!draft.university.trim()) found.university = "Add your university and city.";
    if (!draft.bio.trim()) found.bio = "Write a short line about what you're building or learning.";
    const github = publicLink(draft.github, "github");
    const linkedin = publicLink(draft.linkedin, "linkedin");
    if (github === null) found.github = "Use a GitHub profile link, like https://github.com/your-name.";
    if (linkedin === null) found.linkedin = "Use a profile link starting with https://www.linkedin.com/in/.";
    setErrors(found);
    if (Object.keys(found).length) return firstError(event.currentTarget, found);
    onSave({ ...draft, name: draft.name.trim(), university: draft.university.trim(), bio: draft.bio.trim(), github: github ?? "", linkedin: linkedin ?? "" });
  }

  return (
    <ProfileDialog title="Edit profile" description={focusField === "name" ? "Let other students know who you are and what you're working on." : `Add your ${focusField === "github" ? "GitHub" : "LinkedIn"} link so people can find your work.`} focusField={focusField} onClose={onClose} footer={<FormActions form={id} label="Save changes" onClose={onClose} />}>
      <form id={id} onSubmit={submit} noValidate className="grid gap-4">
        <TextField label="Name" name="name" value={draft.name} change={(v) => change("name", v)} max={60} error={errors.name} />
        <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-3">
          <label className="text-[13px] font-semibold text-ink">Engineering branch
            <select name="branch" className="glass-input mt-1.5 block h-11 w-full min-w-0 px-2.5 text-[13px] font-normal sm:px-3" value={draft.branch} onChange={(e) => change("branch", e.target.value)}>
              {[...new Set([...PROFILE_BRANCHES, info.branch])].map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>
          <label className="text-[13px] font-semibold text-ink">Current year
            <select name="year" className="glass-input mt-1.5 block h-11 w-full min-w-0 px-2.5 text-[13px] font-normal sm:px-3" value={draft.year} onChange={(e) => change("year", e.target.value)}>
              {[...new Set([...PROFILE_YEARS, info.year])].map((y) => <option key={y}>{y}</option>)}
            </select>
          </label>
        </div>
        <TextField label="University & city" name="university" value={draft.university} change={(v) => change("university", v)} max={120} error={errors.university} />
        <TextField label="Short bio" name="bio" value={draft.bio} change={(v) => change("bio", v)} max={240} rows={2} error={errors.bio} />
        <div className="grid gap-3.5 border-t border-hairline pt-4">
          <TextField label="GitHub profile URL" name="github" value={draft.github} change={(v) => change("github", v)} max={500} placeholder="https://github.com/your-name" optional error={errors.github} />
          <TextField label="LinkedIn profile URL" name="linkedin" value={draft.linkedin} change={(v) => change("linkedin", v)} max={500} placeholder="https://www.linkedin.com/in/your-name" optional error={errors.linkedin} />
        </div>
      </form>
    </ProfileDialog>
  );
}

export function AddEntryDialog({ tab, store, onAdded, onClose }: {
  tab: PortfolioTab; store: PortfolioStore; onAdded: (message: string) => void; onClose: () => void;
}) {
  const id = useId();
  const [draft, setDraft] = useState({ title: "", category: "", summary: "", year: "2026", demoUrl: "", codeUrl: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [showLinks, setShowLinks] = useState(false);
  const isProject = tab === "projects";
  const isExperience = tab === "experience";
  const titleLabel = isProject ? "Project title" : isExperience ? "Your role" : "Note title";
  const categoryLabel = isExperience ? "Organization or event" : "Category";
  const change = (key: keyof typeof draft, value: string) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found: Errors = {};
    const title = draft.title.trim();
    const category = draft.category.trim();
    const summary = tab === "notes" ? draft.summary.trim() : draft.summary.trim().replace(/\s+/g, " ");
    if (!title) found.title = `Add ${isExperience ? "the role you held" : "a title"} first.`;
    if (!category && (isProject || isExperience)) found.category = isProject ? "Add a category, like Web App or Satellite Data." : "Add your organization or event.";
    if (!summary) found.summary = isProject ? "Tell us what your project does in one line." : isExperience ? "Add a short description of what you did." : "Write your note before adding it.";
    if (isExperience && !/^(19|20)\d{2}$/.test(draft.year.trim())) found.year = "Enter a four-digit year, like 2026.";
    const demoUrl = publicLink(draft.demoUrl);
    const codeUrl = publicLink(draft.codeUrl, "repository");
    if (isProject && demoUrl === null) found.demoUrl = "Add a valid HTTPS website link.";
    if (isProject && codeUrl === null) found.codeUrl = "Use a link like https://github.com/name/project.";
    setErrors(found);
    if (Object.keys(found).length) {
      if (found.codeUrl || found.demoUrl) setShowLinks(true);
      return firstError(event.currentTarget, found);
    }
    const entryId = newEntryId();
    if (isProject) {
      store.addProject({ id: entryId, title, category, summary, cover: "notebook", demoUrl: demoUrl ?? "", codeUrl: codeUrl ?? "" });
      onAdded("Project added to your portfolio.");
    } else if (isExperience) {
      store.addExperience({ id: entryId, role: title, organization: category, summary, year: draft.year.trim(), icon: "club" });
      onAdded("Experience added to your portfolio.");
    } else {
      store.addNote({ id: entryId, title, category: category || "Student notes", paragraphs: summary.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean), minutes: readingTime(summary) });
      onAdded("Note added to your portfolio.");
    }
  }

  return (
    <ProfileDialog title={isProject ? "Add a project" : isExperience ? "Add experience" : "Add a note"} description={isProject ? "Show what you built. You can start with just a title, category and summary." : isExperience ? "Share your role and one thing you contributed." : "Share something you learned that could help another student."} focusField="title" onClose={onClose} footer={<FormActions form={id} label={isProject ? "Add Project" : "Add Entry"} add onClose={onClose} />}>
      <form id={id} onSubmit={submit} noValidate className="grid gap-4">
        <TextField label={titleLabel} name="title" value={draft.title} change={(v) => change("title", v)} max={isProject ? 110 : isExperience ? 100 : 120} placeholder={isProject ? "e.g. My first satellite map" : isExperience ? "e.g. Team designer" : "Give your note a title"} error={errors.title} />
        <TextField label={categoryLabel} name="category" value={draft.category} change={(v) => change("category", v)} max={isExperience ? 100 : isProject ? 80 : 60} placeholder={isExperience ? "e.g. University Tech Club" : isProject ? "e.g. Web App or Satellite Data" : "e.g. Learning notes"} optional={!isProject && !isExperience} list={isProject ? `${id}-categories` : undefined} error={errors.category} />
        {isProject && <datalist id={`${id}-categories`}>{["Web App", "Satellite Data", "Electronics", "3D Design", "Student Research"].map((c) => <option key={c} value={c} />)}</datalist>}
        {isExperience && <TextField label="Year" name="year" value={draft.year} change={(v) => change("year", v)} max={4} error={errors.year} />}
        <TextField label={isProject ? "One-line summary" : isExperience ? "What you did" : "Your note"} name="summary" value={draft.summary} change={(v) => change("summary", v)} rows={tab === "notes" ? 6 : 3} max={tab === "notes" ? 3000 : 280} placeholder={isProject ? "What does it do, and who is it for?" : isExperience ? "What was your part in the team?" : "Start with one thing you tried or learned..."} error={errors.summary} />
        {isProject && <>
          <button type="button" aria-expanded={showLinks} aria-controls={`${id}-links`} onClick={() => setShowLinks(!showLinks)} className="inline-flex w-fit items-center gap-2 rounded-full py-1.5 text-[13px] font-semibold text-cobalt"><ProfileIcon name="link" />{showLinks ? "Hide project links" : "Add project links (optional)"}</button>
          <div id={`${id}-links`} hidden={!showLinks}>
            <div className="grid gap-3">
              <TextField label="Live demo URL" name="demoUrl" value={draft.demoUrl} change={(v) => change("demoUrl", v)} max={500} placeholder="https://your-project.com" optional error={errors.demoUrl} />
              <TextField label="GitHub repository URL" name="codeUrl" value={draft.codeUrl} change={(v) => change("codeUrl", v)} max={500} placeholder="https://github.com/name/project" optional error={errors.codeUrl} />
            </div>
          </div>
        </>}
      </form>
    </ProfileDialog>
  );
}