import { useCallback, useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { ArrowRight, BrandMark } from "@/components/Icons";
import { navigateToAuth } from "@/utils/authNavigation";

interface NavLink {
  id: string;
  label: string;
  index: string;
}

const LINKS: NavLink[] = [
  { id: "career", label: "Career Paths", index: "01" },
  { id: "live", label: "Live Radar", index: "02" },
  { id: "events", label: "Events", index: "03" },
  { id: "ai", label: "AI Guide", index: "04" },
  { id: "founder", label: "Founder", index: "05" },
];

function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
}

interface NavPillProps {
  tone: "dark" | "light";
  active: string;
  open: boolean;
  onToggleOpen: () => void;
  onNavigate: (id: string) => void;
  onJoin: () => void;
  onDemoLogin: () => void;
  menuId: string;
  className?: string;
}

function NavCapsule({
  tone,
  active,
  open,
  onToggleOpen,
  onNavigate,
  onJoin,
  onDemoLogin,
  menuId,
  className,
}: NavPillProps) {
  const isDark = tone === "dark";

  return (
    <div className={cn("relative mx-auto w-full max-w-6xl", className)}>
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-full px-4 py-2.5 sm:px-5 sm:py-3 transition-all duration-300",
          isDark ? "hero-glass-nav" : "floating-light-nav",
        )}
      >
        {/* Left: Brand mark + COSMOX wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="group flex shrink-0 items-center gap-2.5 pl-0.5"
          aria-label="COSMOX — back to top"
        >
          <BrandMark
            tone={isDark ? "dark" : "light"}
            className="h-8 w-8 shrink-0 transition-transform duration-500 group-hover:rotate-[10deg]"
          />
          <span
            className={cn(
              "text-[16.5px] font-bold tracking-[-0.025em] leading-none",
              isDark ? "text-white" : "text-ink",
            )}
          >
            COSMOX
          </span>
        </a>

        {/* Center: Clean smooth-scroll links */}
        <nav
          aria-label={isDark ? "Primary" : "Sticky primary"}
          className="hidden items-center gap-0.5 lg:flex"
        >
          {LINKS.map((link) => {
            const isActive = !isDark && active === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.id);
                }}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-all duration-200 whitespace-nowrap",
                  isDark
                    ? "text-[#E5E7EB] hover:bg-white/[0.1] hover:text-white"
                    : isActive
                      ? "bg-white/75 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                      : "text-graphite hover:bg-white/55 hover:text-ink",
                )}
              >
                {link.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-booster"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Demo Login frosted glass pill + Join Cohort primary orange liquid glass pill */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onDemoLogin}
            className={cn(
              "hidden h-[38px] items-center rounded-full px-4 text-[13px] font-medium whitespace-nowrap sm:inline-flex",
              isDark ? "hero-glass-btn" : "liquid-secondary",
            )}
          >
            Demo Login
          </button>

          <button
            type="button"
            onClick={onJoin}
            className="hero-primary-btn group inline-flex h-[38px] items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold whitespace-nowrap"
          >
            <span>Join Cohort</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-[2px]" />
          </button>

          <button
            type="button"
            onClick={onToggleOpen}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className={cn(
              "inline-flex h-[38px] w-[38px] items-center justify-center rounded-full lg:hidden",
              isDark ? "hero-glass-btn text-white" : "liquid-secondary text-ink",
            )}
          >
            <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d={open ? "M3.5 3.5l11 11M14.5 3.5l-11 11" : "M2 5h14M2 9h14M2 13h14"}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile glass menu dropdown */}
      <div
        id={menuId}
        inert={!open}
        className={cn(
          "overflow-hidden transition-all duration-300 lg:hidden",
          open ? "mt-2.5 max-h-[440px] opacity-100" : "pointer-events-none max-h-0 opacity-0",
        )}
      >
        <nav
          aria-label={isDark ? "Mobile primary" : "Mobile sticky"}
          className={cn(
            "rounded-[24px] p-4 sm:p-5",
            isDark ? "hero-mobile-drawer" : "floating-light-drawer",
          )}
        >
          <div className="divide-y divide-current/10">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.id);
                }}
                className={cn(
                  "flex items-baseline justify-between py-3 text-[15px] font-medium transition-colors",
                  isDark
                    ? "border-white/12 text-white/90 hover:text-white"
                    : "border-hairline text-ink hover:text-booster",
                )}
              >
                <span>{link.label}</span>
                <span
                  className={cn(
                    "mono text-[9.5px]",
                    isDark ? "text-white/45" : "text-graphite",
                  )}
                >
                  {link.index}
                </span>
              </a>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onDemoLogin}
              className={cn(
                "flex h-[42px] w-full items-center justify-center rounded-full text-[13px] font-medium",
                isDark ? "hero-glass-btn text-white" : "liquid-secondary text-ink",
              )}
            >
              Demo Login
            </button>
            <button
              type="button"
              onClick={onJoin}
              className="hero-primary-btn flex h-[42px] w-full items-center justify-center gap-1.5 rounded-full text-[13px] font-semibold"
            >
              Join Cohort
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

