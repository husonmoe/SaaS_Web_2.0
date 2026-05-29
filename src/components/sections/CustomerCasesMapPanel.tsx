"use client";

import { BusinessMap } from "@/components/sections/BusinessMap";
import { MapStatsList } from "@/components/sections/MapStatsList";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";

const PANEL_ENTER_MS = 1200;
const MAP_EFFECT_STAGGER_MS = 1000;
const STATS_START_MS = PANEL_ENTER_MS / 2;

export function CustomerCasesMapPanel() {
  const { ref, isInView } = useInViewOnce(0.08);
  const [statsEnabled, setStatsEnabled] = useState(false);
  const [dotsActive, setDotsActive] = useState(false);
  const [columnsActive, setColumnsActive] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      setStatsEnabled(true);
      setDotsActive(true);
      setColumnsActive(true);
      return;
    }

    const statsTimer = window.setTimeout(
      () => setStatsEnabled(true),
      STATS_START_MS,
    );
    const dotsTimer = window.setTimeout(
      () => setDotsActive(true),
      PANEL_ENTER_MS,
    );
    const columnsTimer = window.setTimeout(
      () => setColumnsActive(true),
      PANEL_ENTER_MS + MAP_EFFECT_STAGGER_MS,
    );

    return () => {
      window.clearTimeout(statsTimer);
      window.clearTimeout(dotsTimer);
      window.clearTimeout(columnsTimer);
    };
  }, [isInView]);

  return (
    <div
      ref={ref}
      className={cn(
        "customer-cases-map-panel flex min-h-0 w-fit flex-col gap-8 lg:relative lg:h-[520px] lg:gap-0",
        isInView && "customer-cases-map-panel--entering",
      )}
    >
      <div className="relative aspect-[624/520] w-fit min-h-[240px] lg:h-[520px] lg:min-h-0 lg:shrink-0">
        <BusinessMap
          dotsActive={dotsActive}
          columnsActive={columnsActive}
          className="absolute inset-y-0 left-1/2 h-full -translate-x-1/2"
        />
      </div>

      <MapStatsList
        enabled={statsEnabled}
        className="relative z-10 shrink-0 lg:absolute lg:bottom-0 lg:left-0 lg:w-full"
      />
    </div>
  );
}
