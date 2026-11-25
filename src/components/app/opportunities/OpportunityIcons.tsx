import type { ReactNode } from "react";

interface IconProps {
  className?: string;
}

function Line({ className, children }: IconProps & { children: ReactNode }) {
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

export function BookmarkIcon({ className, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6.5 4.5h11a1 1 0 0 1 1 1v14l-6.5-4.2L5.5 19.5v-14a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <Line className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </Line>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Line>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <Line className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Line>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="M12 21s6.5-6.1 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </Line>
  );
}

export function UsersIcon({ className }: IconProps) {
  return (
    <Line className={className}>
      <circle cx="9" cy="8.5" r="3.4" />
      <path d="M3.5 19.5c1.1-3 3.1-4.5 5.5-4.5s4.4 1.5 5.5 4.5" />
      <path d="M16 5.4a3.4 3.4 0 0 1 0 6.4M17.6 15.4c1.4.7 2.4 2.1 2.9 4.1" />
    </Line>
  );
}

export function ExternalIcon({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="M14 4.5h5.5V10" />
      <path d="M19.5 4.5 11 13" />
      <path d="M18 14.5v4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6h4" />
    </Line>
  );
}

export function CalendarPlusIcon({ className }: IconProps) {
  return (
    <Line className={className}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4M12 13v5M9.5 15.5h5" />
    </Line>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </Line>
  );
}

export function SlidersIcon({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="M4 8h10M18 8h2M4 16h4M12 16h8" />
      <circle cx="16" cy="8" r="2" />
      <circle cx="10" cy="16" r="2" />
    </Line>
  );
}
