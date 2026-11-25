import { BrandMark } from "@/components/Icons";

function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 92;
  window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
}

function openDemo() {
  window.dispatchEvent(new Event("cosmox:demo"));
}

const NAV_LINKS = [
  { label: "Career Architecture", id: "career" },
  { label: "Unified Community", id: "community" },
  { label: "Live Dispatches", id: "live" },
  { label: "Events & Sprints", id: "events" },
  { label: "AI Co-Pilot", id: "ai" },
  { label: "Founder Note", id: "founder" },
];

const TRACKS = [
  "Flight Software",
  "Earth Observation AI",
  "Avionics & RF",
  "Propulsion & CAD",
];

export function EditorialFooter() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* top row · 4 columns */}
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* col 1 · brand */}
          <div className="lg:col-span-5">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group inline-flex items-center gap-3"
              aria-label="COSMOX — back to top"
            >
              <BrandMark className="h-9 w-9 shrink-0 transition-transform duration-500 group-hover:rotate-[8deg]" />
              <span className="flex flex-col leading-none">
                <span className="text-[18px] font-bold tracking-[-0.02em] text-ink">
                  COSMOX
                </span>
                <span className="mono mt-[3px] text-[9.5px] leading-none text-graphite">
                  v1.0 // COHORT
                </span>
              </span>
            </a>
            <p className="mt-5 max-w-[38ch] text-[14.5px] leading-[1.6] text-graphite">
              Career architecture &amp; mission squads for student space builders.
            </p>
            <p className="liquid-chip mono mt-4 inline-block px-2.5 py-1.5 text-[9px] text-ink">
              Hyderabad, India · 17.38° N 78.48° E
            </p>
          </div>

          {/* col 2 · navigation */}
          <nav aria-label="Footer" className="lg:col-span-3">
            <p className="mono text-[9.5px] text-graphite">Index // Sections</p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => scrollToId(l.id)}
                    className="text-[14px] font-medium text-ink underline-offset-4 transition-colors hover:text-booster hover:underline"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* col 3 · tracks */}
          <div className="lg:col-span-2">
            <p className="mono text-[9.5px] text-graphite">Tracks // 04</p>
            <ul className="mt-4 space-y-2.5">
              {TRACKS.map((t) => (
                <li key={t}>
                  <button
                    type="button"
                    onClick={() => scrollToId("career")}
                    className="text-[14px] font-medium text-ink underline-offset-4 transition-colors hover:text-booster hover:underline"
                  >
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* col 4 · access */}
          <div className="lg:col-span-2">
            <p className="mono text-[9.5px] text-graphite">Access // Join</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToId("cta")}
                  className="text-[14px] font-medium text-ink underline-offset-4 transition-colors hover:text-booster hover:underline"
                >
                  Founding Cohort Form
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openDemo}
                  className="text-[14px] font-medium text-ink underline-offset-4 transition-colors hover:text-booster hover:underline"
                >
                  Interactive Demo Login
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToId("community")}
                  className="text-[14px] font-medium text-ink underline-offset-4 transition-colors hover:text-booster hover:underline"
                >
                  Community Guidelines
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col gap-2 border-t border-hairline py-5 md:flex-row md:items-center md:justify-between">
          <p className="mono text-[12px] text-ink">
            © 2026 Cosmox • Built by Prashanth in Hyderabad
          </p>
          <p className="mono max-w-[62ch] text-[11px] leading-relaxed text-graphite">
            Preview Notice: Sample dispatches &amp; metrics illustrate founding cohort workflows.
          </p>
        </div>
      </div>
    </footer>
  );
}
