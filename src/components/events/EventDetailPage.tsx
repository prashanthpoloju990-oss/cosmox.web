import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { EVENT_DETAILS, EVENTS, type EventPerk } from "@/data/events";
import { navigateToCommunity } from "@/utils/appRoute";

/* ── Back-to-events navigation (returns to landing, scrolls to #events) ── */
export function backToEvents() {
  window.history.pushState(null, "", window.location.pathname + window.location.search);
  window.dispatchEvent(new Event("cosmox:route"));
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const el = document.getElementById("events");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
    });
  });
}

/* ── Perk icons ─────────────────────────────────────────────────── */
function PerkIcon({ icon, className }: { icon: EventPerk["icon"]; className?: string }) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  switch (icon) {
    case "mentorship":
      return (
        <svg {...shared}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 19c.6-3.2 2.9-4.8 5.5-4.8s4.9 1.6 5.5 4.8" />
          <path d="m16.5 4 1 2.3 2.3 1-2.3 1-1 2.3-1-2.3-2.3-1 2.3-1Z" />
        </svg>
      );
    case "certificate":
      return (
        <svg {...shared}>
          <rect x="3.5" y="4.5" width="17" height="12" rx="2.5" />
          <path d="M7 8.5h7M7 11.5h4.5" />
          <circle cx="16.5" cy="15" r="3.4" />
          <path d="m15.4 18.2-.7 3 1.8-1 1.8 1-.7-3" />
        </svg>
      );
    case "fasttrack":
      return (
        <svg {...shared}>
          <path d="M13.5 4.5c2.8 1 5 3.8 5.5 7l-4.2 4.2-4.5-1.5-1.5-4.5Z" />
          <circle cx="14" cy="9.5" r="1.5" />
          <path d="m9 15-3.5 3.5M6.5 12.5 4 13.5m9-1 1 2.5" />
        </svg>
      );
    default:
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="8" />
          <path d="M14.8 8.6H9.4l3.8 3.4a2.6 2.6 0 1 1-3.7 2.4" />
          <path d="M9.4 10.9h5.4" />
        </svg>
      );
  }
}

function SectionHeading({ eyebrow, title, className }: { eyebrow: string; title: string; className?: string }) {
  return (
    <div className={className}>
      <p className="mono flex items-center gap-2 text-[10px] text-booster">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-booster" />
        {eyebrow}
      </p>
      <h2 className="mt-2.5 font-display text-[30px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[34px]">
        {title}
      </h2>
    </div>
  );
}

