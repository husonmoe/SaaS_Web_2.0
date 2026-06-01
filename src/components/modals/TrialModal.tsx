"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ModalShell } from "@/components/modals/ModalShell";
import { useLoginModal } from "@/contexts/LoginModalContext";
import {
  useTrialModal,
  type TrialModalView,
} from "@/contexts/TrialModalContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { validatePhone } from "@/lib/validatePhone";

const TRIAL_PANEL_BG_SRC = "/assets/modal/modal_trial_bg.png";
const ICON_SUCCESS_SRC = "/assets/modal/icon_check_circle_fill.svg";
const SERVICE_CARD_SRC = "/assets/modal/serviceCard.png";
const ICON_CLEAR_SRC = "/assets/trial-modal/icon-clear.svg";

function TrialModalLoginFooter() {
  const { open: openLoginModal } = useLoginModal();
  const { close: closeTrialModal } = useTrialModal();

  return (
    <p className="text-sm leading-[22px]">
      <span className="text-[var(--text-secondary)]">已有诊所账号？</span>
      <button
        type="button"
        className="ml-1 text-[var(--color-primary)] hover:underline"
        onClick={() => {
          closeTrialModal();
          openLoginModal();
        }}
      >
        立即登录
      </button>
    </p>
  );
}

function TrialModalFormView({
  titleId,
  phone,
  orgName,
  phoneError,
  phoneInputRef,
  onPhoneChange,
  onOrgNameChange,
  onSubmit,
}: {
  titleId: string;
  phone: string;
  orgName: string;
  phoneError: string | null;
  phoneInputRef: React.RefObject<HTMLInputElement | null>;
  onPhoneChange: (value: string) => void;
  onOrgNameChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  return (
    <>
      <div className="mb-6 flex h-[116px] w-full max-w-[280px] flex-col items-center gap-2 text-center">
        <h2
          id={titleId}
          className="text-[32px] font-medium leading-[44px] text-[var(--text-base)]"
        >
          免费试用申请
        </h2>
        <p className="text-xl leading-7 text-[var(--color-primary)]">
          预约专属顾问 1对1 演示系统
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex w-full max-w-[280px] flex-1 flex-col gap-10"
        noValidate
      >
        <div className="flex flex-col">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="trial-phone"
              className="flex items-start gap-1 text-sm leading-[22px] text-[var(--text-base)]"
            >
              手机号
              <span className="text-[var(--text-error)]">*</span>
            </label>
            <div className="relative">
              <input
                ref={phoneInputRef}
                id="trial-phone"
                type="tel"
                name="phone"
                value={phone}
                onChange={(event) => onPhoneChange(event.target.value)}
                placeholder="输入手机号码"
                autoComplete="tel"
                aria-invalid={phoneError ? true : undefined}
                aria-describedby="trial-phone-error"
                className={cn(
                  "h-10 w-full rounded-lg border bg-white px-3 text-sm leading-[22px] text-[var(--text-base)] outline-none transition-colors placeholder:text-[var(--text-quaternary)] focus:border-[var(--color-primary)]",
                  phoneError
                    ? "border-[var(--text-error)]"
                    : "border-[var(--border-heavy)]",
                  phone && "pr-10",
                )}
              />
              {phone ? (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 size-5 -translate-y-1/2"
                  aria-label="清除手机号"
                  onClick={() => onPhoneChange("")}
                >
                  <Image
                    src={ICON_CLEAR_SRC}
                    alt=""
                    width={20}
                    height={20}
                    className="size-5"
                    aria-hidden
                    unoptimized
                  />
                </button>
              ) : null}
            </div>
          </div>

          <div className="relative h-8 shrink-0">
            <p
              id="trial-phone-error"
              className={cn(
                "absolute inset-x-0 top-0 text-sm leading-[22px] text-[var(--text-error)]",
                !phoneError && "invisible",
              )}
              role={phoneError ? "alert" : undefined}
              aria-live="polite"
            >
              {phoneError ?? "请输入11位有效数字"}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="trial-org"
              className="text-sm leading-[22px] text-[var(--text-base)]"
            >
              机构名称
            </label>
            <input
              id="trial-org"
              type="text"
              name="orgName"
              value={orgName}
              onChange={(event) => onOrgNameChange(event.target.value)}
              placeholder="输入机构名称"
              autoComplete="organization"
              className="h-10 w-full rounded-lg border border-[var(--border-heavy)] bg-white px-3 text-sm leading-[22px] text-[var(--text-base)] outline-none transition-colors placeholder:text-[var(--text-quaternary)] focus:border-[var(--color-primary)]"
            />
          </div>
        </div>

        <Button type="submit" className="h-12 w-full rounded-[10px]">
          立即提交
        </Button>
      </form>

      <div className="mt-6">
        <TrialModalLoginFooter />
      </div>
    </>
  );
}

function TrialModalSuccessView({ titleId }: { titleId: string }) {
  return (
    <>
      <div className="flex w-full flex-1 flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center gap-3 py-6">
          <Image
            src={ICON_SUCCESS_SRC}
            alt=""
            width={48}
            height={48}
            className="size-12"
            aria-hidden
            unoptimized
          />
          <div className="flex flex-col items-center gap-2 text-center text-[var(--text-base)]">
            <h2
              id={titleId}
              className="text-[28px] font-medium leading-9 text-[var(--text-base)]"
            >
              提交成功
            </h2>
            <p className="text-lg leading-[26px]">
              我们会在 3 个工作日内与你联系
            </p>
          </div>
        </div>

        <div className="w-full max-w-[380px] overflow-hidden rounded-xl border border-white shadow-[0px_8px_24px_0px_rgba(15,47,76,0.08)]">
          <Image
            src={SERVICE_CARD_SRC}
            alt="专属私享客服联系方式"
            width={1140}
            height={540}
            className="h-auto w-full"
            unoptimized
          />
        </div>
      </div>

      <div className="mt-6">
        <TrialModalLoginFooter />
      </div>
    </>
  );
}

export function TrialModal() {
  const { isOpen, close, openOptions } = useTrialModal();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const [view, setView] = useState<TrialModalView>("form");
  const [phone, setPhone] = useState("");
  const [orgName, setOrgName] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const resetForm = useCallback(() => {
    setView("form");
    setPhone("");
    setOrgName("");
    setPhoneError(null);
  }, []);

  const handleClose = useCallback(() => {
    close();
    resetForm();
  }, [close, resetForm]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setView(openOptions.view ?? "form");
    setPhone(openOptions.phone ?? "");
    setOrgName("");
    setPhoneError(null);
  }, [isOpen, openOptions]);

  useEffect(() => {
    if (!isOpen) return;

    const timer =
      view === "form"
        ? window.setTimeout(() => phoneInputRef.current?.focus(), 0)
        : undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [handleClose, isOpen, view]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const error = validatePhone(phone);
    if (error) {
      setPhoneError(error);
      phoneInputRef.current?.blur();
      return;
    }
    setPhoneError(null);
    // TODO: 接入后端提交接口
    setView("success");
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (phoneError) setPhoneError(null);
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <ModalShell
      titleId={titleId}
      dialogRef={dialogRef}
      panelBgSrc={TRIAL_PANEL_BG_SRC}
      onClose={handleClose}
    >
      {view === "form" ? (
        <TrialModalFormView
          titleId={titleId}
          phone={phone}
          orgName={orgName}
          phoneError={phoneError}
          phoneInputRef={phoneInputRef}
          onPhoneChange={handlePhoneChange}
          onOrgNameChange={setOrgName}
          onSubmit={handleSubmit}
        />
      ) : (
        <TrialModalSuccessView titleId={titleId} />
      )}
    </ModalShell>,
    document.body,
  );
}
