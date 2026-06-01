"use client";

import { createPortal } from "react-dom";

type ToastViewportProps = {
  message: string;
};

/** 固定在视窗顶部居中，不随页面滚动 */
export function ToastViewport({ message }: ToastViewportProps) {
  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] flex justify-center px-4 pt-6 sm:pt-8"
    >
      <div
        role="alert"
        className="pointer-events-auto max-w-[min(100vw-2rem,360px)] rounded-xl border border-[var(--border-light)] bg-white px-4 py-3 text-center text-sm leading-[22px] text-[var(--text-base)] shadow-[0px_8px_24px_0px_rgba(15,47,76,0.08)]"
      >
        {message}
      </div>
    </div>,
    document.body,
  );
}
