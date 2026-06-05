"use client";

import Image from "next/image";
import Link from "next/link";
import { useTrialModal } from "@/contexts/TrialModalContext";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  FLOATING_TOOLBAR_BUTTON_SIZE,
  FLOATING_TOOLBAR_TOTAL_HEIGHT,
  useFloatingToolbarPosition,
} from "@/hooks/useFloatingToolbarPosition";
import {
  FLOATING_TOOLBAR_SCROLL_END_MS,
  useFloatingToolbarScrollReveal,
} from "@/hooks/useFloatingToolbarScrollReveal";
import { cn } from "@/lib/cn";

const ICONS = {
  gift: "/assets/floating_toolbar/icon_gift.svg",
  help: "/assets/floating_toolbar/icon_help.svg",
  backToTop: "/assets/floating_toolbar/icon_arrow_line_up.svg",
} as const;

const SLOT_STYLE = {
  height: FLOATING_TOOLBAR_BUTTON_SIZE,
} as const;

const LAST_SLOT_STYLE = SLOT_STYLE;

const TOOLTIP_WRAP_CLASS =
  "pointer-events-none absolute right-full top-1/2 z-[60] mr-3 -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100";

export function FloatingToolbar() {
  const [mounted, setMounted] = useState(false);
  const { showBackToTop, mode, coords } = useFloatingToolbarPosition();
  const revealed = useFloatingToolbarScrollReveal(FLOATING_TOOLBAR_SCROLL_END_MS);
  const { open: openTrialModal } = useTrialModal();

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const positionStyle: CSSProperties =
    mode === "fixed"
      ? {
          right: coords.right,
          bottom: coords.bottom,
          height: FLOATING_TOOLBAR_TOTAL_HEIGHT,
        }
      : {
          right: coords.right,
          top: coords.top,
          height: FLOATING_TOOLBAR_TOTAL_HEIGHT,
        };

  if (!mounted) return null;

  return createPortal(
    <aside
      aria-label="页面快捷操作"
      aria-hidden={!revealed}
      className={cn(
        "floating-toolbar-root w-fit overflow-visible",
        revealed
          ? "floating-toolbar-root--visible"
          : "floating-toolbar-root--hidden",
        mode === "fixed" ? "fixed" : "absolute",
      )}
      style={positionStyle}
    >
      <div className="flex h-fit w-fit flex-col items-center gap-3 overflow-visible">
        <ToolbarSlot style={SLOT_STYLE}>
          <ToolbarButton
            variant="primary"
            onClick={openTrialModal}
            ariaLabel="免费试用"
            iconSrc={ICONS.gift}
            tooltip={<SimpleTooltip label="免费试用" />}
          />
        </ToolbarSlot>

        <ToolbarSlot style={SLOT_STYLE}>
          <ToolbarButton
            variant="outline"
            ariaLabel="客服热线"
            iconSrc={ICONS.help}
            tooltip={<ServiceTooltip />}
          />
        </ToolbarSlot>

        <ToolbarSlot
          style={LAST_SLOT_STYLE}
          className={cn(
            "floating-toolbar-back-slot",
            showBackToTop
              ? "floating-toolbar-back-slot--visible"
              : "floating-toolbar-back-slot--hidden",
          )}
        >
          <ToolbarButton
            variant="outline"
            onClick={scrollToTop}
            ariaLabel="返回顶部"
            iconSrc={ICONS.backToTop}
            tabIndex={showBackToTop ? 0 : -1}
            tooltip={<SimpleTooltip label="返回顶部" />}
          />
        </ToolbarSlot>
      </div>
    </aside>,
    document.body,
  );
}

function ToolbarSlot({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style: CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full shrink-0 items-center justify-center overflow-visible",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

function ToolbarButton({
  variant,
  href,
  onClick,
  ariaLabel,
  iconSrc,
  tooltip,
  tabIndex,
}: {
  variant: "primary" | "outline";
  href?: string;
  onClick?: () => void;
  ariaLabel: string;
  iconSrc: string;
  tooltip: ReactNode;
  tabIndex?: number;
}) {
  const buttonClass = cn(
    "group relative flex size-12 shrink-0 items-center justify-center overflow-visible rounded-full transition-shadow",
    variant === "primary" &&
      "bg-[image:var(--gradient-primary)] shadow-[var(--shadow-card)] hover:opacity-95",
    variant === "outline" &&
      "border border-[var(--border-light)] bg-white shadow-[var(--shadow-card)] hover:bg-[var(--btn-outline-hover)]",
  );

  const inner = (
    <>
      <span className={TOOLTIP_WRAP_CLASS}>{tooltip}</span>
      <Image
        src={iconSrc}
        alt=""
        width={24}
        height={24}
        className="size-6"
        aria-hidden
        unoptimized
      />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        className={buttonClass}
        tabIndex={tabIndex}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={buttonClass}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      {inner}
    </button>
  );
}

function SimpleTooltip({ label }: { label: string }) {
  return (
    <span className="floating-toolbar-tooltip relative inline-flex whitespace-nowrap rounded-lg bg-white px-4 py-2.5 text-base font-medium text-[var(--text-base)]">
      {label}
      <TooltipArrow />
    </span>
  );
}

function ServiceTooltip() {
  return (
    <span className="floating-toolbar-tooltip relative inline-flex w-[184px] flex-col gap-1 rounded-lg bg-white px-4 py-3 text-left">
      <span className="text-base font-medium text-[var(--text-base)]">
        客服热线
      </span>
      <span className="text-lg font-semibold leading-7 text-[var(--color-primary)]">
        136-7898-8239
      </span>
      <span className="text-sm text-[var(--text-tertiary)]">
        工作日 9:00-18:30
      </span>
      <TooltipArrow />
    </span>
  );
}

function TooltipArrow() {
  return (
    <span
      className="floating-toolbar-tooltip-arrow absolute -right-1.5 top-1/2 size-3 -translate-y-1/2 rotate-45 bg-white"
      aria-hidden
    />
  );
}
