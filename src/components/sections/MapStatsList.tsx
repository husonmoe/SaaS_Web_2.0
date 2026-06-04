"use client";

import { MAP_STATS } from "@/components/sections/customerCasesContent";
import { MAP_STATS_DURATION_MS } from "@/components/sections/mapPanelTiming";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/cn";

function AnimatedMapStatNumber({
  target,
  enabled,
  durationMs,
}: {
  target: number;
  enabled: boolean;
  durationMs: number;
}) {
  const value = useCountUp(target, durationMs, enabled);

  return <span className="tabular-nums text-[var(--text-base)]">{value}</span>;
}

export function MapStatsList({
  className,
  enabled = false,
  durationMs = MAP_STATS_DURATION_MS,
}: {
  className?: string;
  enabled?: boolean;
  durationMs?: number;
}) {
  return (
    <div className={cn("flex flex-col gap-[2px]", className)}>
      <ul className="flex flex-col gap-[2px]">
        {MAP_STATS.map((item) => (
          <li key={item.id} className="flex items-center justify-start gap-2">
            <span
              className="size-1 shrink-0 rounded-full bg-[var(--text-tertiary)] lg:mt-2"
              aria-hidden
            />
            <span className="text-xs leading-5 text-[var(--text-secondary)] lg:text-base lg:leading-6">
              {item.before}
              <AnimatedMapStatNumber
                target={item.target}
                enabled={enabled}
                durationMs={durationMs}
              />
              {item.after}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
