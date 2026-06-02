"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ModalShell } from "@/components/modals/ModalShell";
import { Button } from "@/components/ui/Button";
import { useForgotPasswordModal } from "@/contexts/ForgotPasswordModalContext";
import { useLoginModal } from "@/contexts/LoginModalContext";
import { cn } from "@/lib/cn";
import { MODAL_LOGIN_PANEL_BG_SRC } from "@/lib/modalPanelAssets";
import { validatePhone } from "@/lib/validatePhone";

const ICON_CLEAR_SRC = "/assets/trial-modal/icon-clear.svg";
const ICON_EYES_SRC = "/assets/modal/icon_eyes.svg";
const ICON_HIDDEN_SRC = "/assets/modal/icon_hidden.svg";

const SMS_COUNTDOWN_SECONDS = 59;

const INPUT_CLASS =
  "h-10 w-full rounded-lg border border-[var(--border-heavy)] bg-white px-3 text-sm leading-[22px] text-[var(--text-base)] outline-none transition-colors placeholder:text-[var(--text-quaternary)] focus:border-[var(--color-primary)]";

function PasswordField({
  id,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-10 items-center gap-3 rounded-lg border border-[var(--border-heavy)] bg-white px-3 transition-colors focus-within:border-[var(--color-primary)]">
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="new-password"
        className="min-w-0 flex-1 border-0 bg-transparent text-sm leading-[22px] text-[var(--text-base)] outline-none placeholder:text-[var(--text-quaternary)]"
      />
      {value ? (
        <>
          <button
            type="button"
            className="flex size-5 shrink-0 items-center justify-center"
            aria-label="清除密码"
            onClick={() => onChange("")}
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
          <span
            className="h-4 w-px shrink-0 bg-[var(--border-light)]"
            aria-hidden
          />
        </>
      ) : null}
      <button
        type="button"
        className="flex size-5 shrink-0 items-center justify-center"
        aria-label={showPassword ? "隐藏密码" : "显示密码"}
        aria-pressed={showPassword}
        onClick={() => setShowPassword((prev) => !prev)}
      >
        <Image
          src={showPassword ? ICON_EYES_SRC : ICON_HIDDEN_SRC}
          alt=""
          width={20}
          height={20}
          className="size-5"
          aria-hidden
          unoptimized
        />
      </button>
    </div>
  );
}

