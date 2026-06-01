"use client";

import Image from "next/image";
import type { ReactNode, RefObject } from "react";

const ICON_CLOSE_SRC = "/assets/modal/icon_close.svg";

type ModalShellProps = {
  titleId: string;
  dialogRef: RefObject<HTMLDivElement | null>;
  panelBgSrc: string;
  onClose: () => void;
  children: ReactNode;
};

/** 营销弹窗共用外壳：左侧插画 + 右侧内容区 */
export function ModalShell({
  titleId,
  dialogRef,
  panelBgSrc,
  onClose,
  children,
}: ModalShellProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden overscroll-none p-4">
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
        className="relative flex max-h-[calc(100vh-32px)] w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-[0_6px_12px_rgba(0,0,0,0.12),0_12px_24px_rgba(0,0,0,0.12)]"
      >
        <aside className="relative hidden h-[600px] w-[400px] shrink-0 overflow-hidden md:block">
          <Image
            src={panelBgSrc}
            alt=""
            width={400}
            height={600}
            className="size-full object-cover"
            aria-hidden
            unoptimized
          />
        </aside>

        <div className="relative flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 pb-10 pt-16 sm:px-[60px] sm:pb-10 sm:pt-20">
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
