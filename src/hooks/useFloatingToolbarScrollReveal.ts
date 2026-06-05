"use client";

import { useEffect, useRef, useState } from "react";

/** 停止滚动后多久恢复显示（ms） */
export const FLOATING_TOOLBAR_SCROLL_END_MS = 200;
/** 低于该位移视为无实际滚动（橡皮筋回弹等），不触发隐藏 */
export const FLOATING_TOOLBAR_SCROLL_DELTA_MIN = 1;

/**
 * 滚动时向右滑出隐藏，停止滚动（防抖）后滑回。
 * 仅在 scrollY 实际变化时隐藏，忽略底部橡皮筋回弹等零位移事件，避免重复滑入滑出。
 * 仅在 revealed 状态变化时 setState，避免滚动过程中重复渲染。
 */
export function useFloatingToolbarScrollReveal(
  scrollEndMs = FLOATING_TOOLBAR_SCROLL_END_MS,
) {
  const [revealed, setRevealed] = useState(true);
  const revealedRef = useRef(true);
  const lastScrollYRef = useRef(0);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const clearRevealTimer = () => {
      if (scrollEndTimerRef.current !== null) {
        clearTimeout(scrollEndTimerRef.current);
        scrollEndTimerRef.current = null;
      }
    };

    const setRevealedIfChanged = (next: boolean) => {
      if (revealedRef.current === next) return;
      revealedRef.current = next;
      setRevealed(next);
    };

    const onScroll = () => {
      const scrollY = window.scrollY;
      const delta = Math.abs(scrollY - lastScrollYRef.current);

      if (delta < FLOATING_TOOLBAR_SCROLL_DELTA_MIN) {
        return;
      }

      lastScrollYRef.current = scrollY;
      setRevealedIfChanged(false);
      clearRevealTimer();

      scrollEndTimerRef.current = setTimeout(() => {
        scrollEndTimerRef.current = null;
        setRevealedIfChanged(true);
      }, scrollEndMs);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearRevealTimer();
    };
  }, [scrollEndMs]);

  return revealed;
}
