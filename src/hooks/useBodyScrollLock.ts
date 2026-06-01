"use client";

import { useEffect } from "react";

const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);

/** 关闭弹窗时立即恢复滚动，避免继承 html 的 smooth 产生滑动动画 */
function restoreScrollPosition(scrollY: number) {
  const { body, documentElement: html } = document;
  const prevHtmlScrollBehavior = html.style.scrollBehavior;

  html.style.scrollBehavior = "auto";
  html.scrollTop = scrollY;
  body.scrollTop = scrollY;
  window.scrollTo({ top: scrollY, left: 0, behavior: "instant" });
  html.style.scrollBehavior = prevHtmlScrollBehavior;
}

function getScrollableAncestor(node: Element | null): Element | null {
  let el = node;
  while (el && el !== document.documentElement) {
    const { overflowY } = getComputedStyle(el);
    if (
      (overflowY === "auto" ||
        overflowY === "scroll" ||
        overflowY === "overlay") &&
      el.scrollHeight > el.clientHeight
    ) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

function isInsideModal(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest('[role="dialog"][aria-modal="true"]') !== null
  );
}

function canScrollWithin(el: Element, deltaY: number): boolean {
  const { scrollTop, scrollHeight, clientHeight } = el;
  const atTop = scrollTop <= 0;
  const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
  if (deltaY < 0 && !atTop) return true;
  if (deltaY > 0 && !atBottom) return true;
  return false;
}

function shouldBlockWheel(event: WheelEvent): boolean {
  if (!isInsideModal(event.target)) return true;

  const scrollable = getScrollableAncestor(event.target as Element);
  if (!scrollable) return true;

  return !canScrollWithin(scrollable, event.deltaY);
}

function shouldBlockTouchMove(event: TouchEvent): boolean {
  if (!isInsideModal(event.target)) return true;

  return getScrollableAncestor(event.target as Element) === null;
}

/**
 * 弹窗打开时锁定背景滚动：保留滚动条占位，避免页面宽度跳动；
 * 关闭后瞬间恢复滚动位置（兼容 iOS Safari）。
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const { body, documentElement: html } = document;
    const scrollY = window.scrollY;

    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyWidth = body.style.width;
    const prevBodyTouchAction = body.style.touchAction;
    const prevHtmlOverscrollBehavior = html.style.overscrollBehavior;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.touchAction = "none";
    html.style.overscrollBehavior = "none";

    const onWheel = (event: WheelEvent) => {
      if (shouldBlockWheel(event)) event.preventDefault();
    };

    const onTouchMove = (event: TouchEvent) => {
      if (shouldBlockTouchMove(event)) event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(event.key)) return;
      if (isInsideModal(event.target)) return;
      event.preventDefault();
    };

    const onScroll = () => {
      if (window.scrollY !== scrollY) {
        restoreScrollPosition(scrollY);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);

      const lockedTop = body.style.top;
      const y =
        lockedTop !== ""
          ? Math.max(0, -Number.parseInt(lockedTop, 10) || scrollY)
          : scrollY;

      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.width = prevBodyWidth;
      body.style.touchAction = prevBodyTouchAction;
      html.style.overscrollBehavior = prevHtmlOverscrollBehavior;

      restoreScrollPosition(y);
    };
  }, [locked]);
}
