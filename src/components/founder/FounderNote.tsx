import { Crosshair } from "@/components/Icons";
import "./founder.css";

function SignatureMark() {
  return (
    <svg
      viewBox="0 0 190 56"
      className="h-12 w-40 text-ink"
      fill="none"
      role="img"
      aria-label="Handwritten signature of Prashanth"
    >
      <path
        d="M10 40C13 27 24 6 30 8c5 1.7-4 28-1 30 2.6 1.6 5-14 10-13 4 .8 1 12 6 12 4.5 0 6-16 11-15 5 1-1 14 4 14 5 0 7-18 12-18 5 0-1 13 5 14 5 .8 8-14 12-11 3.4 2.7 3 8 10 8 6 0 8-11 15-11 6 0-3 13 4 14 8 .6 10-14 17-14 6.4 0 5 9 13 6M34 26h22"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="170" cy="34" r="2.2" fill="#D94E1F" stroke="none" />
      <path d="M104 15c13 7 33 7 47-1" stroke="#D94E1F" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function FounderNote() {
  return (
    <section
      id="founder"
      aria-labelledby="founder-heading"
      className="relative scroll-mt-24 border-b border-hairline bg-canvas px-4 pt-16 pb-12 sm:px-6"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* ── ONE single card · text left, cutout astronaut popping out top-right ── */}
        <div className="founder-card reveal relative mx-auto mt-10 grid max-w-6xl grid-cols-1 items-center overflow-visible rounded-3xl border border-[#DCD8CE] bg-[#FFFFFF] shadow-[0_24px_60px_-15px_rgba(20,21,24,0.08)] sm:mt-14 lg:mt-20 lg:grid-cols-12">
          {/* Left column · editorial note */}
          <div className="relative z-20 flex min-w-0 flex-col justify-between p-8 sm:p-10 lg:col-span-7 lg:p-12">
            <p className="mono flex items-center gap-2 text-[10px] font-semibold uppercase text-booster">
              <Crosshair className="h-2.5 w-2.5" />
              Founder Note • Hyderabad
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
              <h2
                id="founder-heading"
                className="font-display text-[38px] leading-[1.02] tracking-[-0.02em] text-ink sm:text-[42px] lg:text-[46px]"
              >
                Prashanth
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cobalt-deep/20 bg-cobalt px-3.5 py-1.5 text-[11px] leading-none text-white">
                B.Tech CSD • Malla Reddy University
              </span>
            </div>

            <blockquote className="mt-5 max-w-[62ch]">
              <span
                aria-hidden="true"
                className="pointer-events-none block select-none font-display text-[46px] leading-[0.5] text-sand"
              >
                &ldquo;
              </span>
              <p className="relative mt-1 text-[16px] leading-[1.8] text-graphite">
                Building from Hyderabad near ISRO&apos;s NRSC, Skyroot, and
                Dhruva Space, I saw so many students who loved space yet
                didn&apos;t know where to start or missed opportunities in
                noisy group chats. Cosmox is built to give every student a
                clear path, real projects, and a focused crew.
              </p>
            </blockquote>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#DCD8CE] pt-6">
              <span className="flex flex-col gap-1.5">
                <SignatureMark />
                <span className="mono text-[8px] text-graphite">
                  PRASHANTH — BUILDER, COSMOX
                </span>
              </span>

              <a
                href="#/app/profile"
                className="liquid-secondary group inline-flex h-11 shrink-0 items-center gap-2 px-5 text-[13.5px] font-medium text-ink"
              >
                View Builder Profile
                <svg
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5 text-booster transition-transform duration-300 group-hover:translate-x-[3px]"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8h11M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="square"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Right column · transparent astronaut cutout, not a dark photo box */}
          <div className="relative z-10 min-h-[340px] self-stretch border-t border-[#DCD8CE] lg:col-span-5 lg:min-h-full lg:border-t-0">
            {/* Clipped ambient studio glow and faint orbital guides */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-br-3xl"
            >
              <span className="founder-halo absolute left-[12%] top-[19%] h-[68%] w-[82%] rounded-full bg-[#EFECE6]/70 blur-2xl" />
              <span className="absolute left-[18%] top-[33%] h-[38%] w-[48%] rounded-full bg-[#F59E0B]/[0.08] blur-3xl" />
              <span className="founder-floor absolute bottom-[-8px] left-[17%] h-10 w-[70%] rounded-full" />
              <svg
                viewBox="0 0 420 520"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 h-full w-full"
                fill="none"
              >
                <g stroke="#DCD8CE" strokeWidth="1">
                  <ellipse cx="218" cy="258" rx="188" ry="70" transform="rotate(-16 218 258)" />
                  <circle cx="218" cy="258" r="132" strokeDasharray="2 7" />
                  <path d="M24 448c105-66 267-66 372 0" />
                  <path d="M18 24h18M27 15v18M384 24h18M393 15v18" strokeOpacity="0.7" />
                </g>
                <circle cx="351" cy="146" r="3" fill="#D94E1F" fillOpacity="0.8" />
                <circle cx="351" cy="146" r="9" stroke="#DCD8CE" strokeWidth="1" />
              </svg>
            </div>

            {/* The cutout breaks 60px above the card's top border on desktop */}
            <img
              src="/images/founder-astronaut.webp"
              alt="Transparent cutout of an astronaut in a white suit with a warm golden visor"
              draggable={false}
              className="founder-astronaut pointer-events-none absolute inset-x-0 bottom-0 mx-auto lg:inset-x-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
