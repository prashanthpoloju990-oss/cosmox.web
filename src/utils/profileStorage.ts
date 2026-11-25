import {
  initialPortfolio, type ExperienceEntry, type NoteEntry, type ProfileInfo,
  type ProjectEntry, type StudentPortfolio,
} from "@/data/profile";
import type { StudentSession } from "@/utils/session";

type LinkKind = "web" | "github" | "linkedin" | "repository";

export function publicLink(value: string, kind: LinkKind = "web"): string | null {
  const input = value.trim();
  if (!input) return "";
  try {
    const url = new URL(input.includes(":") ? input : `https://${input}`);
    if (url.protocol !== "https:" || url.username || url.password || !url.hostname.includes(".")) return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const parts = url.pathname.split("/").filter(Boolean);
    if (kind === "github" && (host !== "github.com" || parts.length !== 1)) return null;
    if (kind === "repository" && (host !== "github.com" || parts.length < 2)) return null;
    if (kind === "linkedin" && (host !== "linkedin.com" || parts[0] !== "in" || !parts[1])) return null;
    return url.href;
  } catch {
    return null;
  }
}

const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const text = (value: unknown, max: number, fallback = "") => typeof value === "string" ? value.trim().slice(0, max) : fallback;
const list = <T,>(value: unknown, parse: (item: Record<string, unknown>) => T | null): T[] =>
  Array.isArray(value) ? value.slice(0, 150).map((item) => parse(record(item))).filter((item): item is T => item !== null) : [];

function parsePortfolio(raw: unknown, defaults: StudentPortfolio): StudentPortfolio | null {
  const data = record(raw);
  if (data.version !== 1) return null;
  const fields = record(data.info);
  const info: ProfileInfo = { ...defaults.info };
  for (const key of ["name", "branch", "year", "university", "bio"] as const) {
    info[key] = text(fields[key], key === "bio" ? 240 : 120, info[key]) || defaults.info[key];
  }
  info.github = publicLink(text(fields.github, 500), "github") || "";
  info.linkedin = publicLink(text(fields.linkedin, 500), "linkedin") || "";
  const projectLinks: Record<string, string> = {};
  for (const [id, value] of Object.entries(record(data.projectLinks))) {
    const url = publicLink(text(value, 500), "repository");
    if (/^[\w-]{1,80}$/.test(id) && url) projectLinks[id] = url;
  }
  return {
    version: 1, info, projectLinks,
    avatar: data.avatar === 1 || data.avatar === 2 ? data.avatar : 0,
    addedProjects: list<ProjectEntry>(data.addedProjects, (item) => {
      if (!text(item.id, 80) || !text(item.title, 110) || !text(item.summary, 280)) return null;
      return {
        id: text(item.id, 80), title: text(item.title, 110), summary: text(item.summary, 280),
        category: text(item.category, 80, "Student project"), cover: "notebook",
        demoUrl: publicLink(text(item.demoUrl, 500)) || "", codeUrl: publicLink(text(item.codeUrl, 500), "repository") || "",
      };
    }),
    addedExperience: list<ExperienceEntry>(data.addedExperience, (item) => {
      if (!text(item.id, 80) || !text(item.role, 100) || !text(item.organization, 100)) return null;
      return { id: text(item.id, 80), role: text(item.role, 100), organization: text(item.organization, 100), year: text(item.year, 4), summary: text(item.summary, 280), icon: "club" };
    }),
    addedNotes: list<NoteEntry>(data.addedNotes, (item) => {
      const paragraphs = Array.isArray(item.paragraphs) ? item.paragraphs.map((p) => text(p, 3000)).filter(Boolean) : [];
      if (!text(item.id, 80) || !text(item.title, 120) || !paragraphs.length) return null;
      return { id: text(item.id, 80), title: text(item.title, 120), category: text(item.category, 60, "Student notes"), paragraphs, minutes: readingTime(paragraphs.join(" ")) };
    }),
  };
}

export function readingTime(body: string) {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 200));
}

export function newEntryId() {
  return globalThis.crypto?.randomUUID?.() ?? `entry-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function profileKey(name: string) {
  return `cosmox-portfolio-v1:${encodeURIComponent(name.trim().toLowerCase())}`;
}

export function loadPortfolio(session: StudentSession) {
  const defaults = initialPortfolio(session);
  try {
    const raw = localStorage.getItem(profileKey(session.name));
    if (raw) {
      const profile = parsePortfolio(JSON.parse(raw), defaults);
      if (profile) return { ...profile, info: { ...profile.info, name: session.name, branch: session.branch, year: session.year } };
    }
  } catch { /* A fresh profile is still usable without browser storage. */ }
  return defaults;
}

// Only public portfolio fields travel in the fragment. Seed entries are already in the app.
export function shareProfileUrl(profile: StudentPortfolio): string {
  const defaults = initialPortfolio();
  const info = Object.fromEntries(Object.entries(profile.info).filter(([key, value]) => value !== defaults.info[key as keyof ProfileInfo]));
  const snapshot = {
    version: 1,
    ...(Object.keys(info).length ? { info } : {}),
    ...(profile.avatar ? { avatar: profile.avatar } : {}),
    ...(profile.addedProjects.length ? { addedProjects: profile.addedProjects } : {}),
    ...(profile.addedExperience.length ? { addedExperience: profile.addedExperience } : {}),
    ...(profile.addedNotes.length ? { addedNotes: profile.addedNotes } : {}),
    ...(Object.keys(profile.projectLinks).length ? { projectLinks: profile.projectLinks } : {}),
  };
  const bytes = new TextEncoder().encode(JSON.stringify(snapshot));
  const encoded = btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join("")).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = `/app/profile?view=${encoded}`;
  return url.href;
}

export function readSharedPortfolio(hash: string): StudentPortfolio | "invalid" | null {
  const params = new URLSearchParams(hash.split("?")[1] ?? "");
  const encoded = params.get("view");
  if (encoded === null) return null;
  try {
    if (!encoded || encoded.length > 1000000) return "invalid";
    const bytes = Uint8Array.from(atob(encoded.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
    return parsePortfolio(JSON.parse(new TextDecoder().decode(bytes)), initialPortfolio()) ?? "invalid";
  } catch {
    return "invalid";
  }
}

export async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch { /* Try the selection-based fallback on older browsers. */ }
  const previous = document.activeElement as HTMLElement | null;
  const field = document.createElement("textarea");
  field.value = value;
  field.style.cssText = "position:fixed;inset:0;z-index:-1;opacity:0;";
  document.body.appendChild(field);
  try {
    field.select();
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    field.remove();
    previous?.focus({ preventScroll: true });
  }
}