import { useId } from "react";
import type { ProjectEntry } from "@/data/profile";

function HubPreview() {
  const id = useId();
  return (
    <svg viewBox="0 0 600 210" role="img" aria-label="Cosmox web app preview with a miniature student dashboard on a blue background" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="1" x2="1" y2="0"><stop stopColor="#132F54" /><stop offset=".58" stopColor="#23558C" /><stop offset="1" stopColor="#688CAF" /></linearGradient>
        <pattern id={`${id}-dots`} width="15" height="15" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".8" fill="#C4E4ED" opacity=".36" /></pattern>
      </defs>
      <path fill={`url(#${id}-sky)`} d="M0 0h600v210H0z" />
      <path fill={`url(#${id}-dots)`} d="M0 0h600v210H0z" />
      <g fill="none" stroke="#BCD7E3" opacity=".41" strokeWidth="1">
        <ellipse cx="102" cy="95" rx="178" ry="69" transform="rotate(-24 102 95)" />
        <ellipse cx="100" cy="98" rx="212" ry="98" transform="rotate(-24 100 98)" strokeDasharray="2 6" />
      </g>
      <circle cx="144" cy="19" r="3" fill="#F5BC7A" />
      <g transform="translate(24 69)">
        <g transform="translate(4 -31)" fill="none" stroke="#F7F5F0"><ellipse cx="14" cy="13" rx="16" ry="6" transform="rotate(-25 14 13)" /><circle cx="14" cy="13" r="11" /><circle cx="27" cy="6" r="2.8" fill="#EE9959" stroke="none" /></g>
        <text x="0" y="26" fill="#FFF9EE" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="35" fontWeight="600" letterSpacing="-2">COSMOX</text>
        <text x="2" y="48" fill="#DAE6EE" fontFamily="'JetBrains Mono', monospace" fontSize="9.5" letterSpacing="1.5">STUDENT CAREER HUB</text>
      </g>
      <g transform="translate(224 25) rotate(-5 177 95)">
        <rect x="4" y="7" width="357" height="220" rx="12" fill="#0D2645" opacity=".42" />
        <rect width="357" height="220" rx="10" fill="#F7F5F0" stroke="#FFFFFF" strokeWidth="1.5" />
        <path d="M0 17h357" stroke="#DCD8CE" />
        {[8,15,22].map((x, i) => <circle key={x} cx={x} cy="8" r="2" fill={["#D98060", "#E6B465", "#90AE9D"][i]} />)}
        <rect x="128" y="4" width="102" height="7.5" rx="3.7" fill="#E7E5DF" />
        <text x="179" y="9.8" textAnchor="middle" fill="#575A61" fontFamily="monospace" fontSize="4.6">cosmox / student home</text>
        <rect x="8" y="25" width="77" height="182" rx="6" fill="#FFFFFF" stroke="#DDDAD2" />
        <g fill="none" stroke="#23354B"><circle cx="20" cy="39" r="5.6" /><ellipse cx="20" cy="39" rx="7" ry="2.6" transform="rotate(-25 20 39)" strokeWidth=".8" /></g>
        <text x="31" y="42" fill="#141518" fontFamily="sans-serif" fontSize="9" fontWeight="700">COSMOX</text>
        <rect x="14" y="52" width="65" height="14" rx="7" fill="#D94E1F" />
        <text x="23" y="61.6" fill="white" fontSize="6.1" fontFamily="sans-serif">Home</text>
        {["Internships & Events", "Space News", "AI Career Guide", "My Profile"].map((name,i) => <g key={name}><circle cx="19" cy={78+i*15} r="2" fill="#9AA8B7" /><text x="26" y={80+i*15} fill="#575A61" fontSize="5.9" fontFamily="sans-serif">{name}</text></g>)}
        <text x="99" y="39" fontFamily="monospace" fontSize="5.2" letterSpacing=".7" fill="#6A7179">YOUR SPACE WORKSPACE</text>
        <text x="98" y="62" fontFamily="'Instrument Serif', Georgia, serif" fontSize="22" fill="#141518">Good afternoon, <tspan fill="#D94E1F" fontStyle="italic">Prashanth.</tspan></text>
        <rect x="99" y="70" width="64" height="10" rx="5" fill="#E4EBF2" /><text x="105" y="77.2" fontFamily="monospace" fontSize="4.7" fill="#1E4D8C">CSE / DATA SCIENCE</text>
        <rect x="97" y="92" width="154" height="112" rx="8" fill="white" stroke="#DCD8CE" />
        <text x="107" y="109" fontFamily="'Instrument Serif', Georgia, serif" fontSize="13" fill="#141518">Your next steps</text>
        <rect x="107" y="118" width="131" height="3.5" rx="2" fill="#E6E2DA" /><rect x="107" y="118" width="68" height="3.5" rx="2" fill="#D94E1F" />
        {[137,156,175].map((y,i) => <g key={y}><rect x="107" y={y-4} width="9" height="9" rx="3" fill={i===2?"#EEECE6":"#D94E1F"} />{i<2 && <path d={`m109 ${y}.2 2 2 3-4`} stroke="white" strokeWidth="1" fill="none" />}<rect x="122" y={y-3} width={[100,85,103][i]} height="2.7" rx="1" fill="#65737E" /><rect x="122" y={y+3} width="59" height="2" rx="1" fill="#C2C9CA" /></g>)}
        <rect x="259" y="92" width="88" height="112" rx="8" fill="#E5EBF0" stroke="#D4DADE" />
        <text x="269" y="109" fontFamily="'Instrument Serif', Georgia, serif" fontSize="13" fill="#1E4D8C">Coming up</text>
        {[128,154].map((y,i) => <g key={y}><rect x="269" y={y-4} width="18" height="20" rx="4" fill="#1E4D8C" /><text x="278" y={y+9} textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill="white">{i===0?"06":"18"}</text><rect x="293" y={y} width="42" height="3" rx="1" fill="#71889C" /><rect x="293" y={y+6} width="28" height="2" rx="1" fill="#9FACBA" /></g>)}
      </g>
    </svg>
  );
}

