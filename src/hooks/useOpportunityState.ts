import { useCallback, useEffect, useState } from "react";
import { OPPORTUNITIES, SEEDED_SAVED } from "@/data/opportunities";

export interface OpportunityState {
  saved: string[];
  /** Opportunity id → indexes of the prep steps the student has ticked. */
  prep: Record<string, number[]>;
  applied: string[];
  registered: string[];
  /** Opportunity id → invited teammate ids. */
  invites: Record<string, string[]>;
}

const KEY = "cosmox-opportunity-state";

const EMPTY: OpportunityState = {
  saved: SEEDED_SAVED,
  prep: {},
  applied: [],
  registered: [],
  invites: {},
};

const validIds = new Set(OPPORTUNITIES.map((item) => item.id));

function readState(): OpportunityState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<OpportunityState>;
    const ids = (value: unknown) =>
      Array.isArray(value) ? value.filter((id): id is string => typeof id === "string" && validIds.has(id)) : [];

    return {
      saved: Array.isArray(parsed.saved) ? ids(parsed.saved) : SEEDED_SAVED,
      prep: typeof parsed.prep === "object" && parsed.prep ? parsed.prep : {},
      applied: ids(parsed.applied),
      registered: ids(parsed.registered),
      invites: typeof parsed.invites === "object" && parsed.invites ? parsed.invites : {},
    };
  } catch {
    return EMPTY;
  }
}

const toggleId = (list: string[], id: string) =>
  list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

/** Saved items, prep ticks, applications and invites — kept in the browser between visits. */
export function useOpportunityState() {
  const [state, setState] = useState<OpportunityState>(readState);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage can be blocked; the screen still works for this visit */
    }
  }, [state]);

  const toggleSaved = useCallback((id: string) => {
    setState((prev) => ({ ...prev, saved: toggleId(prev.saved, id) }));
  }, []);

  const setSaved = useCallback((id: string, on: boolean) => {
    setState((prev) => {
      const has = prev.saved.includes(id);
      if (has === on) return prev;
      return { ...prev, saved: toggleId(prev.saved, id) };
    });
  }, []);

  const togglePrepStep = useCallback((id: string, index: number) => {
    setState((prev) => {
      const current = prev.prep[id] ?? [];
      const next = current.includes(index)
        ? current.filter((step) => step !== index)
        : [...current, index];
      return { ...prev, prep: { ...prev.prep, [id]: next } };
    });
  }, []);

  const toggleApplied = useCallback((id: string) => {
    setState((prev) => ({ ...prev, applied: toggleId(prev.applied, id) }));
  }, []);

  const toggleRegistered = useCallback((id: string) => {
    setState((prev) => ({ ...prev, registered: toggleId(prev.registered, id) }));
  }, []);

  const toggleInvite = useCallback((id: string, teammateId: string) => {
    setState((prev) => ({
      ...prev,
      invites: { ...prev.invites, [id]: toggleId(prev.invites[id] ?? [], teammateId) },
    }));
  }, []);

  return {
    state,
    toggleSaved,
    setSaved,
    togglePrepStep,
    toggleApplied,
    toggleRegistered,
    toggleInvite,
  };
}
