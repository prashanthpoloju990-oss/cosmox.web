import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

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
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M20 12H4m6-6-6 6 6 6" />
    </Base>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </Base>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.2 4.2" />
    </Base>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="m4.5 12.5 5 5L19.5 7" />
    </Base>
  );
}

export function BookmarkIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M6.5 3.8h11V20L12 16.6 6.5 20Z" />
    </Base>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M12 5v14M5 12h14" />
    </Base>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.2 2" />
    </Base>
  );
}

export function RoleIcon({ kind, className }: IconProps & { kind: string }) {
  switch (kind) {
    case "code":
      return <Base className={className}><rect x="3" y="4.5" width="18" height="13" rx="2.5" /><path d="m8.5 9.5-2 2.5 2 2.5m7-5 2 2.5-2 2.5M3 20.5h18" /></Base>;
    case "satellite-data":
      return <Base className={className}><rect x="9" y="8" width="7" height="7" rx="1.5" /><path d="M8.5 9 4 6.8v5L8.5 14m8-5 4.5-2.2v5L16.5 14M12 15v3.5m-3 2h6" /><path d="M6 20.5c2-1.4 4-1.4 6 0s4 1.4 6 0" /></Base>;
    case "chip":
      return <Base className={className}><rect x="7" y="7" width="10" height="10" rx="2" /><rect x="10.2" y="10.2" width="3.6" height="3.6" rx="1" /><path d="M9 7V4m5 3V4M9 20v-3m5 3v-3M7 9H4m3 5H4m16-5h-3m3 5h-3" /></Base>;
    case "flame":
      return <Base className={className}><path d="M12 3.5c2.8 3.2 5.5 5.8 5.5 9.3a5.5 5.5 0 0 1-11 0c0-1.5.5-2.8 1.3-4.2.8 1 1.6 1.7 2.7 2.2C10.3 8 11 5.6 12 3.5Z" /><path d="M12 20.5a2.9 2.9 0 0 1-2.9-2.9c0-1.7 1.3-2.8 2.9-4.6 1.6 1.8 2.9 2.9 2.9 4.6A2.9 2.9 0 0 1 12 20.5Z" /></Base>;
    case "radio":
      return <Base className={className}><path d="M5 19a8.5 8.5 0 0 1 12-12" /><path d="M5 14.5A4.8 4.8 0 0 1 12.5 7" /><circle cx="6" cy="18" r="1.6" fill="currentColor" stroke="none" /><path d="M13 20.5 19 10l3 1.2L16.5 21z" /></Base>;
    case "navigation":
      return <Base className={className}><circle cx="12" cy="12" r="8.5" /><path d="m15.5 8.5-2 5-5 2 2-5z" /><circle cx="12" cy="12" r=".8" fill="currentColor" /></Base>;
    case "structure":
      return <Base className={className}><path d="m12 3.5 8 4.5v8l-8 4.5-8-4.5V8z" /><path d="M4 8l8 4.5L20 8M12 12.5V20M7.5 5.8v8M16.5 5.8v8" /></Base>;
    case "ops":
      return <Base className={className}><rect x="3.5" y="4.5" width="17" height="12" rx="2.5" /><path d="M7 12h3l1.5-3 2 5L15 12h2M9 20.5h6" /></Base>;
    case "orbit":
      return <Base className={className}><circle cx="12" cy="12" r="3" /><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(-25 12 12)" /><circle cx="19" cy="7.5" r="1.4" fill="currentColor" stroke="none" /></Base>;
    case "thermal":
      return <Base className={className}><path d="M10 4a2 2 0 0 1 4 0v8.3a4.5 4.5 0 1 1-4 0Z" /><path d="M12 9v7M18.5 5.5h.01M20 10h.01M18.5 14.5h.01M5.5 6.5 7 8M4 12h2" /></Base>;
    case "cubesat":
      return <Base className={className}><rect x="8" y="7" width="8" height="10" rx="1.8" /><path d="M8 10H4.5v6H8m8-6h3.5v6H16M11 10.5h2M11 14h2" /></Base>;
    case "ground":
      return <Base className={className}><path d="M12 20.5v-6M7 20.5h10" /><path d="M12 14.5a6.5 6.5 0 0 1-6.5-6.5L12 4l6.5 4A6.5 6.5 0 0 1 12 14.5Z" /><circle cx="12" cy="9" r="1.2" fill="currentColor" stroke="none" /><path d="M3.5 5.5a8 8 0 0 1 3-3M20.5 5.5a8 8 0 0 0-3-3" /></Base>;
    case "robot":
      return <Base className={className}><rect x="6" y="8" width="12" height="9" rx="3" /><path d="M12 8V5m-4 12-2 3m12-3 2 3M4 13H2.8M21.2 13H20" /><circle cx="9.5" cy="12" r=".9" fill="currentColor" stroke="none" /><circle cx="14.5" cy="12" r=".9" fill="currentColor" stroke="none" /><path d="M10 15h4" /></Base>;
    case "lens":
      return <Base className={className}><rect x="3.5" y="6" width="17" height="13" rx="3" /><circle cx="12" cy="12.5" r="3.7" /><path d="M8 6l1.2-2h5.6L16 6M18 9.5h.01" /></Base>;
    case "map":
      return <Base className={className}><path d="m4 6 5-2 6 2 5-2v14l-5 2-6-2-5 2z" /><path d="M9 4v14m6-12v14" /><circle cx="12" cy="11" r="1.8" /></Base>;
    case "simulation":
      return <Base className={className}><path d="M12 3.5c2 2.3 3 5.2 3 8l-3 4.5-3-4.5c0-2.8 1-5.7 3-8Z" /><circle cx="12" cy="9" r="1.4" /><path d="M9 13.5 5 18l4-1m6-3.5L19 18l-4-1M10 20.5h4" /></Base>;
    case "qa":
      return <Base className={className}><rect x="5" y="4" width="14" height="17" rx="2.5" /><path d="M9 4.5V3h6v1.5M9 11l2 2 4-4.5M9 17h6" /></Base>;
    case "data":
      return <Base className={className}><path d="M7 18a4.5 4.5 0 1 1 .8-8.9A5.5 5.5 0 0 1 18.5 11 3.8 3.8 0 0 1 17.5 18Z" /><path d="M9 17.5v-3m3 3v-5m3 5v-4" /></Base>;
    case "power":
      return <Base className={className}><circle cx="9" cy="9" r="3" /><path d="M9 3v2m0 8v2M3 9h2m8 0h2M5.2 5.2l1.4 1.4m4.8 4.8 1.4 1.4m0-7.6-1.4 1.4M6.6 11.4 5.2 12.8M14 14l-2.2 3.5H14L12.5 21 17 16.8h-2.4L16.5 14z" /></Base>;
    case "policy":
      return <Base className={className}><path d="M7 4h8l4 4v12H7z" /><path d="M15 4v4h4M9.5 12h5m-5 3.5h5" /><circle cx="17" cy="17" r="3.5" /><path d="m15.8 17 1 1 1.8-2" /></Base>;
    default:
      return <Base className={className}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></Base>;
  }
}

const ACCENTS = {
  orange: "bg-[#FFF0E7] text-booster ring-[#F3C6B2]",
  cobalt: "bg-[#EAF0F8] text-cobalt ring-[#C4D4E8]",
  amber: "bg-[#FFF6DE] text-[#9A6A00] ring-[#F0D391]",
  slate: "bg-stone text-ink ring-hairline",
} as const;

export function RoleIconBadge({ kind, accent, className }: { kind: string; accent: keyof typeof ACCENTS; className?: string }) {
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-2xl ring-1", ACCENTS[accent], className ?? "h-12 w-12")}>
      <RoleIcon kind={kind} className="h-6 w-6" />
    </span>
  );
}
