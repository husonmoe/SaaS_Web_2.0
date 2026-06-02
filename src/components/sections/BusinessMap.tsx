"use client";

import { cn } from "@/lib/cn";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const MAP_SVG_SRC = "/assets/mapgroup2.svg";
const SHOULD_NORMALIZE_LAND_GRADIENTS = MAP_SVG_SRC !== "/assets/mapgroup2.svg";
const ENABLE_WATER_OVERLAY = true;
const MASK_WATER_INSET_FOR_MAPGROUP2 = MAP_SVG_SRC === "/assets/mapgroup2.svg";

/**
 * 水域渲染模式
 * - borders：描边叠在地图之上，避免大面积 fill 把陆地洗灰（推荐）
 * - legacy：原始 fill 叠层，位于地图下方；回退时改此常量并执行 scripts/restore-water-asset.sh
 */
type WaterRenderMode = "borders" | "legacy";
/** 回退 legacy 时改为 `"legacy" as WaterRenderMode` */
const WATER_RENDER_MODE = "borders" as WaterRenderMode;
const WATER_SVG_SRC =
  WATER_RENDER_MODE === "legacy"
    ? "/assets/water.svg.original"
    : "/assets/water2.svg";
/** 每组内元素数量 */
const COLUMN_GROUP_SIZE = 3;
const DOT_GROUP_SIZE = 4;
/** 组与组之间的间隔（与 mapPanelTiming.MAP_EFFECT_MAX_STAGGER_MS 配合） */
const GROUP_STAGGER_MS = 60;
/** 同组内相邻元素的微错开 */
const IN_GROUP_STEP_MS = 22;

function configureMapSvg(root: HTMLElement) {
  root.querySelectorAll("svg").forEach((svg) => {
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  });
}

/** 相对素材默认水域 fill-opacity 的缩放（0.5 为历史减半，×0.7 为再降 30%） */
const WATER_FILL_OPACITY_SCALE = 0.35;

function prepareWaterSvg(root: HTMLElement, mode: WaterRenderMode) {
  root.querySelectorAll<SVGElement>("g[opacity]").forEach((group) => {
    group.removeAttribute("opacity");
  });

  if (mode !== "borders") return;

  root.querySelectorAll<SVGPathElement>("path").forEach((path) => {
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "0.65");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-linecap", "round");
    path.removeAttribute("fill-rule");
    path.removeAttribute("clip-rule");
  });
}

/** 陆地渐变 stop-opacity / fill-opacity 修正；仅陆地底色应用竖向双色渐变 */
function solidifyLandGradients(root: HTMLElement) {
  const landGradientTop = "#9AC3E9";
  const landGradientBottom = "#C6DDF4";
  const svg = root.querySelector("svg");
  const viewBox = svg?.viewBox.baseVal;
  const mapWidth = viewBox?.width || 725;
  const mapHeight = viewBox?.height || 521;

  root
    .querySelectorAll<SVGLinearGradientElement>(
      'linearGradient[id^="paint"][id*="_linear"]',
    )
    .forEach((gradient) => {
      const id = gradient.getAttribute("id") ?? "";
      if (!/^paint[024]_linear/.test(id)) return;

      gradient.setAttribute("x1", String(mapWidth / 2));
      gradient.setAttribute("y1", "0");
      gradient.setAttribute("x2", String(mapWidth / 2));
      gradient.setAttribute("y2", String(mapHeight));
      gradient.setAttribute("gradientUnits", "userSpaceOnUse");

      const stops = gradient.querySelectorAll("stop");
      if (stops.length === 0) return;

      stops[0].setAttribute("stop-color", landGradientTop);
      stops[stops.length - 1].setAttribute("stop-color", landGradientBottom);
    });

  root.querySelectorAll<SVGStopElement>(
    'linearGradient[id^="paint"] stop[stop-opacity]',
  ).forEach((stop) => {
    const gradient = stop.closest("linearGradient");
    const id = gradient?.getAttribute("id") ?? "";
    if (/^paint[0-5]_linear/.test(id)) {
      stop.setAttribute("stop-opacity", "1");
    }
  });

  root.querySelectorAll<SVGElement>("#land, #land path").forEach((el) => {
    el.style.opacity = "1";
  });

  root.querySelectorAll<SVGPathElement>("#land path[fill-opacity]").forEach(
    (path) => {
      const raw = parseFloat(path.getAttribute("fill-opacity") ?? "1");
      if (!Number.isNaN(raw)) {
        path.setAttribute("fill-opacity", String(raw * WATER_FILL_OPACITY_SCALE));
      }
    },
  );
}

