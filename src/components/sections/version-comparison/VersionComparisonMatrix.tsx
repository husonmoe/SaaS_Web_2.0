"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
// import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import { useTrialModal } from "@/contexts/TrialModalContext";
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
const MATRIX_STICKY_TOP = "var(--hero-header-offset, 72px)";
/** 与 SiteHeader 一致：Mobile h-16 / Web lg:h-[72px] */
const MATRIX_STICKY_TOP_MOBILE_PX = 64;
const MATRIX_STICKY_TOP_DESKTOP_PX = 72;
const MATRIX_STICKY_TOP_LG_MQ = "(min-width: 1024px)";
const MATRIX_CHECKBOX_CHECKMARK =
  "url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2012%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M2%206l3%203%205-5%22%20stroke%3D%22white%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')";

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

function ChevronIcon({
  expanded,
  className,
}: {
  expanded: boolean;
  className?: string;
}) {
  return (
    <Image
      src="/assets/icon_chervon_right_s.svg"
      alt=""
      width={24}
      height={24}
      className={cn(
        "size-6 shrink-0 transition-transform lg:size-4",
        expanded ? "-rotate-90" : "rotate-90",
        className,
      )}
      aria-hidden
    />
  );
}

/** Mobile / Pad 简化表头 */
function MatrixHeaderMobile({ stuck = false }: { stuck?: boolean }) {
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

/** Web 完整表头（恢复 PR #3 前样式） */
function MatrixHeaderWeb({
  hideIdentical,
  onHideIdenticalChange,
  stuck = false,
}: {
  hideIdentical: boolean;
  onHideIdenticalChange: (checked: boolean) => void;
  stuck?: boolean;
}) {
  const { open: openTrialModal } = useTrialModal();

  return (
    <div
      className={cn(
        "grid w-full grid-cols-4 overflow-hidden rounded-xl border bg-[var(--bg-white)]",
        stuck ? "border-transparent" : "border-[var(--border-light)]",
      )}
    >
      <div
        className={cn(
          "flex min-h-[158px] flex-col justify-between gap-3 bg-white p-6",
          stuck
            ? "border-r border-transparent"
            : "border-r border-[var(--border-light)]",
        )}
      >
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-medium leading-8 text-[var(--text-base)]">
            版本
          </p>
          <button
            type="button"
            className="inline-flex w-fit items-center gap-1 text-sm leading-[22px] text-[var(--color-primary)]"
          >
            <span
              className="inline-block size-4 shrink-0 bg-[var(--color-primary)]"
              style={{
                mask: `url(${ASSET_BASE}/icon_list_square.svg) center / contain no-repeat`,
                WebkitMask:
                  `url(${ASSET_BASE}/icon_list_square.svg) center / contain no-repeat`,
              }}
              aria-hidden
            />
            获取报价单
          </button>
        </div>
        <label className="group inline-flex cursor-pointer items-center gap-2 text-sm leading-[22px] text-[var(--text-base)]">
          <input
            type="checkbox"
            checked={hideIdentical}
            onChange={(e) => onHideIdenticalChange(e.target.checked)}
            className="size-4 shrink-0 cursor-pointer appearance-none rounded border border-[var(--border-light)] bg-white transition-[background-color,border-color,filter] duration-150 checked:border-[var(--color-primary)] checked:bg-[var(--color-primary)] checked:bg-[length:10px_10px] checked:bg-center checked:bg-no-repeat focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] group-hover:[&:not(:checked)]:border-[var(--color-primary)] group-hover:[&:not(:checked)]:bg-[color-mix(in_srgb,var(--color-primary)_8%,white)] group-active:[&:not(:checked)]:border-[var(--color-primary)] group-active:[&:not(:checked)]:bg-[color-mix(in_srgb,var(--color-primary)_16%,white)] [&:not(:checked):hover]:border-[var(--color-primary)] [&:not(:checked):hover]:bg-[color-mix(in_srgb,var(--color-primary)_8%,white)] [&:not(:checked):active]:border-[var(--color-primary)] [&:not(:checked):active]:bg-[color-mix(in_srgb,var(--color-primary)_16%,white)] checked:group-hover:brightness-[0.92] checked:group-active:brightness-[0.85] checked:hover:brightness-[0.92] checked:active:brightness-[0.85]"
            style={{
              backgroundImage: hideIdentical
                ? MATRIX_CHECKBOX_CHECKMARK
                : undefined,
            }}
          />
          隐藏相同选项
        </label>
      </div>

      {COLUMN_IDS.map((columnId) => {
        const plan = planByColumn(columnId);
        const theme = VERSION_THEMES[plan.theme];

        return (
          <div
            key={columnId}
            className={cn(
              "flex min-h-[158px] flex-col items-center justify-center gap-3 bg-white p-6",
              stuck
                ? "border-r border-transparent last:border-r-0"
                : "border-r border-[var(--border-light)] last:border-r-0",
            )}
          >
            <div className="flex w-full flex-col items-center gap-1 text-center">
              <div className="flex items-center justify-center gap-2">
                <Image
                  src={theme.diamondIcon}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 shrink-0"
                  unoptimized
                />
                <p
                  className="text-2xl font-semibold leading-8"
                  style={{ color: theme.color }}
                >
                  {plan.title}
                </p>
              </div>
              <p className="text-sm leading-[22px] text-[var(--text-secondary)]">
                {plan.subtitle}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-10 min-h-10 items-center justify-center rounded-lg border border-[var(--border-light)] bg-white px-4 text-sm leading-[22px] text-[var(--text-base)] transition-colors hover:bg-[var(--btn-outline-hover)] active:bg-[var(--btn-outline-active)]"
              onClick={() => openTrialModal()}
            >
              立即试用
            </button>
          </div>
        );
      })}
    </div>
  );
}

function MatrixRow({ row }: { row: ComparisonFeatureRow }) {
  return (
    <div className="grid w-full grid-cols-4 border-b border-[var(--border-light)] bg-white last:border-b-0">
      <div className="flex h-full min-w-0 items-center gap-2 border-r border-[var(--border-light)] px-3 py-3 lg:px-6">
        <span
          className={cn(
            "min-w-0 break-words text-sm leading-[22px] text-[var(--text-base)] lg:break-normal",
            row.emphasis && "font-medium",
          )}
        >
          {row.label}
          {row.info ? (
            <>
              <span className="inline-block w-1 align-[-3px] lg:hidden" aria-hidden />
              {"\u200B"}
              <Image
                src={`${ASSET_BASE}/icon_info_circle.svg`}
                alt="说明"
                width={16}
                height={16}
                className="inline-block size-4 shrink-0 align-[-3px] lg:ml-0 lg:inline-block lg:align-middle"
                title={row.label}
              />
            </>
          ) : null}
        </span>
      </div>

      {COLUMN_IDS.map((columnId) => (
        <div
          key={columnId}
          className="flex h-full items-center justify-center border-r border-[var(--border-light)] px-3 py-3 last:border-r-0 lg:px-6"
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
        className={cn(
          "flex h-12 w-full items-center justify-between gap-2 bg-[var(--bg-shell)] py-3 pl-3 pr-4 text-left lg:h-auto lg:px-6 lg:py-4",
          expanded && "border-b border-[var(--border-light)]",
        )}
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
  const [hideIdentical, setHideIdentical] = useState(false);
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

      {/* Mobile / Pad 吸顶表头 */}
      <div
        className="relative sticky top-16 z-40 h-fit w-full overflow-visible lg:hidden"
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
          <MatrixHeaderMobile stuck={headerStuck} />
        </div>
      </div>

      {/* Web 吸顶表头 */}
      <div
        className={cn(
          "sticky z-40 hidden lg:block",
          headerStuck &&
            "ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] w-screen max-w-[100vw] bg-[var(--bg-white)]",
        )}
        style={{
          top: MATRIX_STICKY_TOP,
          boxShadow: headerStuck ? "var(--shadow-card)" : undefined,
        }}
      >
        <div className={cn(headerStuck && "mx-auto w-full max-w-[1200px]")}>
          <MatrixHeaderWeb
            hideIdentical={hideIdentical}
            onHideIdenticalChange={setHideIdentical}
            stuck={headerStuck}
          />
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