/* ── Ticket card ────────────────────────────────────────────────── */
function TicketCard({ eventId }: { eventId: string }) {
  const event = EVENTS.find((item) => item.id === eventId);
  const detail = EVENT_DETAILS[eventId];
  const [registered, setRegistered] = useState(false);
  const [confirmation] = useState(() => `CONF-${eventId.replace("evt-", "")}${Math.floor(1000 + Math.random() * 9000)}`);

  if (!event || !detail) return null;
  const filled = Math.min(event.seatsTotal, event.seatsFilled + (registered ? 1 : 0));
  const percent = Math.round((filled / event.seatsTotal) * 100);

  const facts: [string, string][] = [
    ["Date", detail.facts.date],
    ["Location / Mode", detail.facts.location],
    ["Team Size", detail.facts.teamSize],
    ["Eligibility", detail.facts.eligibility],
    ["Registration Deadline", detail.facts.deadline],
  ];

  return (
    <aside
      aria-label="Registration and ticket"
      className="squircle sticky top-6 border border-[#DCD8CE] bg-chalk p-6 shadow-sm sm:p-7"
    >
      {/* entry & tier */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <p className="font-display text-[30px] leading-none tracking-[-0.02em] text-ink">
          {detail.price === "FREE FOR STUDENTS" ? (
            <>
              Free <span className="text-[22px] text-graphite">for students</span>
            </>
          ) : (
            detail.price
          )}
        </p>
        <span className="mono rounded-full border border-booster/35 bg-booster/[0.07] px-2.5 py-1 text-[8px] leading-none text-booster">
          {detail.seatBadge}
        </span>
      </div>
      <p className="mt-2 text-[12.5px] leading-[1.55] text-graphite">{detail.priceNote}</p>

      {/* seat pressure */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className="mono text-[8.5px] text-graphite">Seats filling fast</span>
          <span className="mono tnum text-[9px] font-semibold text-ink">{filled}/{event.seatsTotal}</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Seats filled">
          <div className={cn("h-full rounded-full transition-[width] duration-700", percent >= 85 ? "bg-booster" : "bg-cobalt")} style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* facts table */}
      <dl className="mt-5 border-t border-hairline">
        {facts.map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-4 border-b border-hairline py-3">
            <dt className="mono shrink-0 pt-0.5 text-[8.5px] leading-[1.5] text-graphite">{label}</dt>
            <dd className="text-right text-[12.5px] font-medium leading-[1.45] text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      {/* actions */}
      <div className="mt-6 space-y-2.5">
        {registered ? (
          <div className="swap-in rounded-2xl border border-cobalt/30 bg-cobalt/[0.055] p-4" role="status">
            <p className="flex items-center gap-2 text-[13.5px] font-semibold text-cobalt">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
              You&apos;re on the list
            </p>
            <p className="mt-1.5 text-[12px] leading-[1.55] text-graphite">
              Seat held under <span className="mono text-[10px] text-ink">{confirmation}</span>. The Google Form cohort link opens with registration — no action needed today.
            </p>
          </div>
        ) : (
          <button type="button" onClick={() => setRegistered(true)} className="liquid-primary group flex h-12 w-full items-center justify-center gap-2 rounded-full text-[14px] font-semibold">
            Register for Event
            <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[3px]" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" /></svg>
          </button>
        )}
        <button type="button" onClick={() => navigateToCommunity()} className="liquid-secondary flex h-11 w-full items-center justify-center gap-2 rounded-full text-[13px] font-medium">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-cobalt" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="8" r="3" />
            <path d="M3.5 19c.6-3.2 2.9-4.8 5.5-4.8s4.9 1.6 5.5 4.8" />
            <path d="M16 5v6m-3-3h6" />
          </svg>
          Find Teammates for This Event
        </button>
      </div>

      <p className="mono mt-4 text-center text-[8px] leading-[1.6] text-graphite">
        Preview · Real form link goes live with cohort 01
      </p>
    </aside>
  );
}

/* ── Main page ──────────────────────────────────────────────────── */
export function EventDetailPage({ eventId }: { eventId: string }) {
  const event = EVENTS.find((item) => item.id === eventId);
  const detail = EVENT_DETAILS[eventId];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [eventId]);

  if (!event || !detail) {
    return (
      <div className="min-h-svh bg-canvas px-4 py-20 sm:px-6">
        <div className="squircle mx-auto max-w-xl border border-hairline bg-chalk p-10 text-center">
          <p className="mono text-[10px] text-booster">404 // EVENT NOT FOUND</p>
          <h1 className="mt-4 font-display text-[34px] leading-[1.1] text-ink">This event isn&apos;t on the calendar.</h1>
          <p className="mt-3 text-[14px] leading-[1.65] text-graphite">It may have ended or the link is out of date. Browse the current lineup instead.</p>
          <button type="button" onClick={backToEvents} className="liquid-primary mt-6 inline-flex h-11 items-center gap-2 rounded-full px-6 text-[13.5px] font-semibold">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true"><path d="M14 8H3m4-4-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" /></svg>
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-detail relative min-h-svh bg-canvas text-ink">
      {/* ambient layered background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="dot-grid absolute inset-0 opacity-45 [mask-image:radial-gradient(120%_60%_at_50%_0%,#000_30%,transparent_80%)]" />
        <div className="absolute -top-32 left-1/2 h-72 w-[560px] max-w-full -translate-x-1/2 rounded-full bg-booster/[0.07] blur-[90px]" />
        <div className="absolute right-[8%] top-[46%] h-64 w-64 rounded-full bg-cobalt/[0.06] blur-[80px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        {/* ── 1 · Full-width hero banner ─────────────────────── */}
        <section aria-label={`${event.title} banner`} className="squircle relative mb-8 overflow-hidden rounded-3xl border border-ink/20 bg-ink">
          <img
            src={event.image.url}
            alt={event.image.alt}
            className="event-hero-img absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-ink/30" aria-hidden="true" />

          {/* floating back pill */}
          <button
            type="button"
            onClick={backToEvents}
            className="liquid-chip-dark group absolute left-4 top-4 z-10 inline-flex h-10 items-center gap-2 px-4 text-[12.5px] font-medium text-white sm:left-6 sm:top-6"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-[3px]" fill="none" aria-hidden="true">
              <path d="M14 8H3m4-4-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
            </svg>
            Back to Events
          </button>

          <div className="relative flex min-h-[360px] flex-col justify-end p-6 sm:min-h-[400px] sm:p-9 lg:min-h-[440px] lg:p-12">
            <div className="reveal flex flex-wrap items-center gap-2">
              <span className="liquid-chip-dark mono px-3 py-1.5 text-[8.5px] leading-none text-white/95">
                {detail.heroTag}
              </span>
              <span className="liquid-chip-dark mono inline-flex items-center gap-1.5 px-3 py-1.5 text-[8.5px] leading-none text-white/95">
                <span className="live-dot h-[5px] w-[5px] rounded-full bg-booster" />
                {event.dateBadge}
              </span>
            </div>

            <h1 className="reveal mt-5 max-w-[20ch] font-display text-[38px] leading-[1.03] tracking-[-0.025em] text-white sm:text-[46px] lg:text-[52px]" style={{ animationDelay: "70ms" }}>
              {detail.headline}
            </h1>
            <p className="reveal mt-4 max-w-[62ch] text-[15px] leading-[1.65] text-[#D1D5DB] sm:text-[16.5px]" style={{ animationDelay: "140ms" }}>
              {detail.summaryLine}
            </p>
          </div>
        </section>

        {/* ── 2 · Two-column editorial body ──────────────────── */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT · main content */}
          <main className="min-w-0 space-y-10 lg:col-span-8 lg:self-start">
            {/* About */}
            <section aria-labelledby="evt-about" className="reveal">
              <SectionHeading eyebrow="01 // About This Event" title="What you'll actually do" />
              <div id="evt-about" className="mt-4 space-y-4 text-[15px] leading-[1.75] text-graphite">
                <p>{detail.about[0]}</p>
                <p>{detail.about[1]}</p>
              </div>
            </section>

            {/* Perks */}
            <section aria-labelledby="evt-perks" className="reveal" style={{ animationDelay: "80ms" }}>
              <SectionHeading eyebrow="02 // Why Attend" title="Perks & real outcomes" />
              <div id="evt-perks" className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {detail.perks.map((perk) => (
                  <div key={perk.title} className="group rounded-2xl border border-hairline bg-stone/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-booster/40 hover:bg-stone">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-chalk text-booster ring-1 ring-hairline transition-transform duration-300 group-hover:scale-110">
                      <PerkIcon icon={perk.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-3 text-[14px] font-semibold leading-snug text-ink">{perk.title}</h3>
                    <p className="mt-1.5 text-[12.5px] leading-[1.6] text-graphite">{perk.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Timeline */}
            <section aria-labelledby="evt-rounds" className="reveal" style={{ animationDelay: "120ms" }}>
              <SectionHeading eyebrow="03 // Event Timeline & Rounds" title="How the day flows" />
              <ol id="evt-rounds" className="relative mt-5 space-y-0 border-l border-hairline pl-7">
                {detail.rounds.map((round, index) => (
                  <li key={round.name} className="group relative pb-8 last:pb-0">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -left-[41px] top-0 grid h-7 w-7 place-items-center rounded-full border-2 bg-chalk font-mono text-[10px] transition-colors duration-300",
                        round.upNext ? "border-booster text-booster shadow-[0_0_0_4px_rgba(217,78,31,0.12)]" : "border-hairline text-graphite group-hover:border-cobalt group-hover:text-cobalt",
                      )}
                    >
                      {index + 1}
                    </span>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-[15px] font-semibold leading-snug text-ink">{round.name}</h3>
                      <span className="mono rounded-full border border-hairline bg-chalk px-2.5 py-1 text-[8px] leading-none text-graphite">{round.window}</span>
                      {round.upNext && <span className="mono rounded-full bg-booster px-2.5 py-1 text-[8px] leading-none text-white">Up next</span>}
                    </div>
                    <p className="mt-1.5 max-w-[58ch] text-[13.5px] leading-[1.65] text-graphite">{round.detail}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Judges & mentors */}
            <section aria-labelledby="evt-judges" className="reveal" style={{ animationDelay: "160ms" }}>
              <SectionHeading eyebrow="04 // Judges, Speakers & Mentors" title="Who you'll meet" />
              <ul id="evt-judges" className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                {detail.judges.map((person) => (
                  <li key={person.name} className="group flex flex-col items-center rounded-2xl border border-hairline bg-stone/60 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-stone hover:shadow-[0_16px_32px_-26px_rgba(20,21,24,0.5)]">
                    <img
                      src={person.photo}
                      alt={`Portrait of ${person.name}`}
                      loading="lazy"
                      className={cn(
                        "h-20 w-20 rounded-full object-cover transition-transform duration-500 group-hover:scale-105",
                        person.featured ? "border-2 border-booster shadow-[0_0_0_4px_rgba(217,78,31,0.12)]" : "border-2 border-[#DCD8CE]",
                      )}
                    />
                    <p className="mt-3 text-[13px] font-bold leading-tight text-ink">{person.name}</p>
                    <p className="mt-1 text-[11px] leading-[1.45] text-graphite">{person.role}</p>
                    <span className="mono mt-2.5 rounded-full border border-hairline bg-chalk px-2.5 py-1 text-[7.5px] leading-none text-graphite">
                      {person.expertise}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </main>

          {/* RIGHT · sticky ticket card */}
          <div className="min-w-0 lg:col-span-4">
            <TicketCard eventId={event.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
