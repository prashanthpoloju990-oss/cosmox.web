import { useCallback, useEffect, useState } from "react";
import { ARTICLES, LAUNCHES } from "@/data/news";

interface NewsState {
  saved: string[];
  reminders: string[];
}

const KEY = "cosmox-news-state";
const articleIds = new Set(ARTICLES.map((item) => item.id));
const launchIds = new Set(LAUNCHES.map((item) => item.id));

function readState(): NewsState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { saved: [], reminders: [] };
    const parsed = JSON.parse(raw) as Partial<NewsState>;
    const pick = (value: unknown, allowed: Set<string>) =>
      Array.isArray(value)
        ? value.filter((id): id is string => typeof id === "string" && allowed.has(id))
        : [];
    return { saved: pick(parsed.saved, articleIds), reminders: pick(parsed.reminders, launchIds) };
  } catch {
    return { saved: [], reminders: [] };
  }
}

const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

/** Saved articles and launch reminders, kept in the browser between visits. */
export function useNewsState() {
  const [state, setState] = useState<NewsState>(readState);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage can be blocked; the screen still works for this visit */
    }
  }, [state]);

  const toggleSaved = useCallback((id: string) => {
    setState((prev) => ({ ...prev, saved: toggle(prev.saved, id) }));
  }, []);

  const toggleReminder = useCallback((id: string) => {
    setState((prev) => ({ ...prev, reminders: toggle(prev.reminders, id) }));
  }, []);

  return { state, toggleSaved, toggleReminder };
}

/** Current time, refreshed every `intervalMs`. Used by the live countdowns. */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}
