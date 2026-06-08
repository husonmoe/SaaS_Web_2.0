"use client";

import {
  USER_MANUAL_CATEGORIES,
  type UserManualCategoryId,
  type UserManualTopicId,
} from "@/components/sections/user-manual/userManualContent";
import { UserManualTopicBar } from "@/components/sections/user-manual/UserManualTopicBar";
import { cn } from "@/lib/cn";
import {
  centerElementInScrollContainer,
  scrollToStickySentinel,
} from "@/lib/scrollCenter";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/** 与 SiteHeader 顶栏高度一致：移动端 h-16=64px，桌面端 72px */
const CATEGORY_STICKY_TOP_CLASS =
  "top-16 lg:top-[var(--hero-header-offset,72px)]";
/** 吸顶后内容向上累计滑动该距离才收起分类标签 */
const COLLAPSE_SCROLL_PX = 60;
/** 吸顶后内容向下累计滑动该距离才重新展开分类标签 */
const EXPAND_SCROLL_PX = 60;
/** 与 transition-all duration-300 对齐，动画期间忽略滚动判定 */
const COLLAPSE_ANIMATION_MS = 300;

function getHeaderOffsetPx(): number {
  const header = document.querySelector("header");
  return header?.offsetHeight ?? 72;
}

type UserManualCategoryBarProps = {
  activeCategoryId: UserManualCategoryId;
  onCategoryChange: (id: UserManualCategoryId) => void;
  activeTopicId: UserManualTopicId;
  onTopicChange: (id: UserManualTopicId) => void;
  scopeRef: RefObject<HTMLDivElement | null>;
};

