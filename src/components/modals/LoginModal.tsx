"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ModalShell } from "@/components/modals/ModalShell";
import { Button } from "@/components/ui/Button";
import { useLoginModal } from "@/contexts/LoginModalContext";
import { useTrialModal } from "@/contexts/TrialModalContext";
import { cn } from "@/lib/cn";
import { validatePhone } from "@/lib/validatePhone";

const LOGIN_PANEL_BG_SRC = "/assets/modal/modal_login_bg.png";
const ICON_WECHAT_SRC = "/assets/modal/icon_wechat.svg";
const LOGIN_QRCODE_SRC = "/assets/modal/login_qrcode.png";
const ICON_LAST_LOGIN_ARROW_SRC = "/assets/modal/icon_last_login_arrow.svg";
const ICON_CLEAR_SRC = "/assets/trial-modal/icon-clear.svg";
const ICON_EYES_SRC = "/assets/modal/icon_eyes.svg";
const ICON_HIDDEN_SRC = "/assets/modal/icon_hidden.svg";

const CHECKBOX_CHECKMARK =
  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 10 10\' fill=\'none\'%3E%3Cpath d=\'M8.5 2.5L4 7L1.5 4.5\' stroke=\'white\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")';

const SMS_COUNTDOWN_SECONDS = 59;

const LAST_LOGIN_STORAGE_KEY = "saas-login-last-method";

type LoginTab = "wechat" | "sms" | "password";

const LOGIN_TABS: { id: LoginTab; label: string }[] = [
  { id: "wechat", label: "微信登录" },
  { id: "sms", label: "验证码登录" },
  { id: "password", label: "密码登录" },
];

function readLastLoginTab(): LoginTab {
  if (typeof window === "undefined") return "wechat";
  const stored = window.localStorage.getItem(LAST_LOGIN_STORAGE_KEY);
  if (stored === "sms" || stored === "password" || stored === "wechat") {
    return stored;
  }
  return "wechat";
}

function writeLastLoginTab(tab: LoginTab) {
  window.localStorage.setItem(LAST_LOGIN_STORAGE_KEY, tab);
}

const INPUT_CLASS =
  "h-10 w-full rounded-lg border border-[var(--border-heavy)] bg-white px-3 text-sm leading-[22px] text-[var(--text-base)] outline-none transition-colors placeholder:text-[var(--text-quaternary)] focus:border-[var(--color-primary)]";

