"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useWechatBindModal } from "@/contexts/WechatBindModalContext";

const BIND_QRCODE_SRC = "/assets/modal/login_qrcode.png";

/** 本地 dev：?bindWechat=1 自动打开弹窗 */
const WECHAT_BIND_DEV_PRESET_KEY = "bindWechat";

export function WechatBindModal() {
  const { isOpen, open, close } = useWechatBindModal();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const preset = new URLSearchParams(window.location.search).get(
      WECHAT_BIND_DEV_PRESET_KEY,
    );
    if (preset === "1") {
      open();
    }
  }, [open]);

  const handleSkip = useCallback(() => {
    close();
    // TODO: 跳过绑定，直接进入已登录态
  }, [close]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden overscroll-none p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#000000]/40"
        aria-label="关闭弹窗"
        onClick={close}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex size-[380px] flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl bg-white py-6 shadow-[0_6px_12px_rgba(0,0,0,0.12),0_12px_24px_rgba(0,0,0,0.12)]"
      >
        <p
          id={titleId}
          className="text-center text-xl font-medium leading-7 text-[var(--text-base)]"
        >
          首次登录建议扫码绑定微信
        </p>

        <div className="size-[200px] overflow-hidden rounded-xl border border-[var(--border-light)] bg-white">
          <Image
            src={BIND_QRCODE_SRC}
            alt="微信绑定二维码"
            width={200}
            height={200}
            className="size-full object-cover"
            unoptimized
          />
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-0 text-base leading-6 text-[var(--color-primary)] transition-opacity hover:opacity-80"
          onClick={handleSkip}
        >
          跳过，直接登录
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-5 shrink-0"
            aria-hidden
          >
            <path
              d="M9.29289 16.2929C8.90237 16.6834 8.90237 17.3164 9.29289 17.707C9.68342 18.0975 10.3164 18.0975 10.707 17.707L15.707 12.707C16.0975 12.3164 16.0975 11.6834 15.707 11.2929L10.707 6.29289C10.3164 5.90237 9.68342 5.90237 9.29289 6.29289C8.90237 6.68342 8.90237 7.31643 9.29289 7.70696L13.5859 11.9999L9.29289 16.2929Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}
