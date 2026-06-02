"use client";

import { BusinessMap } from "@/components/sections/BusinessMap";
import { MapStatsList } from "@/components/sections/MapStatsList";
import {
  MAP_COLUMNS_OFFSET_MS,
  MAP_EFFECTS_START_MS,
  MAP_STATS_DURATION_MS,
} from "@/components/sections/mapPanelTiming";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";

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
      MAP_EFFECTS_START_MS,
    );
    const dotsTimer = window.setTimeout(
      () => setDotsActive(true),
      MAP_EFFECTS_START_MS,
    );
    const columnsTimer = window.setTimeout(
      () => setColumnsActive(true),
      MAP_EFFECTS_START_MS + MAP_COLUMNS_OFFSET_MS,
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
      <div className="relative aspect-[725/521] w-fit min-h-[240px] lg:h-[520px] lg:min-h-0 lg:shrink-0">
        <BusinessMap
          dotsActive={dotsActive}
          columnsActive={columnsActive}
          mapEntered={isInView}
          className="absolute inset-y-0 left-1/2 h-full -translate-x-1/2"
        />
      </div>

      <MapStatsList
        enabled={statsEnabled}
        durationMs={MAP_STATS_DURATION_MS}
        className="relative z-10 shrink-0 lg:absolute lg:bottom-0 lg:left-0 lg:w-full"
      />
    </div>
  );
}
