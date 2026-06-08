"use client";

import Image from "next/image";
import type { ReactNode, Ref } from "react";
import { cn } from "@/lib/cn";

const ICON_CLOSE_SRC = "/assets/modal/icon_close.svg";

type ModalShellProps = {
  titleId: string;
  dialogRef: Ref<HTMLDivElement>;
  /** 静态插画；与 panel 二选一，panel 优先 */
  panelBgSrc?: string;
  /** 自定义左侧面板（如试用弹窗结构化内容） */
  panel?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  /** 叠在其它营销弹窗之上时使用（默认 200） */
  zIndex?: number;
  /** 覆盖右侧内容区默认间距/高度（如试用弹窗紧凑布局） */
  contentClassName?: string;
  /** 覆盖弹窗外壳宽度/布局（如 Pad 登录弹窗固定 520px） */
  dialogClassName?: string;
  /** 左侧插画从该断点起显示，默认 md */
  panelVisibleFrom?: "md" | "lg";
};

const PANEL_VISIBLE_CLASS = {
  md: "hidden md:block",
  lg: "hidden lg:block",
} as const;

/** 营销弹窗共用外壳：左侧插画 + 右侧内容区 */
export function ModalShell({
  titleId,
  dialogRef,
  panelBgSrc,
  panel,
  onClose,
  children,
  zIndex = 200,
  contentClassName,
  dialogClassName,
  panelVisibleFrom = "md",
}: ModalShellProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden overscroll-none p-4"
      style={{ zIndex }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#000000]/40"
        aria-label="关闭弹窗"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative flex max-h-[calc(100vh-32px)] w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-[0_6px_12px_rgba(0,0,0,0.12),0_12px_24px_rgba(0,0,0,0.12)]",
          dialogClassName,
        )}
      >
        <aside
          className={cn(
            "relative h-[600px] w-[400px] shrink-0 overflow-hidden",
            PANEL_VISIBLE_CLASS[panelVisibleFrom],
          )}
        >
          {panel ?? (
            <Image
              src={panelBgSrc!}
              alt=""
              width={400}
              height={600}
              className="size-full object-cover"
              aria-hidden
              unoptimized
            />
          )}
        </aside>

        <div
          className={cn(
            "relative flex min-h-[480px] flex-1 flex-col items-center overflow-y-auto px-6 pb-10 pt-16 sm:min-h-0 sm:px-[60px] sm:pb-10 sm:pt-20",
            contentClassName,
          )}
        >
          <button
            type="button"
            className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full transition-colors hover:bg-[#f1f3f6]"
            aria-label="关闭"
            onClick={onClose}
          >
            <Image
              src={ICON_CLOSE_SRC}
              alt=""
              width={24}
              height={24}
              className="size-6"
              aria-hidden
              unoptimized
            />
          </button>

          {children}
        </div>
      </div>
    </div>
  );
}