export function ForgotPasswordModal() {
  const { isOpen, openOptions, close } = useForgotPasswordModal();
  const { open: openLoginModal } = useLoginModal();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [mounted, setMounted] = useState(false);

  const resetForm = useCallback(() => {
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setCode("");
    setPhoneError(null);
    setConfirmError(null);
    setCountdown(0);
  }, []);

  const handleClose = useCallback(() => {
    close();
    resetForm();
  }, [close, resetForm]);

  const handleCancel = useCallback(() => {
    handleClose();
    openLoginModal();
  }, [handleClose, openLoginModal]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setPhone(openOptions.phone ?? "");
    setPassword("");
    setConfirmPassword("");
    setCode("");
    setPhoneError(null);
    setConfirmError(null);
    setCountdown(0);
  }, [isOpen, openOptions.phone]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = window.setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => phoneInputRef.current?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [handleClose, isOpen]);

  const handleGetCode = () => {
    if (countdown > 0) return;

    const error = validatePhone(phone);
    if (error) {
      setPhoneError(error);
      phoneInputRef.current?.blur();
      return;
    }

    setPhoneError(null);
    // TODO: 接入发送验证码接口
    setCountdown(SMS_COUNTDOWN_SECONDS);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const error = validatePhone(phone);
    if (error) {
      setPhoneError(error);
      phoneInputRef.current?.blur();
      return;
    }

    if (!password.trim()) {
      setConfirmError("请输入新密码");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("两次输入的密码不一致");
      return;
    }

    if (!code.trim()) {
      setConfirmError("请输入验证码");
      return;
    }

    setPhoneError(null);
    setConfirmError(null);
    // TODO: 接入重置密码接口
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (phoneError) setPhoneError(null);
    if (countdown > 0) setCountdown(0);
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <ModalShell
      titleId={titleId}
      dialogRef={dialogRef}
      panelBgSrc={MODAL_LOGIN_PANEL_BG_SRC}
      onClose={handleClose}
    >
      <div className="flex w-full max-w-[380px] flex-1 flex-col items-center justify-start gap-6">
        <h2
          id={titleId}
          className="text-[32px] font-medium leading-[44px] text-[var(--text-base)]"
        >
          找回密码
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[280px] flex-col gap-10"
          noValidate
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="forgot-password-phone"
                className="flex items-start gap-1 text-sm leading-[22px] text-[var(--text-base)]"
              >
                手机号
                <span className="text-[var(--text-error)]">*</span>
              </label>
              <div className="relative">
                <input
                  ref={phoneInputRef}
                  id="forgot-password-phone"
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={(event) => handlePhoneChange(event.target.value)}
                  placeholder="输入手机号码"
                  autoComplete="tel"
                  aria-invalid={phoneError ? true : undefined}
                  className={cn(
                    INPUT_CLASS,
                    phoneError && "border-[var(--text-error)]",
                    phone && "pr-10",
                  )}
                />
                {phone ? (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 size-5 -translate-y-1/2"
                    aria-label="清除手机号"
                    onClick={() => handlePhoneChange("")}
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
                {phoneError ? (
                  <p
                    className="absolute left-0 top-full mt-1 text-sm leading-[22px] text-[var(--text-error)]"
                    role="alert"
                  >
                    {phoneError}
                  </p>
                ) : null}
              </div>
            </div>

            <PasswordField
              id="forgot-password-new"
              value={password}
              placeholder="输入新密码"
              onChange={(value) => {
                setPassword(value);
                if (confirmError) setConfirmError(null);
              }}
            />

            <PasswordField
              id="forgot-password-confirm"
              value={confirmPassword}
              placeholder="再次确认你的新密码"
              onChange={(value) => {
                setConfirmPassword(value);
                if (confirmError) setConfirmError(null);
              }}
            />

            <div>
              <div className="flex h-10 items-center rounded-lg border border-[var(--border-heavy)] bg-white transition-colors focus-within:border-[var(--color-primary)]">
                <input
                  id="forgot-password-code"
                  type="text"
                  name="code"
                  inputMode="numeric"
                  value={code}
                  onChange={(event) => {
                    setCode(event.target.value);
                    if (confirmError) setConfirmError(null);
                  }}
                  placeholder="验证码"
                  autoComplete="one-time-code"
                  className="min-w-0 flex-1 border-0 bg-transparent px-3 text-sm leading-[22px] text-[var(--text-base)] outline-none placeholder:text-[var(--text-quaternary)]"
                />
                {code ? (
                  <button
                    type="button"
                    className="mr-1 flex size-5 shrink-0 items-center justify-center"
                    aria-label="清除验证码"
                    onClick={() => setCode("")}
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
                <span
                  className="mx-2 h-4 w-px shrink-0 bg-[var(--border-light)]"
                  aria-hidden
                />
                <button
                  type="button"
                  disabled={countdown > 0}
                  className={cn(
                    "w-[98px] shrink-0 pl-0 pr-3 text-sm leading-[22px] transition-opacity",
                    countdown > 0
                      ? "cursor-not-allowed text-[var(--text-quaternary)]"
                      : "text-[var(--color-primary)] hover:opacity-80",
                  )}
                  onClick={handleGetCode}
                >
                  {countdown > 0 ? `${countdown}s重新获取` : "获取验证码"}
                </button>
              </div>
              {confirmError ? (
                <p
                  className="mt-1 text-sm leading-[22px] text-[var(--text-error)]"
                  role="alert"
                >
                  {confirmError}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-12 w-[100px] shrink-0 rounded-[10px] px-5"
              onClick={handleCancel}
            >
              取消
            </Button>
            <Button type="submit" className="h-12 min-w-0 flex-1 rounded-[10px]">
              重置密码
            </Button>
          </div>
        </form>
      </div>
    </ModalShell>,
    document.body,
  );
}
