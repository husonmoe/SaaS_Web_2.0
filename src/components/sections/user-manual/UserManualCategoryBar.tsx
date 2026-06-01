"use client";

import {
  USER_MANUAL_CATEGORIES,
  type UserManualCategoryId,
} from "@/components/sections/user-manual/userManualContent";
import { cn } from "@/lib/cn";
import { useEffect, useRef, useState, type RefObject } from "react";

/** 与 SiteHeader 顶栏高度一致 */
const CATEGORY_STICKY_TOP = "var(--hero-header-offset, 72px)";
const CATEGORY_STICKY_TOP_PX = 72;

type UserManualCategoryBarProps = {
  activeCategoryId: UserManualCategoryId;
  onCategoryChange: (id: UserManualCategoryId) => void;
  scopeRef: RefObject<HTMLDivElement | null>;
};

export function UserManualCategoryBar({
  activeCategoryId,
  onCategoryChange,
  scopeRef,
}: UserManualCategoryBarProps) {
  const stickySentinelRef = useRef<HTMLDivElement>(null);
  const barMeasureRef = useRef<HTMLDivElement>(null);
  const [chipsStuck, setChipsStuck] = useState(false);
  const [barHeight, setBarHeight] = useState(88);

  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setChipsStuck(!entry.isIntersecting),
      {
        threshold: 0,
        rootMargin: `-${CATEGORY_STICKY_TOP_PX}px 0px 0px 0px`,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const bar = barMeasureRef.current;
    const scope = scopeRef.current;
    if (!bar || !scope) return;

    const syncHeight = () => {
      const height = bar.offsetHeight;
      setBarHeight(height);
      scope.style.setProperty(
        "--user-manual-category-sticky-height",
        `${height}px`,
      );
      scope.style.setProperty(
        "--user-manual-category-block-height",
        `${height + 64}px`,
      );
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(bar);
    return () => observer.disconnect();
  }, [scopeRef, chipsStuck]);

  return (
    <>
      <div
        ref={stickySentinelRef}
        className="pointer-events-none h-px w-full"
        aria-hidden
      />

      {/* fixed 吸顶时占位，避免正文跳动 */}
      {chipsStuck ? (
        <div
          className="w-full shrink-0"
          style={{ height: barHeight }}
          aria-hidden
        />
      ) : null}

      <div
        ref={barMeasureRef}
        className={cn(
          "z-40",
          chipsStuck
            ? "fixed left-0 right-0 bg-[var(--bg-white)]"
            : "relative bg-transparent",
        )}
        style={{
          top: chipsStuck ? CATEGORY_STICKY_TOP : undefined,
          boxShadow: chipsStuck ? "var(--shadow-card)" : undefined,
        }}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-center gap-3 px-[var(--page-margin-x)] py-6 lg:px-6",
          )}
          role="tablist"
          aria-label="手册分类"
        >
          {USER_MANUAL_CATEGORIES.map((category) => {
            const active = category.id === activeCategoryId;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-4 py-2.5 text-sm leading-[22px] transition-colors",
                  active
                    ? "bg-gradient-to-r from-[var(--color-primary-end)] to-[var(--color-primary)] text-white"
                    : "bg-[var(--bg-shell)] text-[var(--text-base)] hover:bg-[var(--user-manual-chip-hover)]",
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
