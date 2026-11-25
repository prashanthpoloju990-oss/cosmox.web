import { useEffect, useState } from "react";

export type AppTab = "home" | "opportunities" | "news" | "roadmaps" | "ai-guide" | "profile";

export interface AppTabDef {
  id: AppTab;
  label: string;
  short: string;
  path: string;
}

export const APP_TABS: AppTabDef[] = [
  { id: "home", label: "Home", short: "Home", path: "#/app" },
  { id: "opportunities", label: "Internships & Events", short: "Events", path: "#/app/opportunities" },
  { id: "news", label: "Space News & Launches", short: "News", path: "#/app/news" },
  { id: "roadmaps", label: "Career Roadmaps", short: "Roadmaps", path: "#/app/roadmaps" },
  { id: "ai-guide", label: "AI Career Guide", short: "AI Guide", path: "#/app/ai-guide" },
  { id: "profile", label: "My Profile", short: "Profile", path: "#/app/profile" },
];

/** Returns the app tab for an app hash, or null when the hash is not inside the app. */
export function getAppTab(hash: string): AppTab | null {
  const match = /^#\/app(?:\/([a-z-]+))?\/?$/.exec(hash.split("?")[0]);
  if (!match) return null;
  const found = APP_TABS.find((tab) => tab.id === match[1]);
  return found ? found.id : "home";
}

/** Keeps the current hash in React state so the app re-renders on every route change. */
export function useHash(): string {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    window.addEventListener("cosmox:route", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
      window.removeEventListener("cosmox:route", sync);
    };
  }, []);

  return hash;
}

export function navigateApp(tab: AppTab) {
  const path = APP_TABS.find((item) => item.id === tab)?.path ?? "#/app";
  if (window.location.hash === path) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  window.location.hash = path;
}

/* ── Event detail routes: #/event/<id> ─────────────────────────── */
export function getEventDetailId(hash: string): string | null {
  const match = /^#\/event\/([a-z0-9-]+)\/?$/i.exec(hash);
  return match ? match[1] : null;
}

export function navigateToEvent(id: string) {
  window.location.hash = `#/event/${id}`;
}

/** Leaves the event detail page, lands back on the marketing page and scrolls to #community. */
export function navigateToCommunity() {
  window.history.pushState(null, "", window.location.pathname + window.location.search);
  window.dispatchEvent(new Event("cosmox:route"));
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const el = document.getElementById("community");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
    });
  });
}
