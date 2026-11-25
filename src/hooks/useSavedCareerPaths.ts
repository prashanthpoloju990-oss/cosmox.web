import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cosmox-saved-career-paths";

function readSaved(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? [...new Set(parsed.filter((item): item is string => typeof item === "string"))] : [];
  } catch {
    return [];
  }
}

export function useSavedCareerPaths() {
  const [savedIds, setSavedIds] = useState<string[]>(readSaved);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
    } catch {
      // Saved paths still work for this visit if storage is unavailable.
    }
  }, [savedIds]);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [id, ...current]));
  }, []);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  return { savedIds, toggleSaved, isSaved };
}
