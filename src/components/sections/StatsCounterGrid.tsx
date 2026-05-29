"use client";

import Image from "next/image";
import { useCountUp } from "@/hooks/useCountUp";
import { useInViewOnce } from "@/hooks/useInViewOnce";

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
    <p className="inline-flex w-[var(--stat-value-width)] shrink-0 items-center justify-center whitespace-nowrap bg-[image:var(--gradient-primary)] bg-clip-text text-center text-3xl font-bold leading-none tabular-nums text-transparent md:text-[40px]">
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
      className="grid w-full max-w-[1200px] grid-cols-2 gap-8 md:grid-cols-4"
    >
      {STATS.map((stat, index) => (
        <div
          key={stat.label}
          className="flex flex-col items-center gap-1 text-center"
        >
          <div className="flex items-center gap-1">
            <Image
              src={index === 0 ? ICON_LEFT : ICON_MID}
              alt=""
              width={48}
              height={48}
              className="size-12 shrink-0"
              unoptimized
            />
            <AnimatedStatValue
              target={stat.target}
              suffix={stat.suffix}
              enabled={isInView}
            />
            <Image
              src={ICON_RIGHT}
              alt=""
              width={48}
              height={48}
              className="size-12 shrink-0 rotate-180 scale-y-[-1]"
              unoptimized
            />
          </div>
          <p className="text-lg text-[var(--text-secondary)]">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
