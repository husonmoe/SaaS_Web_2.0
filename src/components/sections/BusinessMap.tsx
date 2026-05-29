"use client";

import { cn } from "@/lib/cn";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const MAP_SVG_SRC = "/assets/mapgroup.structured.svg";
const STAGGER_MAX_MS = 800;

function configureMapSvg(root: HTMLElement) {
  const svg = root.querySelector("svg");
  if (!svg) return;

  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
}

function randomDelayMs() {
  return Math.floor(Math.random() * STAGGER_MAX_MS);
}

function randomOpacity(min: number, max: number) {
  return (min + Math.random() * (max - min)).toFixed(2);
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

function prepareMapSvg(root: HTMLElement) {
  const columnsGroup = findLayer(root, ["light-columns", "light_columns"]);
  if (!columnsGroup) return;

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

  dotsGroup.querySelectorAll(".map-dot-ripple").forEach((ripple) => {
    const circle = ripple as SVGCircleElement;
    if (circle.parentElement?.classList.contains("map-dot-ripple-wrap")) return;

    const wrap = document.createElementNS("http://www.w3.org/2000/svg", "g");
    wrap.setAttribute("class", "map-dot-ripple-wrap");
    circle.parentNode?.insertBefore(wrap, circle);
    wrap.appendChild(circle);
  });

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
    ripple.setAttribute("stroke-width", "1");
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
    "#light-columns > .map-column-item, #light-columns > g:not(.map-column-item), [id*='light-columns' i] > .map-column-item, [id*='light-columns' i] > g:not(.map-column-item)",
  );

  columns.forEach((el) => {
    el.style.setProperty("--map-item-opacity", randomOpacity(0.42, 1));
    if (!animate) return;
    el.style.animationDelay = `${randomDelayMs()}ms`;
  });
}

function applyDotVisuals(root: HTMLElement, animate: boolean) {
  const dotAnims = root.querySelectorAll<SVGElement>(
    "#light-dots > .map-dot-anim, [id*='light-dots' i] > .map-dot-anim",
  );

  dotAnims.forEach((el) => {
    el.style.setProperty("--map-item-opacity", randomOpacity(0.55, 1));

    el.querySelectorAll<SVGCircleElement>(
      ".map-dot-node circle:not(.map-dot-ripple)",
    ).forEach((circle) => {
      circle.style.opacity = randomOpacity(0.75, 1);
    });

    if (!animate) return;

    const delay = randomDelayMs();
    el.style.animationDelay = `${delay}ms`;

    const rippleWrap = el.querySelector<SVGGElement>(".map-dot-ripple-wrap");
    if (rippleWrap) {
      rippleWrap.style.setProperty(
        "--map-ripple-opacity",
        randomOpacity(0.45, 0.85),
      );
      rippleWrap.style.animationDelay = `${delay + 200 + (randomDelayMs() % 400)}ms`;
    }
  });
}

function restartDotAnimations(root: HTMLElement) {
  root
    .querySelectorAll<SVGElement>(".map-dot-anim, .map-dot-ripple-wrap")
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
      ].join(","),
    )
    .forEach((el) => {
      el.style.animation = "none";
      void el.getBoundingClientRect();
      el.style.removeProperty("animation");
    });
}

type BusinessMapProps = {
  className?: string;
  dotsActive?: boolean;
  columnsActive?: boolean;
};

export function BusinessMap({
  className,
  dotsActive = false,
  columnsActive = false,
}: BusinessMapProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const preparedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetch(MAP_SVG_SRC)
      .then((res) => {
        if (!res.ok) throw new Error(`map svg ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (!cancelled) setSvgMarkup(text);
      })
      .catch(() => {
        if (!cancelled) setSvgMarkup(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !svgMarkup) return;

    root.innerHTML = svgMarkup;
    preparedRef.current = false;

    try {
      configureMapSvg(root);
      prepareMapSvg(root);
      applyColumnVisuals(root, false);
      applyDotVisuals(root, false);
      preparedRef.current = true;
    } catch {
      preparedRef.current = false;
    }
  }, [svgMarkup]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !preparedRef.current || !dotsActive) return;

    applyDotVisuals(root, true);
    restartDotAnimations(root);
  }, [dotsActive, svgMarkup]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !preparedRef.current || !columnsActive) return;

    applyColumnVisuals(root, true);
    restartColumnAnimations(root);
  }, [columnsActive, svgMarkup]);

  if (!svgMarkup) {
    return (
      <div
        className={cn(
          "business-map-root aspect-[624/520] h-full animate-pulse rounded-2xl bg-[var(--bg-shell)]/60",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "business-map-root h-full",
        dotsActive && "business-map-root--dots-active",
        columnsActive && "business-map-root--columns-active",
        className,
      )}
      aria-hidden
    />
  );
}
