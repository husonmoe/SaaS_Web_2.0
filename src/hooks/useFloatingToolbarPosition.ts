"use client";

import { useEffect, useRef, useState } from "react";
import {
  ACTION_CTA_SECTION_ID,
  SITE_FOOTER_ID,
} from "@/lib/floating-toolbar-anchor";

/** 设计稿：右边距 / 下边距 */
export const FLOATING_TOOLBAR_MARGIN_RIGHT = 12;
export const FLOATING_TOOLBAR_MARGIN_BOTTOM = 60;
/** 滚动超过该距离后显示置顶按钮 */
export const FLOATING_TOOLBAR_SCROLL_THRESHOLD = 300;
/** 单坑位高度（按钮 48px + 坑位间距 12px）；最后一坑无下间距，总高 168px */
export const FLOATING_TOOLBAR_BUTTON_SIZE = 48;
export const FLOATING_TOOLBAR_SLOT_GAP = 12;
export const FLOATING_TOOLBAR_TOTAL_HEIGHT =
  FLOATING_TOOLBAR_BUTTON_SIZE * 3 +
  FLOATING_TOOLBAR_SLOT_GAP * 2;
/** fixed ↔ absolute 切换迟滞，避免页脚边界来回抖动 */
export const FLOATING_TOOLBAR_PIN_HYSTERESIS = 16;

export type FloatingToolbarPositionMode = "fixed" | "absolute";

export type FloatingToolbarCoords = {
  right: number;
  bottom?: number;
  top?: number;
};

function getBoundaryElement(): HTMLElement | null {
  return (
    document.getElementById(ACTION_CTA_SECTION_ID) ??
    document.getElementById(SITE_FOOTER_ID)
  );
}

function coordsEqual(
  a: FloatingToolbarCoords,
  b: FloatingToolbarCoords,
): boolean {
  return (
    a.right === b.right && a.bottom === b.bottom && a.top === b.top
  );
}

export function useFloatingToolbarPosition() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mode, setMode] = useState<FloatingToolbarPositionMode>("fixed");
  const [coords, setCoords] = useState<FloatingToolbarCoords>({
    right: FLOATING_TOOLBAR_MARGIN_RIGHT,
    bottom: FLOATING_TOOLBAR_MARGIN_BOTTOM,
  });
  const modeRef = useRef<FloatingToolbarPositionMode>("fixed");
  const showBackToTopRef = useRef(false);
  const coordsRef = useRef(coords);

  useEffect(() => {
    let rafId = 0;
    let observer: IntersectionObserver | null = null;
    let observedBoundary: HTMLElement | null = null;

    const bindBoundaryObserver = (boundary: HTMLElement) => {
      if (observedBoundary === boundary) return;
      observer?.disconnect();
      observer = new IntersectionObserver(
        () => {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(update);
        },
        { root: null, threshold: 0 },
      );
      observer.observe(boundary);
      observedBoundary = boundary;
    };

    const update = () => {
      const scrollY = window.scrollY;
      const nextShowBackToTop = scrollY > FLOATING_TOOLBAR_SCROLL_THRESHOLD;
      if (nextShowBackToTop !== showBackToTopRef.current) {
        showBackToTopRef.current = nextShowBackToTop;
        setShowBackToTop(nextShowBackToTop);
      }

      const boundary = getBoundaryElement();
      if (boundary) {
        bindBoundaryObserver(boundary);
      }

      if (!boundary) {
        const nextCoords = {
          right: FLOATING_TOOLBAR_MARGIN_RIGHT,
          bottom: FLOATING_TOOLBAR_MARGIN_BOTTOM,
        };
        if (modeRef.current !== "fixed") {
          modeRef.current = "fixed";
          setMode("fixed");
        }
        if (!coordsEqual(coordsRef.current, nextCoords)) {
          coordsRef.current = nextCoords;
          setCoords(nextCoords);
        }
        return;
      }

      const boundaryRect = boundary.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const bottomMargin = FLOATING_TOOLBAR_MARGIN_BOTTOM;
      const toolbarHeight = FLOATING_TOOLBAR_TOTAL_HEIGHT;

      const fixedBottomEdge = viewportHeight - bottomMargin;
      const pinnedBottomEdge = boundaryRect.top - bottomMargin;
      const hysteresis = FLOATING_TOOLBAR_PIN_HYSTERESIS;
      const maxScrollY = Math.max(
        0,
        document.documentElement.scrollHeight - viewportHeight,
      );
      const nearPageBottom = scrollY >= maxScrollY - hysteresis * 4;

      let nextMode = modeRef.current;
      if (nearPageBottom && modeRef.current === "absolute") {
        nextMode = "absolute";
      } else if (modeRef.current === "fixed") {
        if (pinnedBottomEdge < fixedBottomEdge - hysteresis) {
          nextMode = "absolute";
        }
      } else if (pinnedBottomEdge >= fixedBottomEdge + hysteresis) {
        nextMode = "fixed";
      }

      if (nextMode !== modeRef.current) {
        modeRef.current = nextMode;
        setMode(nextMode);
      }

      const nextCoords: FloatingToolbarCoords =
        nextMode === "fixed"
          ? {
              right: FLOATING_TOOLBAR_MARGIN_RIGHT,
              bottom: bottomMargin,
            }
          : {
              right: FLOATING_TOOLBAR_MARGIN_RIGHT,
              top: Math.round(
                scrollY + pinnedBottomEdge - toolbarHeight,
              ),
            };

      if (!coordsEqual(coordsRef.current, nextCoords)) {
        coordsRef.current = nextCoords;
        setCoords(nextCoords);
      }
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    scheduleUpdate();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      observer?.disconnect();
    };
  }, []);

  return { showBackToTop, mode, coords };
}