/** 按索引生成稳定伪随机数（0–1），避免每次 apply 时参数跳动 */
function seededUnit(seed: number) {
  let t = (seed ^ 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function lerp(min: number, max: number, t: number) {
  return min + (max - min) * t;
}

/** 光点错峰：保留分组波浪感，叠加 per-dot 抖动与相位差 */
function dotAnimationTiming(index: number, total: number) {
  const wave = seededUnit(index * 7919 + 13);
  const jitter = seededUnit(index * 4177 + 29);
  const rhythm = seededUnit(index * 2341 + 7);

  const groupIndex = Math.floor(index / DOT_GROUP_SIZE);
  const indexInGroup = index % DOT_GROUP_SIZE;
  const baseDelay =
    groupIndex * GROUP_STAGGER_MS +
    indexInGroup * IN_GROUP_STEP_MS +
    (index / Math.max(total, 1)) * 120;

  const fadeDelay = Math.round(baseDelay + jitter * 180 + wave * 60);
  const rippleDuration = Math.round(lerp(2200, 3000, rhythm));
  const rippleScale = lerp(1.9, 2.35, seededUnit(index * 4567 + 41)).toFixed(2);
  const rippleDelayOffset = Math.round(lerp(80, 560, seededUnit(index * 891 + 17)));
  const ripplePhase = Math.round(
    seededUnit(index * 3333 + 59) * rippleDuration,
  );
  const pulseDuration = Math.round(lerp(2400, 4200, seededUnit(index * 6121 + 23)));
  const pulseDelay = Math.round(
    fadeDelay + lerp(200, 900, seededUnit(index * 9871 + 31)),
  );

  return {
    fadeDelay,
    rippleDuration,
    rippleScale,
    rippleDelay: fadeDelay + rippleDelayOffset - ripplePhase,
    pulseDuration,
    pulseDelay,
  };
}

/** 光柱错峰：分组波浪 + 抖动，入场后持续亮度呼吸 */
function columnAnimationTiming(index: number, total: number) {
  const jitter = seededUnit(index * 5531 + 11);
  const rhythm = seededUnit(index * 8821 + 37);

  const groupIndex = Math.floor(index / COLUMN_GROUP_SIZE);
  const indexInGroup = index % COLUMN_GROUP_SIZE;
  const baseDelay =
    groupIndex * GROUP_STAGGER_MS +
    indexInGroup * IN_GROUP_STEP_MS +
    (index / Math.max(total, 1)) * 100;

  const fadeDelay = Math.round(baseDelay + jitter * 120);
  const pulseDuration = Math.round(lerp(2200, 3800, rhythm));
  const pulseDelay = Math.round(
    fadeDelay + lerp(160, 680, seededUnit(index * 7123 + 19)),
  );
  const glowPeak = lerp(2.35, 3.05, seededUnit(index * 9347 + 43)).toFixed(2);

  return { fadeDelay, pulseDuration, pulseDelay, glowPeak };
}

function idMatchesKey(id: string, key: string) {
  const gl = id.toLowerCase();
  const kl = key.toLowerCase();
  if (gl === kl) return true;
  if (gl.endsWith(`-${kl}`) || gl.endsWith(`_${kl}`)) return true;
  if (gl.startsWith(`${kl}-`) || gl.startsWith(`${kl}_`)) return true;
  return false;
}

function findLayer(root: ParentNode, keys: string[]) {
  const svg = root.querySelector("svg");
  if (!svg) return null;

  const elements = svg.querySelectorAll("[id]");
  for (const key of keys) {
    for (const el of Array.from(elements)) {
      const id = el.getAttribute("id");
      if (id && idMatchesKey(id, key)) return el;
    }
  }
  return null;
}

function isInSouthChinaInset(el: SVGGraphicsElement) {
  try {
    const box = el.getBBox();
    // mapgroup2.svg 右下角南海诸岛框大致位于该区域，排除其光效处理
    return box.x >= 580 && box.y >= 300;
  } catch {
    return false;
  }
}

function isWaterInsetElement(el: SVGGraphicsElement) {
  try {
    const box = el.getBBox();
    // 仅剔除右下角南海诸岛框内的小元素，避免误伤主体水域轮廓
    return (
      box.x >= 560 &&
      box.y >= 280 &&
      box.width > 0 &&
      box.height > 0 &&
      box.width <= 220 &&
      box.height <= 220
    );
  } catch {
    return false;
  }
}

function maskSouthChinaInsetInWater(root: HTMLElement) {
  root
    .querySelectorAll<SVGGraphicsElement>(
      "svg path, svg circle, svg ellipse, svg polygon, svg polyline, svg line",
    )
    .forEach((el) => {
      if (!isWaterInsetElement(el)) return;
      el.remove();
    });
}

function prepareMapSvg(root: HTMLElement) {
  const columnsGroup = findLayer(root, ["light-columns", "light_columns"]);
  if (!columnsGroup) {
    const svg = root.querySelector("svg");
    if (!svg) return;

    svg
      .querySelectorAll<SVGPathElement>("path[fill^='url(#paint']")
      .forEach((path) => {
        const fill = path.getAttribute("fill") ?? "";
        if (/url\(#paint[0-5]_linear/i.test(fill)) return;
        if (isInSouthChinaInset(path)) return;
        path.classList.add("map-column-fallback");
      });

    svg
      .querySelectorAll<SVGCircleElement>("circle[r='2.52925'], circle[r='1.55009']")
      .forEach((circle) => {
        if (circle.closest("defs")) return;
        if (circle.closest("g[filter]")) return;
        if (isInSouthChinaInset(circle)) return;
        const cx = parseFloat(circle.getAttribute("cx") || "0");
        const cy = parseFloat(circle.getAttribute("cy") || "0");
        const r = circle.getAttribute("r") || "3";

        const anim = document.createElementNS("http://www.w3.org/2000/svg", "g");
        anim.setAttribute("class", "map-dot-anim map-dot-anim-fallback");
        const node = document.createElementNS("http://www.w3.org/2000/svg", "g");
        node.setAttribute("class", "map-dot-node");
        node.setAttribute("transform", `translate(${cx},${cy})`);
        const inner = document.createElementNS("http://www.w3.org/2000/svg", "g");
        inner.setAttribute("transform", `translate(${-cx},${-cy})`);

        const ripple = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ripple.setAttribute("class", "map-dot-ripple");
        ripple.setAttribute("cx", String(cx));
        ripple.setAttribute("cy", String(cy));
        ripple.setAttribute("r", r);
        ripple.setAttribute("fill", "none");
        ripple.setAttribute("stroke", "white");
        ripple.setAttribute("stroke-width", "0.5");
        ripple.setAttribute("opacity", "0");

        circle.parentNode?.insertBefore(anim, circle);
        anim.appendChild(node);
        node.appendChild(inner);
        inner.appendChild(circle);
        inner.appendChild(ripple);
      });

    return;
  }

  columnsGroup.querySelectorAll(":scope > path").forEach((path) => {
    if (path.parentElement?.classList.contains("map-column-item")) return;

    const wrap = document.createElementNS("http://www.w3.org/2000/svg", "g");
    wrap.setAttribute("class", "map-column-item");
    path.parentNode?.insertBefore(wrap, path);
    wrap.appendChild(path);
  });

  const dotsGroup = findLayer(root, ["light-dots", "light_dots"]);
  if (!dotsGroup) return;

  dotsGroup.querySelectorAll(":scope > .map-dot-node").forEach((dotNode) => {
    if (dotNode.parentElement?.classList.contains("map-dot-anim")) return;

    const anim = document.createElementNS("http://www.w3.org/2000/svg", "g");
    anim.setAttribute("class", "map-dot-anim");
    dotNode.parentNode?.insertBefore(anim, dotNode);
    anim.appendChild(dotNode);
  });

  const hasStructuredDots =
    dotsGroup.querySelector(":scope > .map-dot-node") !== null;
  if (hasStructuredDots) return;

  dotsGroup.querySelectorAll(":scope > circle").forEach((circle) => {
    const cx = parseFloat(circle.getAttribute("cx") || "0");
    const cy = parseFloat(circle.getAttribute("cy") || "0");
    const r = circle.getAttribute("r") || "3";

    const anim = document.createElementNS("http://www.w3.org/2000/svg", "g");
    anim.setAttribute("class", "map-dot-anim");
    const node = document.createElementNS("http://www.w3.org/2000/svg", "g");
    node.setAttribute("class", "map-dot-node");
    node.setAttribute("transform", `translate(${cx},${cy})`);

    const inner = document.createElementNS("http://www.w3.org/2000/svg", "g");
    inner.setAttribute("transform", `translate(${-cx},${-cy})`);

    const ripple = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ripple.setAttribute("class", "map-dot-ripple");
    ripple.setAttribute("cx", String(cx));
    ripple.setAttribute("cy", String(cy));
    ripple.setAttribute("r", r);
    ripple.setAttribute("fill", "none");
    ripple.setAttribute("stroke", "white");
    ripple.setAttribute("stroke-width", "0.5");
    ripple.setAttribute("opacity", "0");

    circle.parentNode?.insertBefore(anim, circle);
    anim.appendChild(node);
    node.appendChild(inner);
    inner.appendChild(circle);
    inner.appendChild(ripple);
  });
}

function applyColumnVisuals(root: HTMLElement, animate: boolean) {
  const columns = root.querySelectorAll<SVGElement>(
    "#light-columns > .map-column-item, #light-columns > g:not(.map-column-item), [id*='light-columns' i] > .map-column-item, [id*='light-columns' i] > g:not(.map-column-item), .map-column-fallback",
  );

  columns.forEach((el, index) => {
    const seed = index * 1597334677 + 974107;
    const itemOpacity = lerp(0.78, 1, seededUnit(seed)).toFixed(2);
    const timing = columnAnimationTiming(index, columns.length);

    el.style.setProperty("--map-item-opacity", itemOpacity);
    el.style.setProperty("--map-column-glow-peak", timing.glowPeak);

    if (!animate) return;

    el.style.setProperty("--map-column-fade-delay", `${timing.fadeDelay}ms`);
    el.style.setProperty(
      "--map-column-pulse-duration",
      `${timing.pulseDuration}ms`,
    );
    el.style.setProperty(
      "--map-column-pulse-delay",
      `${timing.pulseDelay}ms`,
    );
  });
}

function applyDotVisuals(root: HTMLElement, animate: boolean) {
  const dotAnims = root.querySelectorAll<SVGElement>(
    "#light-dots > .map-dot-anim, [id*='light-dots' i] > .map-dot-anim, .map-dot-anim-fallback",
  );
  const fallbackDots = root.querySelectorAll<SVGCircleElement>(".map-dot-fallback");
  const totalDots = dotAnims.length + fallbackDots.length;

  dotAnims.forEach((el, index) => {
    const seed = index * 2654435761 + 1013904223;
    const itemOpacity = lerp(0.72, 1, seededUnit(seed)).toFixed(2);
    const dotOpacity = lerp(0.82, 1, seededUnit(seed + 17)).toFixed(2);
    const timing = dotAnimationTiming(index, totalDots);

    el.style.setProperty("--map-item-opacity", itemOpacity);
    el.style.setProperty("--map-dot-base-opacity", dotOpacity);

    el.querySelectorAll<SVGCircleElement>(
      ".map-dot-node circle:not(.map-dot-ripple)",
    ).forEach((circle) => {
      circle.style.opacity = dotOpacity;
    });

    if (!animate) return;

    el.style.setProperty("--map-dot-fade-delay", `${timing.fadeDelay}ms`);
    el.style.setProperty("--map-dot-pulse-duration", `${timing.pulseDuration}ms`);
    el.style.setProperty("--map-dot-pulse-delay", `${timing.pulseDelay}ms`);

    const ripple = el.querySelector<SVGCircleElement>(".map-dot-ripple");
    if (ripple) {
      ripple.style.setProperty(
        "--map-ripple-opacity",
        lerp(0.55, 0.75, seededUnit(seed + 53)).toFixed(2),
      );
      ripple.style.setProperty(
        "--map-ripple-duration",
        `${timing.rippleDuration}ms`,
      );
      ripple.style.setProperty(
        "--map-ripple-scale",
        timing.rippleScale,
      );
      ripple.style.setProperty(
        "--map-ripple-delay",
        `${timing.rippleDelay}ms`,
      );
    }
  });

  fallbackDots.forEach((circle, index) => {
    const seededIndex = dotAnims.length + index;
    const seed = seededIndex * 2654435761 + 1013904223;
    const itemOpacity = lerp(0.72, 1, seededUnit(seed)).toFixed(2);
    const timing = dotAnimationTiming(seededIndex, totalDots);
    const cx = circle.getAttribute("cx") ?? "0";
    const cy = circle.getAttribute("cy") ?? "0";
    const r = circle.getAttribute("r") ?? "2.52925";

    circle.style.setProperty("--map-item-opacity", itemOpacity);
    circle.style.setProperty(
      "--map-dot-base-opacity",
      lerp(0.82, 1, seededUnit(seed + 17)).toFixed(2),
    );

    if (!animate) return;
    circle.style.setProperty("--map-dot-fade-delay", `${timing.fadeDelay}ms`);
    circle.style.setProperty("--map-dot-pulse-duration", `${timing.pulseDuration}ms`);
    circle.style.setProperty("--map-dot-pulse-delay", `${timing.pulseDelay}ms`);

    const parent = circle.parentElement;
    if (!parent) return;
    let ripple = parent.querySelector<SVGCircleElement>(".map-dot-ripple-fallback");
    if (!ripple) {
      ripple = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      ripple.setAttribute("class", "map-dot-ripple-fallback");
      ripple.setAttribute("fill", "none");
      ripple.setAttribute("stroke", "white");
      ripple.setAttribute("stroke-width", "0.5");
      parent.appendChild(ripple);
    }

    ripple.setAttribute("cx", cx);
    ripple.setAttribute("cy", cy);
    ripple.setAttribute("r", r);
    ripple.style.setProperty(
      "--map-ripple-opacity",
      lerp(0.55, 0.75, seededUnit(seed + 53)).toFixed(2),
    );
    ripple.style.setProperty("--map-ripple-duration", `${timing.rippleDuration}ms`);
    ripple.style.setProperty("--map-ripple-scale", timing.rippleScale);
    ripple.style.setProperty("--map-ripple-delay", `${timing.rippleDelay}ms`);
  });
}

function restartDotAnimations(root: HTMLElement) {
  root
    .querySelectorAll<SVGElement>(
      ".map-dot-anim, .map-dot-ripple, .map-dot-fallback, .map-dot-ripple-fallback",
    )
    .forEach((el) => {
      el.style.animation = "none";
      void el.getBoundingClientRect();
      el.style.removeProperty("animation");
    });
}

function restartColumnAnimations(root: HTMLElement) {
  root
    .querySelectorAll<SVGElement>(
      [
        "#light-columns > .map-column-item",
        "#light-columns > g:not(.map-column-item)",
        "[id*='light-columns' i] > .map-column-item",
        "[id*='light-columns' i] > g:not(.map-column-item)",
        ".map-column-fallback",
      ].join(","),
    )
    .forEach((el) => {
      el.style.animation = "none";
      void el.getBoundingClientRect();
      el.style.removeProperty("animation");
    });
}

function restartWaterAnimation(root: HTMLElement) {
  const layer = root.querySelector<HTMLElement>(".business-map-water");
  if (!layer) return;
  layer.style.animation = "none";
  void layer.getBoundingClientRect();
  layer.style.removeProperty("animation");
}

type BusinessMapProps = {
  className?: string;
  dotsActive?: boolean;
  columnsActive?: boolean;
  mapEntered?: boolean;
};

export function BusinessMap({
  className,
  dotsActive = false,
  columnsActive = false,
  mapEntered = false,
}: BusinessMapProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapMarkup, setMapMarkup] = useState<string | null>(null);
  const [waterMarkup, setWaterMarkup] = useState<string | null>(null);
  const preparedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const mapPromise = fetch(MAP_SVG_SRC).then((res) => {
      if (!res.ok) throw new Error(`map svg ${res.status}`);
      return res.text();
    });
    const waterPromise = ENABLE_WATER_OVERLAY
      ? fetch(WATER_SVG_SRC).then((res) => {
        if (!res.ok) throw new Error(`water svg ${res.status}`);
        return res.text();
      })
      : Promise.resolve("");

    Promise.all([mapPromise, waterPromise])
      .then(([mapText, waterText]) => {
        if (cancelled) return;
        setMapMarkup(mapText);
        setWaterMarkup(ENABLE_WATER_OVERLAY ? waterText : "");
      })
      .catch(() => {
        if (cancelled) return;
        setMapMarkup(null);
        setWaterMarkup(ENABLE_WATER_OVERLAY ? null : "");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    const mapRoot = mapRef.current;
    const waterRoot = waterRef.current;
    if (!mapRoot || !mapMarkup) return;

    mapRoot.innerHTML = mapMarkup;
    if (waterRoot && waterMarkup) {
      waterRoot.innerHTML = waterMarkup;
      prepareWaterSvg(waterRoot, WATER_RENDER_MODE);
      if (MASK_WATER_INSET_FOR_MAPGROUP2) {
        maskSouthChinaInsetInWater(waterRoot);
      }
    }

    preparedRef.current = false;

    try {
      configureMapSvg(stackRef.current ?? mapRoot);
      prepareMapSvg(mapRoot);
      if (SHOULD_NORMALIZE_LAND_GRADIENTS) {
        solidifyLandGradients(mapRoot);
      }
      applyColumnVisuals(mapRoot, false);
      applyDotVisuals(mapRoot, false);
      preparedRef.current = true;
    } catch {
      preparedRef.current = false;
    }
  }, [mapMarkup, waterMarkup]);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack || !preparedRef.current || !mapEntered) return;
    restartWaterAnimation(stack);
  }, [mapEntered, mapMarkup, waterMarkup]);

  useEffect(() => {
    const mapRoot = mapRef.current;
    if (!mapRoot || !preparedRef.current || !dotsActive) return;

    applyDotVisuals(mapRoot, true);
    restartDotAnimations(mapRoot);
  }, [dotsActive, mapMarkup]);

  useEffect(() => {
    const mapRoot = mapRef.current;
    if (!mapRoot || !preparedRef.current || !columnsActive) return;

    applyColumnVisuals(mapRoot, true);
    restartColumnAnimations(mapRoot);
  }, [columnsActive, mapMarkup]);

  if (!mapMarkup || (ENABLE_WATER_OVERLAY && !waterMarkup)) {
    return (
      <div
        className={cn(
          "business-map-root aspect-[725/521] h-full animate-pulse rounded-2xl bg-[var(--bg-shell)]/60",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <div
      ref={stackRef}
      className={cn(
        "business-map-root h-full",
        WATER_RENDER_MODE === "borders"
          ? "business-map-root--water-borders"
          : "business-map-root--water-legacy",
        mapEntered && "business-map-root--entered",
        dotsActive && "business-map-root--dots-active",
        columnsActive && "business-map-root--columns-active",
        className,
      )}
      aria-hidden
    >
      {ENABLE_WATER_OVERLAY ? (
        <div
          ref={waterRef}
          className={cn(
            "business-map-water pointer-events-none absolute inset-0 flex items-center justify-center",
            WATER_RENDER_MODE === "borders" ? "z-[2]" : "z-0",
          )}
        />
      ) : null}
      <div ref={mapRef} className="business-map-layer h-full" />
    </div>
  );
}
