"use client";

import { MAP_STATS } from "@/components/sections/customerCasesContent";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/cn";

const DURATION_MS = 2000;

function AnimatedMapStatNumber({
  target,
  enabled,
}: {
  target: number;
  enabled: boolean;
}) {
  const value = useCountUp(target, DURATION_MS, enabled);

  return <span className="tabular-nums text-[var(--text-base)]">{value}</span>;
}

export function MapStatsList({
  className,
  enabled = false,
}: {
  className?: string;
  enabled?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-[2px]", className)}>
      <ul className="flex flex-col gap-[2px]">
        {MAP_STATS.map((item) => (
          <li key={item.id} className="flex items-start gap-2">
            <span
              className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--text-tertiary)]"
              aria-hidden
            />
            <span className="text-base leading-6 text-[var(--text-secondary)]">
              {item.before}
              <AnimatedMapStatNumber target={item.target} enabled={enabled} />
              {item.after}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
