export interface StudentSession {
  name: string;
  branch: string;
  year: string;
}

const KEY = "cosmox-student-session";

export const DEFAULT_SESSION: StudentSession = {
  name: "Prashanth",
  branch: "CSE / Data Science",
  year: "2nd Year",
};

export function getSession(): StudentSession {
  if (typeof window === "undefined") return DEFAULT_SESSION;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      return { ...DEFAULT_SESSION, ...(JSON.parse(raw) as Partial<StudentSession>) };
    }
  } catch {
    /* storage can be blocked; fall back to the default student */
  }
  return DEFAULT_SESSION;
}

export function startSession(patch: Partial<StudentSession>) {
  const clean = Object.fromEntries(
    Object.entries(patch).filter(([, value]) => typeof value === "string" && value.trim() !== ""),
  );
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...getSession(), ...clean }));
  } catch {
    /* ignore storage errors */
  }
}

export function endSession() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore storage errors */
  }
}

export function branchCode(branch: string): string {
  if (branch.startsWith("CSE")) return "CSE-DS";
  if (branch.startsWith("ECE")) return "ECE";
  if (branch.startsWith("Mech")) return "MECH";
  return "STEM";
}

export function yearShort(year: string): string {
  return `${year.split(" ")[0]} Yr`;
}
