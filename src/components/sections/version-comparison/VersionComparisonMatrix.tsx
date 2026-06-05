"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
// import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import { cn } from "@/lib/cn";
import {
  VERSION_PLANS,
  VERSION_THEMES,
  type VersionPlan,
} from "@/components/sections/versionSchemeContent";
import {
  filterComparisonGroups,
  VERSION_COMPARISON_GROUPS,
  type ComparisonCellValue,
  type ComparisonFeatureGroup,
  type ComparisonFeatureRow,
  type VersionColumnId,
} from "@/components/sections/version-comparison/versionComparisonContent";

const ASSET_BASE = "/assets/image_version_comparison";
const CHECK_ICON_SRC = "/assets/icon_check.svg";
const COLUMN_IDS: VersionColumnId[] = ["basic", "insurance", "pro"];
/** 与 SiteHeader 一致：Mobile h-16 / Web lg:h-[72px] */
const MATRIX_STICKY_TOP_MOBILE_PX = 64;
const MATRIX_STICKY_TOP_DESKTOP_PX = 72;
const MATRIX_STICKY_TOP_LG_MQ = "(min-width: 1200px)";
function planByColumn(columnId: VersionColumnId): VersionPlan {
  const plan = VERSION_PLANS.find((p) => p.id === columnId);
  if (!plan) throw new Error(`Unknown column: ${columnId}`);
  return plan;
}

function ComparisonCheck({ color }: { color: string }) {
  return (
    <span
      className="inline-block size-4 shrink-0"
      style={{
        backgroundColor: color,
        mask: `url(${CHECK_ICON_SRC}) center / contain no-repeat`,
        WebkitMask: `url(${CHECK_ICON_SRC}) center / contain no-repeat`,
      }}
      aria-hidden
    />
  );
}

function ComparisonCell({
  value,
  columnId,
}: {
  value: ComparisonCellValue;
  columnId: VersionColumnId;
}) {
  const theme = VERSION_THEMES[planByColumn(columnId).theme];

  if (value.type === "check") {
    return <ComparisonCheck color={theme.color} />;
  }

  if (value.type === "dash") {
    return (
      <span className="text-sm leading-[22px] text-[var(--text-secondary)]">
        -
      </span>
    );
  }

  return (
    <span className="text-sm leading-[22px] text-[var(--text-secondary)]">
      {value.value}
    </span>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <Image
      src="/assets/icon_chervon_right_s.svg"
      alt=""
      width={24}
      height={24}
      className={`size-6 shrink-0 transition-transform ${expanded ? "-rotate-90" : "rotate-90"}`}
      aria-hidden
    />
  );
}

