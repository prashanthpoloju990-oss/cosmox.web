import type { ReactNode } from "react";

const icons = {
  edit: <><path d="m5 15 10.6-10.6a2.2 2.2 0 0 1 3.1 3.1L8.1 18.1 4 19Z" fill="#D94E1F" fillOpacity=".12" /><path d="m13.5 6.5 3.1 3.1M13 19h7" /></>,
  share: <><path d="m8.3 11 7.4-4.3m-7.4 6.8 7.4 4" /><g fill="#E8EFF6" stroke="#1E4D8C"><circle cx="6" cy="12" r="2.8" /><circle cx="18" cy="5.5" r="2.8" /><circle cx="18" cy="18.5" r="2.8" /></g></>,
  github: <path fill="currentColor" stroke="none" d="M12 1.8a10.2 10.2 0 0 0-3.23 19.87c.52.09.7-.23.7-.5v-1.9c-2.86.62-3.47-1.23-3.47-1.23-.46-1.19-1.14-1.5-1.14-1.5-.94-.65.07-.64.07-.64 1.04.07 1.59 1.07 1.59 1.07.92 1.58 2.42 1.12 3.01.86.09-.67.36-1.13.65-1.39-2.28-.26-4.68-1.14-4.68-5.08 0-1.12.4-2.04 1.06-2.76-.1-.26-.46-1.31.1-2.73 0 0 .87-.28 2.81 1.05a9.8 9.8 0 0 1 5.12 0c1.95-1.33 2.8-1.05 2.8-1.05.57 1.42.21 2.47.11 2.73.66.72 1.05 1.64 1.05 2.76 0 3.95-2.4 4.82-4.69 5.07.38.32.7.94.7 1.9v2.84c0 .27.18.6.71.5A10.2 10.2 0 0 0 12 1.8Z" />,
  linkedin: <><rect x="2" y="2" width="20" height="20" rx="4" fill="#1E4D8C" stroke="none" /><path d="M7 10v7m4-7v7m0-4c0-4 5.7-4.3 5.7-.2V17" stroke="white" strokeWidth="2.2" /><circle cx="7" cy="6.8" r="1.3" fill="white" stroke="none" /></>,
  external: <path d="M6 18 18 6M7 6h11v11" />,
  palette: <><path d="M12.5 3.5c-5.3 0-9 3.8-9 8.7s3.6 8.3 8.4 8.3c2.4 0 3.4-.7 3.3-2-.1-1.3-1.5-1.8-1.3-3 .2-1.6 2.1-1.8 3.8-1.8 2.2 0 3.1-1.5 2.8-3.5-.5-4-3.9-6.7-8-6.7Z" fill="#FFF6E7" /><g stroke="none"><circle cx="7.8" cy="11.5" r="1.5" fill="#D94E1F" /><circle cx="10.8" cy="7.6" r="1.5" fill="#F59E0B" /><circle cx="15.5" cy="8.5" r="1.5" fill="#1E4D8C" /></g></>,
  seal: <><path d="m12 2.5 3 1.6 3.4.4 1.1 3.2 2 2.8-1 3.3-.3 3.4-3.1 1.6-2.5 2.2-3.3-.7-3.5.2-2-2.8-2.6-2.3.3-3.4-.5-3.4 2.7-2.2L7.6 4l3.4.1Z" fill="currentColor" stroke="none" /><path d="m8 11.9 2.5 2.6 5.4-5.8" stroke="white" strokeWidth="1.9" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2.6" /><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10m-3.5 4v3" /></>,
  check: <path d="m4.5 12.3 4.8 4.8L19.5 6.9" />,
  plus: <path d="M12 4.5v15M4.5 12h15" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  projects: <><rect x="3.3" y="4.3" width="17.4" height="15.4" rx="2.5" /><path d="M3.5 9h17m-13 4 2.5 2-2.5 2m5-1h3" /></>,
  experience: <><rect x="3" y="7.5" width="18" height="13" rx="2.6" /><path d="M8.5 7.5V5h7v2.5M3.5 12c4.5 2 12.5 2 17 0M12 12v3" /></>,
  notes: <><path d="M5.5 3.5h9l4 4V20H5.5Z" /><path d="M14.5 3.5v4.3h4m-10 4h7m-7 3.8h5" /></>,
  copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M15.5 8V3.5h-12v13H8" /></>,
  arrow: <path d="M3.5 12h16m-6-6 6 6-6 6" />,
  time: <><circle cx="12" cy="12" r="8.7" /><path d="M12 7v5.4l3.5 1.8" /></>,
  link: <><path d="m10 14 4-4m-4.7 5.7L7.8 18a3.6 3.6 0 0 1-5-5l3.6-3.6a3.6 3.6 0 0 1 5.1 0m1-1 3.1-3.1a3.6 3.6 0 0 1 5.1 5.1l-3.6 3.6a3.6 3.6 0 0 1-5.1 0" /></>,
  team: <><circle cx="9.5" cy="7.7" r="3.1" fill="#A4C9E7" stroke="#1E4D8C" /><path d="M3 19c.5-3.7 2.8-5.8 6.5-5.8S15.5 15.3 16 19Z" fill="#5E93C6" stroke="#1E4D8C" /><path d="M16 5a3.2 3.2 0 0 1 0 6M17.6 14c2.1.6 3.2 2.4 3.4 5" stroke="#D18A35" /></>,
  club: <><path d="M4 7h4l10-4v14l-10-4H4Z" fill="#FFC687" stroke="#B9552C" /><path d="m6 14 2 6.5h3L9 14m12-7v5" stroke="#945431" /><path d="M8 7v6" stroke="#FFF3C9" /></>,
  design: <><rect x="2.5" y="4.5" width="19" height="14" rx="3" fill="#C2E4DC" stroke="#28776E" /><path d="M3 9h18M8.5 12l-2 2 2 2m7-4 2 2-2 2m-2.9-3.5-1.4 4" stroke="#28776E" /></>,
} satisfies Record<string, ReactNode>;

export function ProfileIcon({ name, className = "h-4 w-4" }: { name: keyof typeof icons; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={className}>{icons[name]}</svg>;
}