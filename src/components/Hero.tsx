import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { ArrowRight, CheckSeal } from "@/components/Icons";
import { HeroFloatingNav } from "@/components/TopNav";

function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
}

function OrbitRocketIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M14.5 9.5c2.8-2.8 5.2-5 5.6-5.6-.6.4-2.8 2.8-5.6 5.6Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M12.2 15.8c3.6-1 6.7-4.4 7.7-9.6-5.2 1-8.6 4.1-9.6 7.7l1.9 1.9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10.4 10.7 6.8 11.4 5 13.7l3.3.5M13.3 13.6l-.7 3.6-2.3 1.8-.5-3.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="15.3" cy="8.7" r="1.3" fill="#F59E56" />
      <path
        d="M5.2 18.8c.5-1.4 1.4-2.2 2.7-2.6"
        stroke="#D94E1F"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Hero() {
  const [joinOpen, setJoinOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  // Navbar, Final CTA, and other Join buttons open this inline seat request panel.
  useEffect(() => {
    const onJoin = () => {
      setJoinOpen(true);
      window.setTimeout(
        () => inputRef.current?.focus({ preventScroll: true }),
        420,
      );
    };
    window.addEventListener("cosmox:join", onJoin);
    return () => window.removeEventListener("cosmox:join", onJoin);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    setStatus(ok ? "done" : "error");
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-canvas pb-4 pt-3 sm:pb-5"
    >
      {/* Framed rounded deep-space & astronaut stage */}
      <div
        id="hero-stage"
        className="relative mx-3 flex min-h-[88vh] flex-col justify-between overflow-hidden rounded-[28px] border border-[#DCD8CE] bg-[#0B0D14] shadow-[0_28px_72px_-24px_rgba(11,13,20,0.46),0_10px_28px_-14px_rgba(20,21,24,0.22)] sm:mx-5 sm:rounded-[32px]"
      >
        {/* ── Layered Cosmic Backdrop ───────────────────────────── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Base deep space galaxy & starfield */}
          <img
            src="/images/hero-galaxy.jpg"
            alt=""
            className="hero-ken-burns-galaxy absolute inset-0 h-full w-full object-cover object-center opacity-55"
          />

          {/* Main illuminated astronaut spacewalk & golden Earth horizon */}
          <img
            src="/images/hero-spacewalk.jpg"
            alt=""
            className="hero-ken-burns absolute inset-0 h-full w-full object-cover object-[62%_42%] opacity-90 mix-blend-lighten sm:object-[58%_44%]"
          />

          {/* Subtle warm amber sunrise bloom harmonizing with #D94E1F */}
          <div
            className="absolute inset-0 opacity-75"
            style={{
              background:
                "radial-gradient(48% 44% at 16% 48%, rgba(245, 158, 11, 0.18) 0%, rgba(217, 78, 31, 0.14) 38%, transparent 72%), radial-gradient(38% 40% at 72% 56%, rgba(245, 158, 86, 0.16) 0%, transparent 68%)",
            }}
          />

          {/* Readability vignette for razor-sharp white typography and rich dark base */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(11,13,20,0.42) 0%, rgba(11,13,20,0.52) 52%, rgba(11,13,20,0.9) 100%)",
            }}
          />

          {/* Focused soft vignette directly behind centered headline & subheadline */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(56% 40% at 50% 45%, rgba(11,13,20,0.48) 0%, rgba(11,13,20,0.12) 62%, transparent 100%)",
            }}
          />

          {/* Fine-line editorial SVG orbital arcs & crosshairs */}
          <svg
            viewBox="0 0 1440 860"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full"
          >
            {/* Corner crosshair registration marks */}
            <g stroke="rgba(255,255,255,0.14)" strokeWidth="1">
              <path d="M36 28v16M28 36h16" />
              <path d="M1404 28v16M1396 36h16" />
              <path d="M36 816v16M28 824h16" />
              <path d="M1404 816v16M1396 824h16" />
              {/* Sweeping architectural orbital arcs */}
              <ellipse
                cx="720"
                cy="470"
                rx="640"
                ry="235"
                transform="rotate(-11 720 470)"
              />
              <circle
                cx="720"
                cy="450"
                r="470"
                strokeDasharray="3 9"
              />
              <path d="M180 760 C 460 660, 980 660, 1260 760" />
            </g>
            {/* Delicate glowing burnt-orange orbital reference node */}
            <circle cx="1116" cy="248" r="3" fill="#D94E1F" fillOpacity="0.85" />
            <circle
              cx="1116"
              cy="248"
              r="9"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="1"
            />
          </svg>

          {/* Subtle top glass edge glint inside the stage frame */}
          <div
            className="absolute inset-0 rounded-[28px] sm:rounded-[32px]"
            style={{
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(255,255,255,0.08)",
            }}
          />
        </div>

        {/* ── Floating Liquid Glass Navbar inside top of Hero ───── */}
        <HeroFloatingNav />

        {/* ── Centerpiece Editorial Headline Stack (No Eyebrow Pill) ── */}
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 pb-12 pt-16 text-center sm:pt-20 lg:pb-24 lg:pt-20">
          <h1
            id="hero-heading"
            className="reveal max-w-[18.5ch] font-display text-[clamp(3.25rem,6.2vw,4.75rem)] leading-[1.02] tracking-[-0.025em] text-white [text-shadow:0_6px_36px_rgba(11,13,20,0.58)]"
            style={{ animationDelay: "60ms" }}
          >
            Turn your engineering degree into a real{" "}
            <em className="hero-space-italic italic font-normal">space</em>{" "}
            career.
          </h1>

          <p
            className="reveal mx-auto mt-5 max-w-2xl text-[17px] leading-[1.6] text-[#D1D5DB] sm:text-[19px]"
            style={{ animationDelay: "140ms" }}
          >
            Simple branch-by-branch roadmaps, verified ISRO &amp; space-startup
            internships, live launches, and serious hackathon squads—all in one
            clear workspace.
          </p>

          {/* Dual Liquid Glass CTA Row */}
          <div
            className="reveal mt-8 flex flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: "220ms" }}
          >
            <button
              type="button"
              onClick={() => setJoinOpen((v) => !v)}
              aria-expanded={joinOpen}
              aria-controls="seat-request"
              data-cta="join"
              className="hero-primary-btn group inline-flex h-[52px] items-center gap-2.5 rounded-full px-7 text-[15px] font-semibold text-white"
            >
              <span>Join Founding Cohort</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[4px]" />
            </button>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("cosmox:demo"))}
              className="hero-secondary-btn inline-flex h-[52px] items-center gap-2.5 rounded-full px-7 text-[15px] font-medium text-white"
            >
              Explore Interactive Demo
            </button>
          </div>

          {/* Inline Liquid Glass Cohort Seat Request Drawer */}
          <div
            id="seat-request"
            inert={!joinOpen}
            className={cn(
              "grid w-full max-w-lg transition-[grid-template-rows,opacity] duration-500",
              joinOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <div className="hero-seat-card mt-5 rounded-[24px] p-4 text-left sm:p-5">
                {status === "done" ? (
                  <div className="flex items-start gap-3">
                    <CheckSeal className="mt-[2px] h-4 w-4 shrink-0 text-[#F59E56]" />
                    <div>
                      <p className="mono text-[10px] text-[#F59E56]">
                        Seat request saved · Cohort 01
                      </p>
                      <p className="mt-1.5 text-[13.5px] leading-[1.55] text-[#E5E7EB]">
                        We logged{" "}
                        <span className="font-semibold text-white">{email}</span>.
                        Reply with your branch and year when your invite arrives
                        to unlock your roadmap.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setStatus("idle");
                          setEmail("");
                        }}
                        className="mono mt-2.5 text-[9.5px] text-[#F8B682] underline underline-offset-4 hover:text-white"
                      >
                        Add another email
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate>
                    <div className="mb-2.5 flex items-center justify-between gap-2">
                      <p className="mono text-[9.5px] text-white/70">
                        Founding Cohort · Save your seat
                      </p>
                      <button
                        type="button"
                        onClick={() => setJoinOpen(false)}
                        aria-label="Close cohort form"
                        className="mono text-[9px] text-white/55 transition-colors hover:text-white"
                      >
                        Close
                      </button>
                    </div>
                    <div className="flex flex-col gap-2.5 sm:flex-row">
                      <input
                        ref={inputRef}
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === "error") setStatus("idle");
                        }}
                        placeholder="you@college.edu"
                        aria-label="College email address"
                        aria-invalid={status === "error"}
                        className={cn(
                          "h-[44px] w-full flex-1 rounded-full border bg-white/10 px-4 text-[14px] text-white outline-none backdrop-blur-md transition-colors placeholder:text-white/45 focus:border-white/60 focus:bg-white/14",
                          status === "error" ? "border-booster" : "border-white/22",
                        )}
                      />
                      <button
                        type="submit"
                        className="hero-primary-btn inline-flex h-[44px] shrink-0 items-center justify-center rounded-full px-5 text-[13.5px] font-semibold text-white"
                      >
                        Request Seat
                      </button>
                    </div>
                    <p
                      className={cn(
                        "mt-2 text-[11.5px]",
                        status === "error" ? "text-[#FCA585]" : "text-white/55",
                      )}
                    >
                      {status === "error"
                        ? "Enter a valid college or personal email address."
                        : "Cohort updates only — no spam, leave anytime."}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── 2 Floating Liquid Glass Orbital Preview Cards ─────── */}
        {/* Desktop: gracefully flanking lower left & lower right over the cosmic border */}
        {/* Tablet/Mobile: compact paired glass cards inside the lower edge */}
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pb-8 lg:pointer-events-none lg:px-8 lg:pb-9">
          {/* Left Floating Glass Card */}
          <button
            type="button"
            onClick={() => scrollToId("career")}
            className="hero-orbital-card hero-float-left pointer-events-auto group flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left sm:max-w-[300px]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-booster/20 text-[#FFAB78] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition-transform duration-300 group-hover:scale-105">
              <OrbitRocketIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[13.5px] font-semibold leading-snug text-white">
                20 Space Job Roadmaps
              </span>
              <span className="mono mt-0.5 block text-[9px] tracking-[0.08em] text-white/68">
                CSE • ECE • MECH • AERO
              </span>
            </span>
          </button>

          {/* Right Floating Glass Card */}
          <button
            type="button"
            onClick={() => scrollToId("live")}
            className="hero-orbital-card hero-float-right pointer-events-auto group flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left sm:max-w-[320px]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/18 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-booster opacity-75 [animation:cx-ping_2.2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <span className="live-dot relative inline-flex h-2.5 w-2.5 rounded-full bg-booster shadow-[0_0_10px_rgba(217,78,31,0.9)]" />
              </span>
            </span>
            <span className="min-w-0">
              <span className="block text-[13.5px] font-semibold leading-snug text-white">
                Live Launch &amp; Internship Radar
              </span>
              <span className="mono mt-0.5 block text-[9px] tracking-[0.08em] text-white/68">
                Updated Weekly
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
