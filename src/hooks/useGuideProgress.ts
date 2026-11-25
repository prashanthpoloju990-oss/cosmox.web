import { useEffect, useState } from "react";
import { GUIDE_STEP_IDS, type GuidePlanOptions } from "@/data/careerGuide";

interface Progress {
  homePlan: GuidePlanOptions | null;
  checks: Record<string, string[]>;
}

const STORAGE_KEY = "cosmox-career-guide";
const EMPTY: Progress = { homePlan: null, checks: {} };
const stepIds = new Set<string>(GUIDE_STEP_IDS);

function isPlan(value: unknown): value is GuidePlanOptions {
  if (!value || typeof value !== "object") return false;
  const plan = value as Partial<GuidePlanOptions>;
  return (plan.branch === "cse" || plan.branch === "ece" || plan.branch === "mech")
    && (plan.goal === "startup" || plan.goal === "isro" || plan.goal === "hackathon")
    && (plan.experience === "beginner" || plan.experience === "basics" || plan.experience === "projects")
    && typeof plan.year === "number" && Number.isInteger(plan.year) && plan.year >= 1 && plan.year <= 4;
}

function readProgress(): Progress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Progress> | null;
    const checks = Object.fromEntries(Object.entries(parsed?.checks ?? {}).flatMap(([key, ids]) => {
      if (!/^(cse|ece|mech)-(startup|isro|hackathon)-(beginner|basics|projects)-[1-4]$/.test(key) || !Array.isArray(ids)) return [];
      return [[key, [...new Set(ids.filter((id) => stepIds.has(id)))]]];
    }));
    return { checks, homePlan: isPlan(parsed?.homePlan) ? parsed.homePlan : null };
  } catch {
    return EMPTY;
  }
}

export function useGuideProgress() {
  const [progress, setProgress] = useState<Progress>(readProgress);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Home and the guide still share progress in this session.
    }
  }, [progress]);

  function addToHome(options: GuidePlanOptions) {
    setProgress((previous) => ({ ...previous, homePlan: options }));
  }

  function toggleStep(planId: string, stepId: string) {
    setProgress((previous) => {
      const steps = previous.checks[planId] ?? [];
      const next = steps.includes(stepId) ? steps.filter((id) => id !== stepId) : [...steps, stepId];
      return { ...previous, checks: { ...previous.checks, [planId]: next } };
    });
  }

  return { ...progress, addToHome, toggleStep };
}

export type GuideProgress = ReturnType<typeof useGuideProgress>;