import type { ReactNode } from "react";
import type { AppTab } from "@/utils/appRoute";

interface IconProps {
  className?: string;
}

function Base({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function TabIcon({ id, className }: IconProps & { id: AppTab }) {
  switch (id) {
    case "home":
      return (
        <Base className={className}>
          <path d="M3.5 10.5 12 3.5l8.5 7" />
          <path d="M5.5 9.5V20h13V9.5" />
          <path d="M10 20v-5h4v5" />
        </Base>
      );
    case "opportunities":
      return (
        <Base className={className}>
          <rect x="3.5" y="5" width="17" height="15.5" rx="3.5" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
        </Base>
      );
    case "news":
      return (
        <Base className={className}>
          <circle cx="12" cy="12" r="2.8" />
          <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-28 12 12)" />
        </Base>
      );
    case "roadmaps":
      return (
        <Base className={className}>
          <path d="m4 6 5-2 6 2 5-2v14l-5 2-6-2-5 2Z" />
          <path d="M9 4v14m6-12v14" />
          <path d="M6.5 15.5c2.5-4 5-1.8 6.5-5" />
          <circle cx="6.5" cy="15.5" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="17.5" cy="7" r="1.4" fill="currentColor" stroke="none" />
        </Base>
      );
    case "ai-guide":
      return (
        <Base className={className}>
          <path d="M12 3.5l1.9 4.6 4.6 1.9-4.6 1.9L12 16.5l-1.9-4.6-4.6-1.9 4.6-1.9Z" />
          <path d="M18.5 16v4M16.5 18h4" />
        </Base>
      );
    case "profile":
      return (
        <Base className={className}>
          <circle cx="12" cy="8.5" r="3.8" />
          <path d="M4.5 20.5c1.4-3.6 4.1-5.2 7.5-5.2s6.1 1.6 7.5 5.2" />
        </Base>
      );
    default:
      return (
        <Base className={className}>
          <circle cx="12" cy="8.5" r="3.8" />
          <path d="M4.5 20.5c1.4-3.6 4.1-5.2 7.5-5.2s6.1 1.6 7.5 5.2" />
        </Base>
      );
  }
}

export function ReplayIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M4 12a8 8 0 1 0 2.4-5.7" />
      <path d="M4 4.5V9h4.5" />
    </Base>
  );
}

export function SignOutIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M14 4.5h4.5a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H14" />
      <path d="M10 8l-4 4 4 4M6 12h9" />
    </Base>
  );
}
