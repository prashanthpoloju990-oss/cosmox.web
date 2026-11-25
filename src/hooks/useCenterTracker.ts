import { useEffect, useState } from "react";

export interface CenterTrack {
  /** Index of the element whose centre is closest to the viewport centre. */
  index: number;
  /** 0 → 1 progress from the first element's centre to the last's, measured against the viewport centre. */
  progress: number;
}

interface RefList {
  current: (HTMLElement | null)[];
}

/**
 * Scroll-progress tracker. Measures every registered element on scroll (rAF-throttled)
 * and reports which one is currently centred in the viewport, plus an overall
 * progress value across the whole list — used to drive the sticky step rails.
 */
export function useCenterTracker(refs: RefList, count: number): CenterTrack {
  const [state, setState] = useState<CenterTrack>({ index: 0, progress: 0 });

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const els = refs.current;
      const centers: number[] = [];
      for (let i = 0; i < count; i++) {
        const el = els[i];
        if (!el) return;
        const r = el.getBoundingClientRect();
        centers.push(r.top + r.height / 2);
      }

      const vc = window.innerHeight / 2;
      let best = 0;
      for (let i = 1; i < centers.length; i++) {
        if (Math.abs(centers[i] - vc) < Math.abs(centers[best] - vc)) best = i;
      }

      const span = centers[centers.length - 1] - centers[0];
      const raw = span > 0 ? (vc - centers[0]) / span : 0;
      const progress = Math.min(1, Math.max(0, raw));

      setState((prev) =>
        prev.index === best && Math.abs(prev.progress - progress) < 0.002
          ? prev
          : { index: best, progress },
      );
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [refs, count]);

  return state;
}