/**
 * Floating Liquid Glass navbar rendered inside the top of the Hero stage,
 * paired with a light frosted capsule bar that gracefully docks when
 * scrolling past the hero into Warm Alabaster sections below.
 */
export function HeroFloatingNav() {
  const [heroOpen, setHeroOpen] = useState(false);
  const [stickyOpen, setStickyOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [active, setActive] = useState("career");

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const heroEl = document.getElementById("hero-stage");
        const threshold = heroEl
          ? Math.max(heroEl.offsetTop + heroEl.offsetHeight - 100, 420)
          : 560;
        const passed = window.scrollY > threshold;
        setPastHero(passed);
        if (passed) setHeroOpen(false);
        else setStickyOpen(false);

        const probe = window.innerHeight * 0.42;
        let current = "career";
        for (const link of LINKS) {
          const el = document.getElementById(link.id);
          if (el && el.getBoundingClientRect().top <= probe) current = link.id;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setHeroOpen(false);
        setStickyOpen(false);
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setHeroOpen(false);
        setStickyOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleNavigate = useCallback((id: string) => {
    setActive(id);
    setHeroOpen(false);
    setStickyOpen(false);
    window.requestAnimationFrame(() => scrollToId(id));
  }, []);

  const handleJoin = useCallback(() => {
    setHeroOpen(false);
    setStickyOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.dispatchEvent(new Event("cosmox:join"));
  }, []);

  const handleDemoLogin = useCallback(() => {
    setHeroOpen(false);
    setStickyOpen(false);
    navigateToAuth("signin");
  }, []);

  return (
    <>
      {/* Primary in-hero floating dark Liquid Glass navbar */}
      <header className="relative z-30 w-full px-3 pt-4 sm:px-6 sm:pt-5">
        <NavCapsule
          tone="dark"
          active={active}
          open={heroOpen}
          onToggleOpen={() => setHeroOpen((v) => !v)}
          onNavigate={handleNavigate}
          onJoin={handleJoin}
          onDemoLogin={handleDemoLogin}
          menuId="hero-mobile-nav"
        />
      </header>

      {/* Adaptive floating light Liquid Glass bar while browsing below the hero */}
      <div
        inert={!pastHero}
        aria-hidden={!pastHero}
        className={cn(
          "fixed inset-x-0 top-3 z-50 px-3 sm:px-6 transition-all duration-400",
          pastHero
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0",
        )}
      >
        <NavCapsule
          tone="light"
          active={active}
          open={stickyOpen}
          onToggleOpen={() => setStickyOpen((v) => !v)}
          onNavigate={handleNavigate}
          onJoin={handleJoin}
          onDemoLogin={handleDemoLogin}
          menuId="sticky-mobile-nav"
        />
      </div>
    </>
  );
}

export { HeroFloatingNav as TopNav };
