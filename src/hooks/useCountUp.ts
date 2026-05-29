"use client";

import { useEffect, useState } from "react";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp(
  target: number,
  duration: number,
  enabled: boolean,
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let startTime: number | null = null;
    let rafId = 0;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.round(target * easeOutCubic(progress)));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, enabled]);

  return value;
}