function MatrixHeader({ stuck = false }: { stuck?: boolean }) {
  const borderTone = stuck
    ? "border-transparent"
    : "border-[var(--border-light)]";

  return (
    <div
      className={cn(
        "box-border grid h-fit w-full grid-cols-4 overflow-hidden border bg-[var(--bg-white)]",
        stuck ? "rounded-none" : "rounded-xl",
        borderTone,
      )}
    >
      <div
        className={cn(
          "box-border flex h-full flex-col items-center justify-center gap-3 border-r bg-white p-3",
          borderTone,
        )}
      >
        <div className="flex h-full w-full flex-col gap-1">
          <p className="text-xl font-medium leading-7 text-[var(--text-base)]">
            版本
          </p>
        </div>
      </div>

      {COLUMN_IDS.map((columnId) => {
        const plan = planByColumn(columnId);
        const theme = VERSION_THEMES[plan.theme];

        return (
          <div
            key={columnId}
            className={cn(
              "box-border flex h-full flex-col items-center justify-start gap-3 border-r bg-white px-2 py-3 last:border-r-0",
              borderTone,
            )}
          >
            <div className="flex w-full flex-col items-center gap-1 text-center">
              <div className="flex flex-col items-center justify-center gap-1">
                <p
                  className="text-xl font-semibold leading-7"
                  style={{ color: theme.color }}
                >
                  {plan.title}
                </p>
              </div>
              <p className="text-xs leading-[22px] text-[var(--text-secondary)]">
                {plan.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MatrixRow({ row }: { row: ComparisonFeatureRow }) {
  return (
    <div className="grid w-full grid-cols-4 border-b border-[var(--border-light)] bg-white last:border-b-0">
      <div className="flex h-full min-w-0 items-center border-r border-[var(--border-light)] px-3 py-3">
        <span
          className={cn(
            "min-w-0 break-words text-sm leading-[22px] text-[var(--text-base)]",
            row.emphasis && "font-medium",
          )}
        >
          {row.label}
          {row.info ? (
            <>
              <span className="inline-block w-1 align-[-3px]" aria-hidden />
              {"\u200B"}
              <Image
                src={`${ASSET_BASE}/icon_info_circle.svg`}
                alt="说明"
                width={16}
                height={16}
                className="inline-block size-4 shrink-0 align-[-3px]"
                title={row.label}
              />
            </>
          ) : null}
        </span>
      </div>

      {COLUMN_IDS.map((columnId) => (
        <div
          key={columnId}
          className="flex h-full items-center justify-center border-r border-[var(--border-light)] px-3 py-3 last:border-r-0"
        >
          <ComparisonCell value={row.values[columnId]} columnId={columnId} />
        </div>
      ))}
    </div>
  );
}

function MatrixGroup({
  group,
  expanded,
  onToggle,
}: {
  group: ComparisonFeatureGroup;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border-light)]">
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-12 w-full items-center justify-between gap-2 bg-[var(--bg-shell)] py-3 pl-3 pr-4 text-left ${expanded ? "border-b border-[var(--border-light)]" : ""}`}
        aria-expanded={expanded}
      >
        <span className="text-lg font-medium leading-[26px] text-[var(--text-base)]">
          {group.title}
        </span>
        <ChevronIcon expanded={expanded} />
      </button>

      {expanded ? (
        <div>
          {group.rows.map((row) => (
            <MatrixRow key={row.id} row={row} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function VersionComparisonMatrix() {
  const hideIdentical = false;
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      VERSION_COMPARISON_GROUPS.map((g) => [g.id, g.defaultExpanded ?? true]),
    ),
  );
  const stickySentinelRef = useRef<HTMLDivElement>(null);
  const [headerStuck, setHeaderStuck] = useState(false);
  const [headerOffsetPx, setHeaderOffsetPx] = useState(
    MATRIX_STICKY_TOP_MOBILE_PX,
  );

  useEffect(() => {
    const mq = window.matchMedia(MATRIX_STICKY_TOP_LG_MQ);
    const syncOffset = () => {
      setHeaderOffsetPx(
        mq.matches
          ? MATRIX_STICKY_TOP_DESKTOP_PX
          : MATRIX_STICKY_TOP_MOBILE_PX,
      );
    };

    syncOffset();
    mq.addEventListener("change", syncOffset);
    return () => mq.removeEventListener("change", syncOffset);
  }, []);

  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeaderStuck(!entry.isIntersecting),
      {
        threshold: 0,
        rootMargin: `-${headerOffsetPx}px 0px 0px 0px`,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [headerOffsetPx]);

  const visibleGroups = useMemo(
    () => filterComparisonGroups(VERSION_COMPARISON_GROUPS, hideIdentical),
    [hideIdentical],
  );

  return (
    <div className="w-full max-w-[1200px]">
      <div
        ref={stickySentinelRef}
        className="pointer-events-none h-px w-full"
        aria-hidden
      />

      <div
        className="relative sticky top-16 z-40 h-fit w-full overflow-visible lg:top-[72px]"
        style={{
          boxShadow: headerStuck ? "var(--shadow-card)" : undefined,
        }}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2 bg-[var(--bg-white)] transition-opacity duration-150",
            headerStuck ? "opacity-100" : "opacity-0",
          )}
          style={{
            boxShadow: headerStuck ? "var(--shadow-card)" : undefined,
          }}
        />
        <div className="relative z-10 h-fit w-full">
          {/* FadeInOnScroll 暂关 */}
          <MatrixHeader stuck={headerStuck} />
        </div>
      </div>

      <div className="w-full overflow-x-hidden">
        {visibleGroups.length === 0 ? (
          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            当前筛选下没有差异项
          </p>
        ) : (
          visibleGroups.map((group) => (
            <MatrixGroup
              key={group.id}
              group={group}
              expanded={expanded[group.id] ?? true}
              onToggle={() =>
                setExpanded((prev) => ({
                  ...prev,
                  [group.id]: !(prev[group.id] ?? true),
                }))
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
