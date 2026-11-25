import { useEffect, useRef, useState } from "react";

export function useGuideTask(duration: number) {
  const [pending, setPending] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  function start(complete: () => void) {
    if (timer.current !== null) return;
    setPending(true);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      complete();
      setPending(false);
    }, duration);
  }

  return { pending, start };
}