/** 分类条 + 移动端目录条，同组吸顶；Figma node 407:180227 */
export function UserManualCategoryBar({
  activeCategoryId,
  onCategoryChange,
  activeTopicId,
  onTopicChange,
  scopeRef,
}: UserManualCategoryBarProps) {
  const stickySentinelRef = useRef<HTMLDivElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const categoryRowRef = useRef<HTMLDivElement>(null);
  const categoryTabRefs = useRef<
    Partial<Record<UserManualCategoryId, HTMLButtonElement | null>>
  >({});
  const topicBarWrapRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const directionAccumRef = useRef(0);
  const scrollTickingRef = useRef(false);
  const chipsCollapsedRef = useRef(false);
  const animatingRef = useRef(false);
  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [chipsStuck, setChipsStuck] = useState(false);
  const [chipsCollapsed, setChipsCollapsed] = useState(false);
  const [categoryRowHeight, setCategoryRowHeight] = useState(0);
  const [topicBarHeight, setTopicBarHeight] = useState(0);

  const stickyBarHeight =
    chipsStuck && categoryRowHeight > 0
      ? chipsCollapsed
        ? topicBarHeight
        : categoryRowHeight + topicBarHeight
      : 0;

  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    if (!sentinel) return;

    const createObserver = () => {
      const headerOffset = getHeaderOffsetPx();
      return new IntersectionObserver(
        ([entry]) => setChipsStuck(!entry.isIntersecting),
        {
          threshold: 0,
          rootMargin: `-${headerOffset}px 0px 0px 0px`,
        },
      );
    };

    let observer = createObserver();
    observer.observe(sentinel);

    const onResize = () => {
      observer.disconnect();
      observer = createObserver();
      observer.observe(sentinel);
    };

    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const row = categoryRowRef.current;
    const topicWrap = topicBarWrapRef.current;
    if (!row && !topicWrap) return;

    const syncHeights = () => {
      if (row) setCategoryRowHeight(row.offsetHeight);
      if (topicWrap) setTopicBarHeight(topicWrap.offsetHeight);
    };

    syncHeights();
    const observer = new ResizeObserver(syncHeights);
    if (row) observer.observe(row);
    if (topicWrap) observer.observe(topicWrap);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    chipsCollapsedRef.current = chipsCollapsed;
  }, [chipsCollapsed]);

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!chipsStuck) {
      setChipsCollapsed(false);
      chipsCollapsedRef.current = false;
      directionAccumRef.current = 0;
      animatingRef.current = false;
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
      return;
    }

    const resetScrollMonitor = () => {
      lastScrollYRef.current = window.scrollY;
      directionAccumRef.current = 0;
    };

    const setCollapsedSafely = (next: boolean) => {
      if (chipsCollapsedRef.current === next || animatingRef.current) return;

      animatingRef.current = true;
      setChipsCollapsed(next);
      chipsCollapsedRef.current = next;
      resetScrollMonitor();

      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
      animationTimerRef.current = setTimeout(() => {
        animatingRef.current = false;
        resetScrollMonitor();
      }, COLLAPSE_ANIMATION_MS);
    };

    resetScrollMonitor();

    const updateCollapseByDirection = () => {
      if (animatingRef.current) return;

      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;
      lastScrollYRef.current = currentY;

      if (delta === 0) return;

      const collapsed = chipsCollapsedRef.current;

      if (delta > 0) {
        if (collapsed) {
          directionAccumRef.current = 0;
          return;
        }
        if (directionAccumRef.current < 0) directionAccumRef.current = 0;
        directionAccumRef.current += delta;
        if (directionAccumRef.current >= COLLAPSE_SCROLL_PX) {
          setCollapsedSafely(true);
        }
        return;
      }

      if (!collapsed) {
        directionAccumRef.current = 0;
        return;
      }
      if (directionAccumRef.current > 0) directionAccumRef.current = 0;
      directionAccumRef.current += delta;
      if (directionAccumRef.current <= -EXPAND_SCROLL_PX) {
        setCollapsedSafely(false);
      }
    };

    const onScroll = () => {
      if (scrollTickingRef.current) return;
      scrollTickingRef.current = true;
      requestAnimationFrame(() => {
        updateCollapseByDirection();
        scrollTickingRef.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [chipsStuck]);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    if (!chipsStuck) {
      scope.style.removeProperty("--user-manual-category-sticky-height");
      scope.style.removeProperty("--user-manual-category-block-height");
      return;
    }

    scope.style.setProperty(
      "--user-manual-category-sticky-height",
      `${stickyBarHeight}px`,
    );
    scope.style.setProperty(
      "--user-manual-category-block-height",
      `${stickyBarHeight + 64}px`,
    );
  }, [scopeRef, chipsStuck, stickyBarHeight]);

  const shouldAnimateCollapse = chipsStuck;

  const resetCollapseState = useCallback(() => {
    setChipsCollapsed(false);
    chipsCollapsedRef.current = false;
    directionAccumRef.current = 0;
    animatingRef.current = false;
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
  }, []);

  const scrollToStickyAnchor = useCallback(() => {
    scrollToStickySentinel(
      stickySentinelRef.current,
      getHeaderOffsetPx(),
      "smooth",
    );
    resetCollapseState();
    lastScrollYRef.current = window.scrollY;
  }, [resetCollapseState]);

  const handleCategorySelect = useCallback(
    (categoryId: UserManualCategoryId) => {
      if (categoryId !== activeCategoryId) {
        onCategoryChange(categoryId);
      }
      requestAnimationFrame(() => {
        scrollToStickyAnchor();
      });
    },
    [activeCategoryId, onCategoryChange, scrollToStickyAnchor],
  );

  const handleTopicSelect = useCallback(
    (topicId: UserManualTopicId) => {
      if (topicId !== activeTopicId) {
        onTopicChange(topicId);
      }
      requestAnimationFrame(() => {
        scrollToStickyAnchor();
      });
    },
    [activeTopicId, onTopicChange, scrollToStickyAnchor],
  );

  useEffect(() => {
    centerElementInScrollContainer(
      categoryScrollRef.current,
      categoryTabRefs.current[activeCategoryId] ?? null,
    );
  }, [activeCategoryId, chipsCollapsed, chipsStuck]);

  return (
    <>
      <div
        ref={stickySentinelRef}
        className="pointer-events-none h-px w-full"
        aria-hidden
      />

      {/* fixed 吸顶时占位：用离散高度，避免动画中 ResizeObserver 引发滚动反馈 */}
      {chipsStuck && stickyBarHeight > 0 ? (
        <div
          className="w-full shrink-0 transition-[height] duration-300 ease-in-out"
          style={{ height: stickyBarHeight }}
          aria-hidden
        />
      ) : null}

      <div
        className={cn(
          "z-40",
          chipsStuck
            ? cn(
                "fixed left-0 right-0 bg-[var(--bg-white)]",
                CATEGORY_STICKY_TOP_CLASS,
              )
            : "relative bg-transparent",
        )}
        style={{
          boxShadow: chipsStuck ? "var(--shadow-card)" : undefined,
        }}
      >
        <div
          className={cn(
            "overflow-hidden",
            shouldAnimateCollapse &&
              "transition-[height] duration-300 ease-in-out",
          )}
          style={
            shouldAnimateCollapse && categoryRowHeight > 0
              ? { height: chipsCollapsed ? 0 : categoryRowHeight }
              : undefined
          }
          aria-hidden={chipsStuck && chipsCollapsed}
        >
          <div
            ref={categoryScrollRef}
            className={cn(
              "w-full overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              shouldAnimateCollapse &&
                "will-change-transform transition-transform duration-300 ease-in-out",
              shouldAnimateCollapse &&
                !isDesktop &&
                (chipsCollapsed ? "-translate-y-full" : "translate-y-0"),
            )}
          >
            <div
              ref={categoryRowRef}
              className={cn(
                "flex w-full flex-nowrap items-center justify-start gap-3",
                "px-6 pb-3 pt-3",
                "lg:mx-auto lg:max-w-[1200px] lg:justify-start lg:px-6",
                chipsStuck && chipsCollapsed && "pointer-events-none",
              )}
              role="tablist"
              aria-label="手册分类"
            >
              {USER_MANUAL_CATEGORIES.map((category) => {
                const active = category.id === activeCategoryId;
                return (
                  <button
                    key={category.id}
                    ref={(node) => {
                      categoryTabRefs.current[category.id] = node;
                    }}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    tabIndex={chipsStuck && chipsCollapsed ? -1 : undefined}
                    onClick={() => handleCategorySelect(category.id)}
                    className={cn(
                      "inline-flex h-fit w-fit shrink-0 whitespace-nowrap items-center justify-center rounded-lg px-4 py-2.5 text-sm leading-[22px] transition-colors",
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
        </div>

        <div ref={topicBarWrapRef}>
          <UserManualTopicBar
            activeCategoryId={activeCategoryId}
            activeTopicId={activeTopicId}
            onTopicChange={handleTopicSelect}
          />
        </div>
      </div>
    </>
  );
}
