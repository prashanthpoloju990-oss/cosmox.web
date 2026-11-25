import { useId, type ReactNode } from "react";
import { AVATARS, type AvatarStyle, type BadgeId } from "@/data/profile";

export function SunsetBanner() {
  const id = useId();
  return (
    <svg viewBox="0 0 1200 166" preserveAspectRatio="xMidYMid slice" className="profile-sunset block h-28 w-full" aria-hidden="true" fill="none">
      <defs>
        <linearGradient id={`${id}-hills`} x1="0" x2="1" y2=".2">
          <stop stopColor="#A03F29" /><stop offset=".45" stopColor="#E58A42" /><stop offset=".72" stopColor="#AA7D77" /><stop offset="1" stopColor="#345A89" />
        </linearGradient>
        <pattern id={`${id}-paper`} width="4" height="4" patternUnits="userSpaceOnUse"><circle cx=".7" cy=".7" r=".65" fill="#151B31" opacity=".11" /></pattern>
      </defs>
      <circle cx="739" cy="122" r="75" fill="#FFE5AD" />
      <circle cx="739" cy="122" r="87" stroke="#FFF1D6" strokeOpacity=".32" strokeWidth=".8" />
      <g stroke="#FFF7E8" strokeWidth="1.1" opacity=".62">
        <ellipse cx="314" cy="66" rx="358" ry="98" transform="rotate(-13 314 66)" />
        <ellipse cx="360" cy="38" rx="438" ry="134" transform="rotate(-13 360 38)" strokeWidth=".6" />
        <ellipse cx="508" cy="67" rx="530" ry="85" transform="rotate(9 508 67)" strokeDasharray="2 6" />
        <path d="M700 169C835 75 986 31 1218 27" />
        <path d="M771 173c132-97 284-119 460-126" strokeDasharray="3 7" />
      </g>
      <g fill="#FFF9E9">
        {[[43, 40], [117, 67], [202, 15], [275, 51], [349, 82], [389, 25], [458, 32], [515, 58], [595, 22], [630, 45], [824, 37], [914, 63], [984, 24], [1055, 77], [1139, 44], [1178, 95]].map(([x,y], i) => <circle key={x} cx={x} cy={y} r={i % 4 === 0 ? 1.8 : .95} opacity={i % 3 === 0 ? .94 : .58} />)}
        <circle cx="452" cy="125" r="3.5" /><circle cx="918" cy="69" r="2.8" />
      </g>
      <path d="M0 126c105-20 146-15 237-3s169 17 271-10c104-28 164 8 254 10 87 2 155-32 234-28 88 4 118 22 204 2v69H0Z" fill="#F3BA86" opacity=".65" />
      <path d="M0 134c99 0 160-34 254-25 123 11 165 50 267 32 86-15 134-3 222 7 138 15 193-49 307-47 67 2 111 21 150 13v52H0Z" fill={`url(#${id}-hills)`} />
      <path d="M750 166c108-7 174-31 260-40 82-9 125 1 190-16v56z" fill="#244D7A" opacity=".75" />
      <g stroke="#FFF2D8" strokeWidth=".8" opacity=".45">
        <path d="M0 154c166-27 203-51 342-14s175 24 267 6" /><path d="M906 157c111-42 173-15 294-33" />
        <path d="M1019 66h14m-7-7v14M156 38h10m-5-5v10" />
      </g>
      <path fill={`url(#${id}-paper)`} d="M0 0h1200v166H0z" />
    </svg>
  );
}

const suits = [
  { sky: "#4579A4", deep: "#183958", horizon: "#E98D50", sun: "#FFE59C", suit: "#F6EFE0", shadow: "#A9BCC4", stripe: "#E27732", visor: "#E7AE4C", glass: "#633A45" },
  { sky: "#62CEC1", deep: "#20576C", horizon: "#95E6C8", sun: "#E3F4A8", suit: "#B7DBE9", shadow: "#6093B2", stripe: "#237AAB", visor: "#6CD4C4", glass: "#204863" },
  { sky: "#E4A56B", deep: "#B56149", horizon: "#F7C875", sun: "#FFF4CC", suit: "#F2A554", shadow: "#C87848", stripe: "#29608B", visor: "#A2CFE6", glass: "#284A74" },
];

