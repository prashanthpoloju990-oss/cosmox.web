import { useEffect, useRef, useState } from "react";
import { SPACE_WORDS } from "@/data/branches";

const BASE_SPEED = 54; // px / second
const HOVER_FACTOR = 0.12;
const COPIES = 4;

function WordGroup({ ariaHidden }: { ariaHidden: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={ariaHidden || undefined}
    >
      {SPACE_WORDS.map((word) => (
        <li key={word} className="flex shrink-0 items-center">
          <span className="mono whitespace-nowrap px-6 text-[13px] text-ink sm:px-8">
            {word}
          </span>
          <span
            aria-hidden="true"
            className="h-[6px] w-[6px] shrink-0 rotate-45 bg-booster"
          />
        </li>
      ))}
    </ul>
  );
}

export function SpaceWordsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [engaged, setEngaged] = useState(false);
  const engagedRef = useRef(false);

  useEffect(() => {
    engagedRef.current = engaged;
  }, [engaged]);

  useEffect(() => {
    const track = trackRef.current;
    const group = groupRef.current;
    if (!track || !group) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = group.getBoundingClientRect().width || 1;
    const measure = () => {
      width = group.getBoundingClientRect().width || 1;
    };

    const ro = new ResizeObserver(measure);
    ro.observe(group);

    if (reduce) {
      track.style.transform = "translate3d(0,0,0)";
      return () => ro.disconnect();
    }

    let raf = 0;
    let last = performance.now();
    let offset = 0;
    let speed = BASE_SPEED;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const target = engagedRef.current ? BASE_SPEED * HOVER_FACTOR : BASE_SPEED;
      // frame-rate independent easing toward the target speed
      speed += (target - speed) * (1 - Math.pow(0.001, dt));

      offset -= speed * dt;
      if (-offset >= width) offset += width;

      track.style.transform = `translate3d(${offset.toFixed(2)}px,0,0)`;
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <section
      aria-label="Space engineering domains covered by Cosmox"
      className="relative border-y border-hairline bg-stone"
    >
      <div
        className="mask-fade-x relative overflow-hidden py-[18px]"
        onMouseEnter={() => setEngaged(true)}
        onMouseLeave={() => setEngaged(false)}
        onFocus={() => setEngaged(true)}
        onBlur={() => setEngaged(false)}
        onTouchStart={() => setEngaged(true)}
        onTouchEnd={() => setEngaged(false)}
      >
        <div
          ref={trackRef}
          className="flex w-max items-center will-change-transform"
          style={{ transform: "translate3d(0,0,0)" }}
        >
          {Array.from({ length: COPIES }).map((_, i) => (
            <div key={i} ref={i === 0 ? groupRef : undefined} className="flex shrink-0">
              <WordGroup ariaHidden={i > 0} />
            </div>
          ))}
        </div>
      </div>

      {/* edge registration ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 hidden h-3 w-px -translate-y-1/2 bg-hairline sm:block"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 hidden h-3 w-px -translate-y-1/2 bg-hairline sm:block"
      />
    </section>
  );
}