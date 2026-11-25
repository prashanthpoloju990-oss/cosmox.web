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

export function BellIcon({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2H4.5Z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </Line>
  );
}

export function BulbIcon({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="M9 17.5h6M10 20.5h4" />
      <path d="M12 3.5a5.5 5.5 0 0 0-3.2 10c.7.5 1.2 1.3 1.2 2.2v1.8h4v-1.8c0-.9.5-1.7 1.2-2.2A5.5 5.5 0 0 0 12 3.5Z" />
    </Line>
  );
}

export function RocketIcon({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="M12 3c3 2.2 4.5 5.5 4.5 9.5L15 16H9l-1.5-3.5C7.5 8.5 9 5.2 12 3Z" />
      <circle cx="12" cy="10" r="1.6" />
      <path d="M9 16l-2.5 2.5L9 19M15 16l2.5 2.5L15 19M12 17v4" />
    </Line>
  );
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <Line className={className}>
      <path d="m6 9 6 6 6-6" />
    </Line>
  );
}