export function ExplorerAvatar({ style, className, decorative = false }: { style: AvatarStyle; className?: string; decorative?: boolean }) {
  const id = useId();
  const c = suits[style];
  const ink = "#223449";
  return (
    <svg viewBox="0 0 120 120" className={className} role={decorative ? undefined : "img"} aria-hidden={decorative || undefined} aria-label={decorative ? undefined : AVATARS[style] + " avatar"}>
      <defs>
        <linearGradient id={`${id}-bg`} x2=".8" y2="1"><stop stopColor={c.sky} /><stop offset="1" stopColor={c.deep} /></linearGradient>
        <linearGradient id={`${id}-suit`} x1=".1" x2=".9" y2="1"><stop stopColor={c.suit} /><stop offset=".6" stopColor={c.suit} /><stop offset="1" stopColor={c.shadow} /></linearGradient>
        <linearGradient id={`${id}-visor`} x1=".2" x2=".9" y2="1"><stop stopColor={c.visor} /><stop offset=".53" stopColor={c.visor} /><stop offset="1" stopColor={c.glass} /></linearGradient>
        <clipPath id={`${id}-lens`}><path d="M41 44c4-10 14-14 31-13 15 1 23 6 26 16 3 11-1 23-12 28-10 4-28 6-39 0-8-5-10-21-6-31Z" /></clipPath>
      </defs>
      <path d="M0 0h120v120H0z" fill={`url(#${id}-bg)`} />
      <circle cx={style === 1 ? 18 : 105} cy={style === 1 ? 32 : 60} r={style === 1 ? 16 : 30} fill={c.sun} opacity=".94" />
      <g fill="#FFF8DE" opacity=".92"><circle cx="17" cy="14" r="1.8" /><circle cx="90" cy="10" r="1.4" /><circle cx="105" cy="23" r="1" /><circle cx="12" cy="57" r="1.3" /><path d="m23 27 1.1 3.1 3.3 1.2-3.3 1.1-1.1 3.3-1.2-3.3-3.2-1.1 3.2-1.2z" /></g>
      <path d="M-12 104C37 59 92 59 135 62M-15 109c49-44 101-51 155-48" stroke={c.sun} opacity=".46" strokeWidth="1" fill="none" />
      <path d="M-5 94c22-8 39-13 58-6 27 10 47-2 70-18v51H0Z" fill={c.horizon} />
      <g stroke={ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="17" y="73" width="29" height="49" rx="8" fill={c.stripe} />
        <path d="M15 123c1-18 8-29 26-34l17-5 23 4c17 5 29 17 32 35Z" fill={`url(#${id}-suit)`} />
        <path d="M20 104c5-7 11-10 17-12l5 9-9 9-12 4Z" fill={c.stripe} />
        <path d="m30 118 8-9m58-12 5 14m-74-10 7-4" fill="none" strokeWidth="1.8" />
        <path d="m45 87 3 12 28 5 12-13" fill={c.shadow} />
        <g transform={style === 1 ? "rotate(7 62 62)" : style === 2 ? "rotate(-10 62 62)" : "rotate(-5 62 62)"}>
          {style === 1 && <g><path d="M30 55V22" strokeWidth="3.2" /><circle cx="30" cy="19" r="3.6" fill="#FFC571" /></g>}
          {style === 2 && <path d="m43 26 6-13 13-3 12 11" fill={c.stripe} />}
          <ellipse cx="64" cy="84" rx="27" ry="9" fill={ink} />
          <path d="M26 57c0-24 13-40 35-43 20-3 39 8 44 27 5 17-1 37-14 43-9 5-29 8-43 3-14-4-22-16-22-30Z" fill={`url(#${id}-suit)`} />
          <path d="M33 42c5-12 14-19 27-21" stroke="#FFFFFF" strokeWidth="4" fill="none" opacity=".9" />
          <path d="M43 30c6-6 14-9 21-10m-17 8c6-4 10-6 15-7" stroke={c.stripe} strokeWidth="2.3" fill="none" />
          <path d="M39 42c5-11 17-15 34-14 17 1 27 8 29 19 3 14-2 25-14 31-12 5-31 6-43-1-9-6-11-24-6-35Z" fill={ink} />
          <g clipPath={`url(#${id}-lens)`} stroke="none">
            <path d="M31 27h78v63H31z" fill={`url(#${id}-visor)`} />
            <circle cx={style === 1 ? 82 : 76} cy="49" r="9" fill="#FFE7B9" />
            <path d="m33 71 18-9 9 3 17-10 9 3 18-7v37H33Z" fill={c.glass} opacity=".82" />
            <path d="M36 70c23 4 44-10 69-10v27H36z" fill={ink} opacity=".75" />
            <path d="M42 42c12-11 21-9 30-9M86 37l5 4" fill="none" stroke="#FFF8E5" strokeWidth="4" opacity=".75" />
          </g>
          <rect x="22" y="48" width="13" height="23" rx="5" fill={c.shadow} /><path d="M28 54v10" stroke={c.stripe} strokeWidth="3" />
          {style === 2 ? <g><rect x="46" y="77" width="20" height="7" rx="3" fill={c.shadow} /><path d="m51 79 1 3m5-3 1 3m4-4 1 3" strokeWidth="1" /></g> : <path d="M44 80c9 5 22 6 33 3" fill="none" strokeWidth="1.8" />}
        </g>
        <rect x="49" y="100" width="32" height="21" rx="4" fill={c.suit} />
        <path d="M54 105h21v4H54z" fill={c.stripe} strokeWidth="1" />
        <path d="M55 114h8m3 0h5" strokeWidth="1.7" /><circle cx="86" cy="106" r="3.7" fill={c.stripe} />
      </g>
    </svg>
  );
}

export function BadgeArt({ kind, className }: { kind: BadgeId; className?: string }) {
  const id = useId();
  const colors: Record<BadgeId, string[]> = {
    rocket: ["#FFC662", "#EF7131", "#994122"], trophy: ["#5DDEF7", "#3987D7", "#204B91"],
    dish: ["#8CE3C7", "#27A99B", "#176373"], star: ["#FFE092", "#EBA22B", "#976132"],
    compass: ["#91D4D7", "#458FAD", "#2D647F"], shield: ["#A2C8EA", "#5B87C0", "#3E5687"],
  };
  const [light, mid, dark] = colors[kind];
  const grad = `url(#${id}-enamel)`;
  const artwork: Record<BadgeId, ReactNode> = {
    rocket: <g transform="rotate(31 40 39)">
      <path d="M32 51c-3 9 4 16 8 22 5-8 12-15 8-23" fill="#F7932A" /><path d="M36 52c-1 6 2 11 4 15 4-6 6-9 5-15" fill="#FFE879" />
      <path d="M29 32C18 36 17 45 17 54l14-6m20-16c11 4 12 13 12 22l-14-6" fill={grad} stroke={dark} strokeWidth="1.5" />
      <path d="M40 6C29 14 24 26 26 41c.5 7 4 13 8 17h12c4-4 7-11 8-18C55 26 51 15 40 6Z" fill="#FFEDCC" stroke={dark} strokeWidth="1.9" />
      <path d="M40 6c-5 4-9 10-11 16 6 2 15 2 22-1-3-6-7-12-11-15Z" fill={grad} stroke={dark} strokeWidth="1.4" />
      <path d="M46 19c5 11 5 23-1 34" stroke="#F0AE65" strokeWidth="3" fill="none" />
      <circle cx="40" cy="34" r="8" fill="#ED8D3B" stroke={dark} strokeWidth="1.5" /><circle cx="40" cy="34" r="5.7" fill="#286583" />
      <path d="m37 32 4-2" stroke="#A8EFFF" strokeWidth="2" />
      <path d="m32 52 16 .3-3 6H35Z" fill="#AC532B" /><path d="M40 46v12" stroke={dark} strokeWidth="2.3" />
    </g>,
    trophy: <g stroke={dark} strokeWidth="1.8" strokeLinejoin="round">
      <path d="M23 20H10v6c0 11 7 16 18 16m28-22h12v6c0 11-7 16-18 16" fill="none" strokeWidth="5.6" /><path d="M22 18H11m46 0h10" stroke={light} strokeWidth="2" />
      <path d="M22 15h36l-3 22c-1 9-9 16-15 16s-15-7-16-16z" fill={grad} />
      <path d="M26 20h5l.5 13-3.5 2z" fill="#A4EEFA" stroke="none" /><path d="m34 28-5 4 5 4m12-8 5 4-5 4m-4-11-4 15" stroke="#F1FFFF" strokeWidth="2.5" fill="none" />
      <rect x="19" y="12" width="42" height="6" rx="3" fill={light} />
      <path d="M37 52h6v8l6 4H31l6-4z" fill="#F3B652" /><rect x="25" y="64" width="30" height="6" rx="2.5" fill={dark} />
    </g>,
    dish: <g stroke={dark} strokeWidth="1.7" strokeLinejoin="round">
      <path d="m41 45 8 17H30l6-19" fill="#72B5B6" /><path d="m36 56 10-4" fill="none" />
      <rect x="26" y="62" width="30" height="7" rx="3" fill={grad} />
      <path d="M12 31c-1 14 7 25 22 26 11 0 21-6 26-11Z" fill={grad} />
      <ellipse cx="36" cy="38.5" rx="26" ry="5.8" transform="rotate(18 36 38.5)" fill="#B5EADC" />
      <path d="m17 33 29-10 11 22M37 39l9-16" fill="none" strokeWidth="2.2" /><circle cx="46" cy="22" r="3.5" fill="#F1AE4C" />
      <path d="M55 15c4 2 6 5 7 8m-5-15c6 2 12 8 13 14" fill="none" stroke="#27A99B" strokeWidth="2.8" />
      <path d="M19 42c3 5 8 9 14 10" stroke="#B7F8D8" strokeWidth="2.6" fill="none" />
    </g>,
    star: <g strokeLinejoin="round">
      <path d="M4 63c13-7 20-25 47-39L40 43C27 47 17 64 4 63Z" fill={mid} opacity=".82" />
      <path d="M12 71c11-1 27-13 37-24l-3-6c-14 14-25 25-34 30Z" fill={light} /><path d="M9 52c8-3 14-12 19-17" stroke={dark} strokeWidth="2" fill="none" />
      <path d="m52 7 5 14 15 3-11 11 1 15-14-7-14 6 3-16-10-11 16-2z" fill={grad} stroke={dark} strokeWidth="1.7" />
      <path d="m50 15-5 11-10 1" stroke="#FFF4CB" strokeWidth="2.8" fill="none" />
    </g>,
    compass: <g stroke={dark} strokeWidth="1.8">
      <circle cx="40" cy="10" r="5" fill="none" strokeWidth="3" /><rect x="36" y="13" width="8" height="6" rx="2" fill={mid} />
      <circle cx="40" cy="43" r="27" fill={grad} /><circle cx="40" cy="43" r="21.5" fill="#E9F2ED" />
      <g strokeWidth="1.4"><path d="M40 24v4m0 31v4M21 43h4m30 0h4M26 29l2 2m24 24 2 2m0-28-2 2M28 55l-2 2" /></g>
      <path d="m53 27-9 21-17 11 9-22Z" fill="#F4BD74" /><path d="m53 27-9 21-8-11Z" fill={dark} /><circle cx="40" cy="43" r="3" fill="white" />
    </g>,
    shield: <g stroke={dark} strokeWidth="1.8" strokeLinejoin="round">
      <path d="M40 8c-8 6-16 9-24 10v20c0 17 11 26 24 33 13-7 24-17 24-33V18C54 16 47 13 40 8Z" fill={grad} />
      <path d="M40 16c-7 4-13 7-18 7v14c0 13 8 21 18 27 10-6 18-14 18-27V23c-8-2-12-4-18-7Z" fill="#DDEAF3" />
      <path d="m40 23 4 8 9 2-7 7 1 10-8-5-8 4 2-9-6-7 9-2Z" fill={mid} strokeWidth="1.4" /><path d="M40 16v7" stroke="#FFF" strokeWidth="2" />
    </g>,
  };
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true" focusable="false" strokeLinecap="round">
      <defs><linearGradient id={`${id}-enamel`} x1=".1" x2=".85" y2="1"><stop stopColor={light} /><stop offset=".69" stopColor={mid} /><stop offset="1" stopColor={dark} /></linearGradient></defs>
      <ellipse cx="40" cy="71" rx="20" ry="3" fill={dark} opacity=".1" />
      {artwork[kind]}
      <path d="m13 14 .9 3.1 3.1 1-3.1 1-.9 3.1-1-3.1-3.1-1 3.1-1Z" fill={mid} opacity=".8" />
      <circle cx="66.5" cy="57" r="1.8" fill={mid} opacity=".55" />
    </svg>
  );
}