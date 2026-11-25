import type { ReactNode } from "react";

export type GuideIconName = "roadmap" | "idea" | "question" | "profile" | "work" | "institute" | "trophy" | "clock" | "spark" | "check" | "chevron";

const glyphs: Record<GuideIconName, ReactNode> = {
  roadmap: <><circle cx="5.5" cy="17.5" r="2.5" /><circle cx="18.5" cy="6.5" r="2.5" /><path d="M8 17.5h6a2.5 2.5 0 0 0 0-5h-4a3 3 0 0 1 0-6h6" /></>,
  idea: <><path d="M8.5 17v-1.2c0-1.5-2.5-2.5-2.5-6a6 6 0 0 1 12 0c0 3.5-2.5 4.5-2.5 6V17zM9.5 20h5M12 17v-5m-2-2 2 2 2-2" /></>,
  question: <><path d="M6.5 17.5 4 20V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7.5a3 3 0 0 1-3 3Z" /><path d="M10 9a2 2 0 1 1 3 1.7c-.8.5-1 1-1 1.3m0 2.5h.01" /></>,
  profile: <><circle cx="12" cy="8" r="3.4" /><path d="M5 20v-1.5a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4V20" /></>,
  work: <><rect x="3.5" y="7.5" width="17" height="12" rx="3" /><path d="M9 7.5V5h6v2.5M3.5 12.5a27 27 0 0 0 17 0M12 12.5v2" /></>,
  institute: <><path d="m3.5 8 8.5-4.5L20.5 8v2h-17zM6 11.5v5m6-5v5m6-5v5M4 19.5h16" /><path d="M12 7.5h.01" /></>,
  trophy: <><path d="M8 4h8v7a4 4 0 0 1-8 0zM8 6H4.5v2A3.5 3.5 0 0 0 8 11.5M16 6h3.5v2a3.5 3.5 0 0 1-3.5 3.5M12 15v4m-4 1h8" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  spark: <><path d="m10.5 3 1.8 4.7L17 9.5l-4.7 1.8-1.8 4.7-1.8-4.7L4 9.5l4.7-1.8zM18 14v6m-3-3h6" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  chevron: <path d="m6 9 6 6 6-6" />,
};

export function GuideIcon({ name, className }: { name: GuideIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {glyphs[name]}
    </svg>
  );
}