function MapPreview() {
  const id = useId();
  return (
    <svg viewBox="0 0 600 210" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrated Telangana map with fields, rivers and a water and crop legend" className="h-full w-full">
      <defs>
        <pattern id={`${id}-fields`} width="98" height="73" patternUnits="userSpaceOnUse" patternTransform="rotate(-19)">
          <rect width="98" height="73" fill="#C7D5A5" />
          <g stroke="#D6DABD" strokeWidth="1"><path d="m0 0 34 1-3 24-31 3Z" fill="#A5BC8E" /><path d="m36 0 28 0-1 28-31-3Z" fill="#C1CB94" /><path d="M66 0h32v26l-34 2Z" fill="#90AF8E" /><path d="m0 30 27-4 7 26-33 4Z" fill="#B5C68F" /><path d="m30 27 35 4 2 25-33-4Z" fill="#D1CDA3" /><path d="m68 29 30-4v30l-28 3Z" fill="#A4BB90" /><path d="m0 58 36-6 5 21H0Z" fill="#94B28F" /><path d="m39 55 28 4 4 14H45Z" fill="#CBCC9E" /><path d="m72 60 26-5v18H75Z" fill="#B4C6A5" /></g>
        </pattern>
        <pattern id={`${id}-grid`} width="47" height="47" patternUnits="userSpaceOnUse"><path d="M47 0H0v47" stroke="#F4F0D5" fill="none" strokeWidth=".8" opacity=".52" /></pattern>
      </defs>
      <rect width="600" height="210" fill={`url(#${id}-fields)`} />
      <g fill="#548F7A" opacity=".6"><path d="m219-8 93 2 11 32-32 13-7 21-35-9-7-18-35-14Z" /><path d="m442 111 34-8 17 17 24 1-13 34-21 13-20-11-29 6-12-30Z" /><path d="m35 171 47-14 25 19 33 3 12 31H12Z" /></g>
      <g fill="none" stroke="#6F9A78" opacity=".6" strokeWidth="1.1">
        {[0,1,2,3].map((n) => <path key={n} transform={`translate(${n*4} ${n*4})`} d="M-28 101c58-53 86-24 127-41s64-46 99-43 71 40 124 24 80-55 130-43m-34 212c11-32 34-61 71-59s65 25 120-5" />)}
      </g>
      <path d="M326-20c7 47 44 54 33 80s-87 17-107 41c-22 28 27 29 9 52s-73 10-94 24-26 38-47 46" stroke="#A7D4C0" strokeWidth="20" fill="none" />
      <path d="M326-20c7 47 44 54 33 80s-87 17-107 41c-22 28 27 29 9 52s-73 10-94 24-26 38-47 46" stroke="#5A9EA3" strokeWidth="9" fill="none" />
      <path d="M328-20c7 47 44 54 33 80s-87 17-107 41c-22 28 27 29 9 52s-73 10-94 24-26 38-47 46" stroke="#9BD3C9" strokeWidth="2" fill="none" />
      <path d="M578-10c-34 54-84 24-100 57s-10 36-43 45-78-4-95-13" stroke="#6EABAD" strokeWidth="3" fill="none" />
      <g fill="none" strokeLinecap="round"><path d="M-10 177C86 143 113 128 203 117s106-37 152-39 106 22 255-29M122-10c21 61 17 77 61 111s77 40 111 110" stroke="#BFAC8D" strokeWidth="5" /><path d="M-10 177C86 143 113 128 203 117s106-37 152-39 106 22 255-29M122-10c21 61 17 77 61 111s77 40 111 110" stroke="#F2E9CC" strokeWidth="2.5" /></g>
      <path d="m186 67 54-24 28 15 18 17-3 18-32 19-42-7-27-16z" fill="#4D967D" fillOpacity=".37" stroke="#3D7D6D" strokeWidth="1.5" strokeDasharray="4 3" />
      <rect width="600" height="210" fill={`url(#${id}-grid)`} />
      <text x="386" y="136" textAnchor="middle" fill="#3B5B4D" fontFamily="'JetBrains Mono', monospace" fontSize="13" letterSpacing="5">TELANGANA</text>
      {[[181,104,"Hyderabad"],[405,51,"Warangal"]].map(([x,y,name]) => <g key={name} transform={`translate(${x} ${y})`}><circle r="7.5" fill="#F7F5F0" opacity=".8" /><circle r="3.5" fill="#D94E1F" stroke="white" strokeWidth="1.1" /><text x="11" y="-2" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" fontWeight="600" stroke="#E7EACD" strokeWidth="3" paintOrder="stroke" fill="#304A44">{name}</text></g>)}
      <g transform="translate(20 18)"><rect width="119" height="23" rx="11.5" fill="#F8F7ED" stroke="#A8B9A3" /><circle cx="12" cy="11.5" r="3" fill="#32857A" /><text x="22" y="15" fill="#385A4F" fontFamily="monospace" fontSize="9" letterSpacing="1">MAP PREVIEW</text></g>
      <g transform="translate(444 168)"><rect width="137" height="26" rx="7" fill="#F7F8EE" fillOpacity=".94" /><circle cx="13" cy="13" r="4" fill="#589EA5" /><text x="22" y="16.5" fontFamily="sans-serif" fontSize="10.5" fill="#39524F">Water</text><circle cx="75" cy="13" r="4" fill="#69966D" /><text x="84" y="16.5" fontFamily="sans-serif" fontSize="10.5" fill="#39524F">Crops</text></g>
    </svg>
  );
}

export function ProjectCover({ project }: { project: ProjectEntry }) {
  if (project.cover === "hub") return <HubPreview />;
  if (project.cover === "map") return <MapPreview />;
  return (
    <div className="profile-notebook-cover flex h-full w-full items-center justify-between gap-5 overflow-hidden bg-stone px-6 sm:px-8" aria-hidden="true">
      <div className="min-w-0"><span className="mono text-[9px] text-booster-deep">Student project</span><p className="mt-2 truncate font-display text-[32px] text-ink">{project.category}</p></div>
      <svg viewBox="0 0 120 90" fill="none" className="w-24 shrink-0 sm:w-32"><g stroke="#1E4D8C" strokeWidth="1.3"><path d="m60 7 43 24-44 24-43-25Z" fill="#EAF0F3" /><path d="m16 30 1 21 42 24V55Z" fill="#ABC1D1" /><path d="m103 31-1 21-43 23V55Z" fill="#7398B6" /><path d="m34 21 43 24m-26-34 43 24M31 39l45-24M45 47l45-24" opacity=".55" /><path d="m16 61 43 23 45-24" strokeDasharray="3 3" /></g><circle cx="103" cy="31" r="3.7" fill="#D94E1F" /></svg>
    </div>
  );
}