function LoginMethodTabs({
  activeTab,
  lastLoginTab,
  onTabChange,
}: {
  activeTab: LoginTab;
  lastLoginTab: LoginTab;
  onTabChange: (tab: LoginTab) => void;
}) {
  return (
    <div className="w-full overflow-visible rounded-lg bg-[var(--btn-outline-active)] p-1">
      <div className="flex gap-1">
        {LOGIN_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={cn(
              "relative flex h-10 min-w-0 flex-1 items-center justify-center rounded-md px-3 text-base leading-6 transition-colors",
              activeTab === tab.id
                ? "bg-white text-[var(--text-base)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-base)]",
            )}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.id === lastLoginTab ? (
              <span className="pointer-events-none absolute -top-5 left-0 flex flex-col items-start">
                <span className="whitespace-nowrap rounded-md bg-[image:var(--gradient-primary)] px-1.5 py-0.5 text-xs font-medium leading-5 text-white">
                  上次登录
                </span>
                <Image
                  src={ICON_LAST_LOGIN_ARROW_SRC}
                  alt=""
                  width={8}
                  height={4}
                  className="ml-3 h-1 w-2"
                  aria-hidden
                  unoptimized
                />
              </span>
            ) : null}
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function LoginWechatView() {
  return (
    <div className="flex w-full max-w-[280px] flex-col items-center gap-6 pt-6">
      <div className="flex size-[200px] items-center justify-center overflow-hidden rounded-xl border border-[var(--border-light)] bg-white">
        <Image
          src={LOGIN_QRCODE_SRC}
          alt="微信扫码登录二维码"
          width={200}
          height={200}
          className="size-full object-cover"
          unoptimized
        />
      </div>
      <div className="flex items-center gap-2">
        <Image
          src={ICON_WECHAT_SRC}
          alt=""
          width={20}
          height={20}
          className="size-5 shrink-0"
          aria-hidden
          unoptimized
        />
        <p className="text-base leading-6 text-[var(--text-base)]">
          使用「微信」扫码登录
        </p>
      </div>
    </div>
  );
}

function LoginSmsView({
  phone,
  code,
  phoneError,
  phoneInputRef,
  onPhoneChange,
  onCodeChange,
  onPhoneError,
  onSubmit,
}: {
  phone: string;
  code: string;
  phoneError: string | null;
  phoneInputRef: React.RefObject<HTMLInputElement | null>;
  onPhoneChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onPhoneError: (error: string | null) => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = window.setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    setCountdown(0);
  }, [phone]);

  const handleGetCode = () => {
    if (countdown > 0) return;

    const error = validatePhone(phone);
    if (error) {
      onPhoneError(error);
      phoneInputRef.current?.blur();
      return;
    }

    onPhoneError(null);
    // TODO: 接入发送验证码接口
    setCountdown(SMS_COUNTDOWN_SECONDS);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-[280px] flex-col gap-[70px]"
      noValidate
    >
      <div className="flex flex-col">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="login-sms-phone"
            className="flex items-start gap-1 text-sm leading-[22px] text-[var(--text-base)]"
          >
            手机号
            <span className="text-[var(--text-error)]">*</span>
          </label>
          <div className="relative">
            <input
              ref={phoneInputRef}
              id="login-sms-phone"
              type="tel"
              name="phone"
              value={phone}
              onChange={(event) => onPhoneChange(event.target.value)}
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

        <div className="mt-8 flex flex-col gap-2">
          <div className="flex h-10 items-center rounded-lg border border-[var(--border-heavy)] bg-white transition-colors focus-within:border-[var(--color-primary)]">
            <input
              id="login-sms-code"
              type="text"
              name="code"
              inputMode="numeric"
              value={code}
              onChange={(event) => onCodeChange(event.target.value)}
              placeholder="验证码"
              autoComplete="one-time-code"
              className="min-w-0 flex-1 border-0 bg-transparent px-3 text-sm leading-[22px] text-[var(--text-base)] outline-none placeholder:text-[var(--text-quaternary)]"
            />
            {code ? (
              <button
                type="button"
                className="mr-1 flex size-5 shrink-0 items-center justify-center"
                aria-label="清除验证码"
                onClick={() => onCodeChange("")}
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
        </div>
      </div>

      <Button type="submit" className="h-12 w-full rounded-[10px]">
        登录
      </Button>
    </form>
  );
}

function LoginPasswordView({
  phone,
  password,
  phoneError,
  phoneInputRef,
  onPhoneChange,
  onPasswordChange,
  onSubmit,
}: {
  phone: string;
  password: string;
  phoneError: string | null;
  phoneInputRef: React.RefObject<HTMLInputElement | null>;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-[280px] flex-col gap-6"
      noValidate
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="login-password-phone"
            className="flex items-start gap-1 text-sm leading-[22px] text-[var(--text-base)]"
          >
            手机号
            <span className="text-[var(--text-error)]">*</span>
          </label>
          <div className="relative">
            <input
              ref={phoneInputRef}
              id="login-password-phone"
              type="tel"
              name="phone"
              value={phone}
              onChange={(event) => onPhoneChange(event.target.value)}
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

        <div className="flex flex-col gap-2">
          <div className="flex h-10 items-center gap-3 rounded-lg border border-[var(--border-heavy)] bg-white px-3 transition-colors focus-within:border-[var(--color-primary)]">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="输入登录密码"
              autoComplete="current-password"
              className="min-w-0 flex-1 border-0 bg-transparent text-sm leading-[22px] text-[var(--text-base)] outline-none placeholder:text-[var(--text-quaternary)]"
            />
            {password ? (
              <>
                <button
                  type="button"
                  className="flex size-5 shrink-0 items-center justify-center"
                  aria-label="清除密码"
                  onClick={() => onPasswordChange("")}
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
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex w-full items-start justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={rememberPassword}
              onChange={(event) => setRememberPassword(event.target.checked)}
              className="size-4 shrink-0 cursor-pointer appearance-none rounded border border-[var(--border-heavy)] bg-white transition-[background-color,border-color] checked:border-[var(--color-primary)] checked:bg-[var(--color-primary)] checked:bg-[length:10px_10px] checked:bg-center checked:bg-no-repeat focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              style={{
                backgroundImage: rememberPassword ? CHECKBOX_CHECKMARK : undefined,
              }}
            />
            <span className="text-sm leading-[22px] text-[var(--text-base)]">
              记住密码
            </span>
          </label>
          <button
            type="button"
            className="text-sm leading-[22px] text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)]"
            onClick={() => {
              // TODO: 接入忘记密码流程
            }}
          >
            忘记密码?
          </button>
        </div>

        <Button type="submit" className="h-12 w-full rounded-[10px]">
          登录
        </Button>
      </div>
    </form>
  );
}

function LoginModalCreateFooter({ onCreate }: { onCreate: () => void }) {
  return (
    <p className="text-sm leading-[22px]">
      <span className="text-[var(--text-secondary)]">还没有诊所账号？</span>
      <button
        type="button"
        className="ml-1 text-[var(--color-primary)] hover:underline"
        onClick={onCreate}
      >
        立即创建
      </button>
    </p>
  );
}

export function LoginModal() {
  const { isOpen, close } = useLoginModal();
  const { open: openTrialModal } = useTrialModal();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<LoginTab>("wechat");
  const [lastLoginTab, setLastLoginTab] = useState<LoginTab>("wechat");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const resetForm = useCallback(() => {
    setPhone("");
    setCode("");
    setPassword("");
    setPhoneError(null);
  }, []);

  const handleClose = useCallback(() => {
    close();
    resetForm();
  }, [close, resetForm]);

  const handleTabChange = useCallback((tab: LoginTab) => {
    setActiveTab(tab);
    setPhoneError(null);
  }, []);

  const handleCreateAccount = useCallback(() => {
    close();
    resetForm();
    openTrialModal();
  }, [close, openTrialModal, resetForm]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const lastTab = readLastLoginTab();
    setLastLoginTab(lastTab);
    setActiveTab(lastTab);
    resetForm();
  }, [isOpen, resetForm]);

  useEffect(() => {
    if (!isOpen || activeTab === "wechat") return;

    const timer = window.setTimeout(() => phoneInputRef.current?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeTab, handleClose, isOpen]);

  useEffect(() => {
    if (!isOpen || activeTab !== "wechat") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeTab, handleClose, isOpen]);

  const handleCredentialSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const error = validatePhone(phone);
    if (error) {
      setPhoneError(error);
      phoneInputRef.current?.blur();
      return;
    }
    setPhoneError(null);
    writeLastLoginTab(activeTab);
    setLastLoginTab(activeTab);
    // TODO: 接入登录接口
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
      panelBgSrc={LOGIN_PANEL_BG_SRC}
      onClose={handleClose}
    >
      <div className="flex w-full max-w-[380px] flex-1 flex-col items-center justify-start gap-6">
        <div className="flex w-full flex-col items-center gap-6">
          <h2
            id={titleId}
            className="text-[32px] font-medium leading-[44px] text-[var(--text-base)]"
          >
            欢迎登录
          </h2>
          <LoginMethodTabs
            activeTab={activeTab}
            lastLoginTab={lastLoginTab}
            onTabChange={handleTabChange}
          />
        </div>

        <div className="flex w-full max-w-[280px] flex-1 flex-col">
          {activeTab === "wechat" ? (
            <LoginWechatView />
          ) : activeTab === "sms" ? (
            <LoginSmsView
              phone={phone}
              code={code}
              phoneError={phoneError}
              phoneInputRef={phoneInputRef}
              onPhoneChange={handlePhoneChange}
              onCodeChange={setCode}
              onPhoneError={setPhoneError}
              onSubmit={handleCredentialSubmit}
            />
          ) : (
            <LoginPasswordView
              phone={phone}
              password={password}
              phoneError={phoneError}
              phoneInputRef={phoneInputRef}
              onPhoneChange={handlePhoneChange}
              onPasswordChange={setPassword}
              onSubmit={handleCredentialSubmit}
            />
          )}
        </div>

        <div className="mt-auto flex justify-center pt-2">
          <LoginModalCreateFooter onCreate={handleCreateAccount} />
        </div>
      </div>
    </ModalShell>,
    document.body,
  );
}
