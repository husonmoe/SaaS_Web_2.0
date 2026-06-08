"use client";

import Image from "next/image";
import { useCountUp } from "@/hooks/useCountUp";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cn } from "@/lib/cn";

const ICON_LEFT = "/assets/figma-cache/stats-1.svg";
const ICON_RIGHT = "/assets/figma-cache/stats-2.svg";
const ICON_MID = "/assets/figma-cache/stats-3.svg";

const DURATION_MS = 2000;

const STATS = [
  { target: 2000, suffix: "+", label: "覆盖区县" },
  { target: 21, suffix: "万+", label: "医疗机构" },
  { target: 50, suffix: "万+", label: "基层医护人员" },
  { target: 5000, suffix: "万+", label: "服务患者" },
] as const;

function AnimatedStatValue({
  target,
  suffix,
  enabled,
}: {
  target: number;
  suffix: string;
  enabled: boolean;
}) {
  const value = useCountUp(target, DURATION_MS, enabled);

  return (
    <p
      className={cn(
        "inline-flex min-w-[var(--stat-value-width)] shrink-0 items-center justify-center whitespace-nowrap bg-[image:var(--gradient-primary)] bg-clip-text text-center text-[28px] font-bold leading-[55px] tabular-nums text-transparent md:text-[40px]",
      )}
    >
      {value}
      {suffix}
    </p>
  );
}

export function StatsCounterGrid() {
  const { ref, isInView } = useInViewOnce(0.15);

  return (
    <div
      ref={ref}
      className="grid w-full grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-2 md:gap-x-6 md:gap-y-10 lg:grid-cols-4 lg:gap-8"
    >
      {STATS.map((stat, index) => (
        <div
          key={stat.label}
          className={cn(
            "flex items-center justify-center gap-1 text-center lg:justify-center",
          )}
        >
          <Image
            src={index === 0 ? ICON_LEFT : ICON_MID}
            alt=""
            width={48}
            height={48}
            className="size-8 shrink-0 md:size-12"
            unoptimized
          />
          <div className="flex w-[var(--stat-value-width)] flex-col items-center gap-0">
            <AnimatedStatValue
              target={stat.target}
              suffix={stat.suffix}
              enabled={isInView}
            />
            <p className="text-xs text-[var(--text-secondary)] md:text-lg">{stat.label}</p>
          </div>
          <Image
            src={ICON_RIGHT}
            alt=""
            width={48}
            height={48}
            className="size-8 shrink-0 rotate-180 scale-y-[-1] md:size-12"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
