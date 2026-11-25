// ═══════════════════════════════════════════════════════════════════
//  FOUNDING COHORT FORM URL
//  → Paste the Google Form link between the quotes below and the
//    primary "Join Founding Cohort" button will open it in a new tab.
//  → Leave it as an empty string ("") to fall back to the on-page
//    seat-request panel in the Hero section.
//  Example: const FORM_URL = "https://forms.gle/AbC123XyZpQw";
// ═══════════════════════════════════════════════════════════════════
const FORM_URL = "";

import { cn } from "@/utils/cn";
import { ArrowRight, Crosshair } from "@/components/Icons";

function openJoin() {
  if (FORM_URL) {
    window.open(FORM_URL, "_blank", "noopener,noreferrer");
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
  window.setTimeout(() => window.dispatchEvent(new Event("cosmox:join")), 450);
}

function openDemo() {
  window.dispatchEvent(new Event("cosmox:demo"));
}

const STRIP_STATS = [
  { value: "04", label: "Branch Tracks Live" },
  { value: "09", label: "Startup Hiring Partners" },
  { value: "120", label: "Founding Seats · Cohort 01" },
];

export function FinalCta() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="relative overflow-hidden bg-ink"
    >
      {/* dark-charcoal architectural grid hairlines */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 mx-auto hidden w-full max-w-[1440px] px-5 sm:px-8 md:block lg:px-12">
          <div className="grid h-full grid-cols-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "border-l border-[#26282E]",
                  i === 11 && "border-r",
                )}
              />
            ))}
          </div>
        </div>
        {/* slow radar sweep */}
        <div className="plot-line absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-booster/40 to-transparent" />
        {/* faint orbital ring, lower right */}
        <svg
          viewBox="0 0 400 400"
          fill="none"
          className="absolute -bottom-[180px] -right-[120px] hidden h-[480px] w-[480px] opacity-60 lg:block"
        >
          <circle cx="200" cy="200" r="196" stroke="#26282E" strokeWidth="1" />
          <circle cx="200" cy="200" r="140" stroke="#26282E" strokeWidth="1" />
          <circle
            cx="200"
            cy="200"
            r="168"
            stroke="#D94E1F"
            strokeOpacity="0.45"
            strokeWidth="1"
            strokeDasharray="4 10"
            className="orbit-spin-slow"
            style={{ transformOrigin: "200px 200px" }}
          />
          <g className="orbit-spin-slow" style={{ transformOrigin: "200px 200px" }}>
            <circle cx="200" cy="32" r="4" fill="#D94E1F" />
          </g>
        </svg>
      </div>

      {/* corner registration ticks */}
      <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-white/25" />
      <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-white/25" />
      <span className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b border-l border-white/25" />
      <span className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b border-r border-white/25" />

      <div className="relative mx-auto w-full max-w-3xl px-5 py-24 text-center sm:px-8 lg:py-28">
        <p className="mono flex items-center justify-center gap-2.5 text-[10px] text-booster">
          <Crosshair className="h-2.5 w-2.5" />
          07 // Launch Sequence • Founding Cohort
        </p>

        <h2
          id="cta-heading"
          className="mt-6 font-display text-[clamp(3rem,5.6vw,4rem)] leading-[1.04] tracking-[-0.025em] text-white"
        >
          Ready to stop <em className="italic text-booster">guessing</em> and
          start building?
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-[16.5px] leading-[1.62] text-[#A1A4AB]">
          Join the founding batch of B.Tech &amp; STEM students getting verified
          space opportunities, branch roadmaps, and serious hackathon squads.
        </p>

        {/* dual action row */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={openJoin}
            className="liquid-primary group inline-flex h-[50px] w-full items-center justify-center gap-2.5 px-6 text-[15px] font-semibold sm:w-auto"
          >
            Join Founding Cohort
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[4px]" />
          </button>
          <button
            type="button"
            onClick={openDemo}
            className="liquid-dark inline-flex h-[50px] w-full items-center justify-center gap-2.5 px-6 text-[15px] font-medium sm:w-auto"
          >
            Try Interactive Demo Workspace
          </button>
        </div>

        <p className="mono mt-6 text-[9px] text-white/40">
          No spam · Cohort mail only · Unsubscribe in one click
        </p>

        {/* strip stats */}
        <div className="mt-12 grid grid-cols-1 overflow-hidden rounded-[24px] border border-[#26282E] divide-y divide-[#26282E] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STRIP_STATS.map((s) => (
            <div key={s.label} className="px-4 py-5">
              <p className="mono tnum text-[22px] leading-none text-white">{s.value}</p>
              <p className="mono mt-2 text-[8.5px] text-[#A1A4AB]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
