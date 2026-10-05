import { useEffect, useRef, useState } from "react";

/**
 * Rule 2: motion must never imply data that isn't there.
 * Returns true for one render pass when `value` actually changes, so callers can
 * mount a short bloom. Nothing loops, and nothing fires on first paint —
 * a freshly mounted panel has not "changed", it has only arrived.
 */
export function useChangePulse(value, enabled = true) {
  const previous = useRef(undefined);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const first = previous.current === undefined;
    previous.current = value;
    if (first) return;

    setPulsing(true);
    const timer = setTimeout(() => setPulsing(false), 950);
    return () => clearTimeout(timer);
  }, [value, enabled]);

  return pulsing;
}