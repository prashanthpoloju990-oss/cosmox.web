import { useState } from "react";
import { cn } from "@/utils/cn";
import { EVENTS } from "@/data/events";
import { ArrowRight, CheckSeal, Crosshair } from "@/components/Icons";
import { navigateToEvent } from "@/utils/appRoute";

export function UpcomingEvents() {
  const [reservedSeats, setReservedSeats] = useState<Record<string, boolean>>({});

  const toggleReservation = (id: string) => {
    setReservedSeats((prev) => {
      const nextState = !prev[id];
      if (nextState) {
        // Dispatch cohort join intention or trigger seat count increment
        window.dispatchEvent(new Event("cosmox:join"));
      }
      return { ...prev, [id]: nextState };
    });
  };

  return (
    <section
      id="events"
      aria-labelledby="events-heading"
      className="relative border-b border-hairline bg-canvas py-24 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* ── Section Header ───────────────────────────────── */}
        <div className="flex flex-col justify-between gap-6 border-b border-hairline pb-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2.5">
              <Crosshair className="h-2.5 w-2.5 text-booster" />
              <p className="mono text-[10px] text-graphite">
                04 // Upcoming Events
              </p>
            </div>

            <h2
              id="events-heading"
              className="mt-4 font-display text-[clamp(2.5rem,4.4vw,3.75rem)] leading-[1.03] tracking-[-0.025em] text-ink"
            >
              Build <em className="italic text-booster">live</em> with peers.
            </h2>
          </div>

          <div className="flex flex-col items-start gap-1 sm:items-end">
            <p className="mono text-[10px] text-graphite">
              SYNCHRONOUS LABS &amp; IN-PERSON MEETUPS
            </p>
            <p className="mono text-[9px] text-booster">
              COHORT 01 CALENDAR • WINTER 2026
            </p>
          </div>
        </div>

        {/* ── 3-Column Editorial Poster Grid ───────────────── */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((event, index) => {
            const isReserved = !!reservedSeats[event.id];
            const currentFilled = event.seatsFilled + (isReserved ? 1 : 0);
            const percentFilled = Math.min(
              100,
              Math.round((currentFilled / event.seatsTotal) * 100),
            );

            return (
              <article
                key={event.id}
                style={{ animationDelay: `${index * 120}ms` }}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("button")) return;
                  navigateToEvent(event.id);
                }}
                className="event-card squircle group relative flex cursor-pointer flex-col justify-between overflow-hidden border border-hairline bg-chalk transition-all duration-300 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_20px_48px_-28px_rgba(20,21,24,0.45)]"
              >
                {/* ── Top 16:10 Visual Frame ────────────────────── */}
                <div className="squircle-media relative mx-3 mt-3 aspect-[16/10] bg-ink">
                  <img
                    src={event.image.url}
                    alt={event.image.alt}
                    loading="lazy"
                    className="h-full w-full object-cover saturate-[0.85] filter transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {/* Subtle duotone warm-alabaster & cobalt filter */}
                  <div className="absolute inset-0 bg-cobalt/25 mix-blend-color" />
                  <div className="absolute inset-0 bg-canvas/10 mix-blend-screen" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

                  {/* Corner registration reticles */}
                  <span className="pointer-events-none absolute left-3 top-3 h-2.5 w-2.5 border-l border-t border-white/70" />
                  <span className="pointer-events-none absolute right-3 top-3 h-2.5 w-2.5 border-r border-t border-white/70" />
                  <span className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-white/70" />
                  <span className="pointer-events-none absolute bottom-3 right-3 h-2.5 w-2.5 border-b border-r border-white/70" />

                  {/* Floating Top-Left Date Badge */}
                  <div className="liquid-chip-dark absolute left-3.5 top-3.5 z-10 flex items-center gap-1.5 px-2.5 py-1">
                    <span className="live-dot h-[5px] w-[5px] rounded-full bg-booster" />
                    <span className="mono text-[9px] font-medium tracking-wide text-white">
                      {event.dateBadge}
                    </span>
                  </div>

                  {/* Floating Top-Right Format Pill */}
                  <div className="absolute right-3.5 top-3.5 z-10">
                    <span
                      className={cn(
                        "liquid-chip-dark mono px-2 py-1 text-[8.5px] font-medium tracking-wider",
                        event.formatPill === "ONLINE LIVE"
                          ? "border-cobalt/60 text-white"
                          : "border-booster/60 text-white",
                      )}
                    >
                      {event.formatPill}
                    </span>
                  </div>

                  {/* Bottom Technical Overlay Text */}
                  <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-white/90">
                    <span className="mono text-[8px] tracking-wider">
                      {event.image.schematicOverlay}
                    </span>
                    <span className="mono text-[8px] text-white/70">
                      {event.duration}
                    </span>
                  </div>
                </div>

                {/* ── Middle Content ────────────────────────────── */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    {/* Track tag & Branch pill */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="mono text-[9.5px] text-graphite">
                        {event.trackTag}
                      </span>
                      <span className="liquid-chip mono px-2 py-0.5 text-[8.5px] text-ink">
                        {event.branches}
                      </span>
                    </div>

                    {/* Sharp Instrument Serif Event Title (max 6 words) */}
                    <h3 className="mt-4 font-display text-[26px] leading-[1.08] tracking-[-0.02em] text-ink transition-colors group-hover:text-booster">
                      {event.title}
                    </h3>

                    {/* 1 short line on what attendees build */}
                    <p className="mt-3 text-[14px] leading-[1.55] text-graphite">
                      {event.summary}
                    </p>
                  </div>

                  {/* Instructor line + details link */}
                  <div className="mt-5 border-t border-hairline pt-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="mono min-w-0 text-[8px] text-graphite">
                        HOST / LEAD · <span className="text-ink">{event.instructor}</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToEvent(event.id);
                        }}
                        className="group/details inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-semibold text-cobalt transition-colors hover:text-ink"
                        aria-label={`Open full event page for ${event.title}`}
                      >
                        Full details
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/details:translate-x-[3px]" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Bottom Action Strip ───────────────────────── */}
                <div className="border-t border-hairline bg-stone/40 p-4">
                  {/* Seat counter & Progress fill */}
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="mono text-[9px] text-graphite">
                      CAPACITY BENCHMARK
                    </span>
                    <span
                      className={cn(
                        "mono tnum text-[9.5px] font-semibold",
                        percentFilled >= 90 ? "text-booster" : "text-ink",
                      )}
                    >
                      {currentFilled}/{event.seatsTotal} SEATS
                    </span>
                  </div>

                  {/* Micro hairline progress bar */}
                  <div className="mb-3.5 h-[3px] w-full overflow-hidden rounded-full bg-hairline" aria-hidden="true">
                    <div
                      className={cn(
                        "h-full transition-[width] duration-500 ease-out",
                        percentFilled >= 90 ? "bg-booster" : "bg-cobalt",
                      )}
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>

                  {/* Interactive Reserve Seat Button */}
                  <button
                    type="button"
                    onClick={() => toggleReservation(event.id)}
                    aria-pressed={isReserved}
                    className={cn(
                      "group flex h-[40px] w-full items-center justify-center gap-2 text-[13px] font-semibold transition-all duration-200",
                      isReserved
                        ? "liquid-cobalt text-white"
                        : "liquid-secondary text-ink",
                    )}
                  >
                    {isReserved ? (
                      <>
                        <CheckSeal className="h-4 w-4" />
                        <span className="mono text-[10px] tracking-wider">
                          ✓ SEAT RESERVED
                        </span>
                      </>
                    ) : (
                      <>
                        <span>Reserve Seat</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[3px]" />
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* ── Bottom Informational Banner ──────────────────── */}
        <div className="liquid-panel mt-12 flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="liquid-chip mono border-ink px-2 py-1 text-[9px] text-ink">
              NOTICE
            </span>
            <p className="text-[13.5px] text-ink">
              All cohort sprints are recorded with verified GitHub PR reviews and mentor sign-offs.
            </p>
          </div>
          <span className="mono text-[9px] text-graphite">
            SEATS RESTRICTED TO MAINTAIN 1:8 MENTOR RATIO
          </span>
        </div>
      </div>
    </section>
  );
}
