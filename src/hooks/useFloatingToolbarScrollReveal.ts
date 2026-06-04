"use client";

import { useEffect, useRef, useState } from "react";

/** 停止滚动后多久恢复显示（ms） */
export const FLOATING_TOOLBAR_SCROLL_END_MS = 200;

/**
 * 滚动时向右滑出隐藏，停止滚动（防抖）后滑回。
 * 仅在 revealed 状态变化时 setState，避免滚动过程中重复渲染。
 */
export function useFloatingToolbarScrollReveal(
  scrollEndMs = FLOATING_TOOLBAR_SCROLL_END_MS,
) {
  const [revealed, setRevealed] = useState(true);
  const revealedRef = useRef(true);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const setRevealedIfChanged = (next: boolean) => {
      if (revealedRef.current === next) return;
      revealedRef.current = next;
      setRevealed(next);
    };

    const onScroll = () => {
      setRevealedIfChanged(false);

      if (scrollEndTimerRef.current !== null) {
        clearTimeout(scrollEndTimerRef.current);
      }

      scrollEndTimerRef.current = setTimeout(() => {
        scrollEndTimerRef.current = null;
        setRevealedIfChanged(true);
      }, scrollEndMs);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollEndTimerRef.current !== null) {
        clearTimeout(scrollEndTimerRef.current);
      }
    };
  }, [scrollEndMs]);

  return revealed;
}
