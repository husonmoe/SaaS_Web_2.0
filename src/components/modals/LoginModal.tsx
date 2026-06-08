"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ModalShell } from "@/components/modals/ModalShell";
import { Button } from "@/components/ui/Button";
import { CLINIC_SELECT_DEV_PRESET_KEY } from "@/components/modals/clinicSelectMockData";
import { useClinicSelectModal } from "@/contexts/ClinicSelectModalContext";
import { useForgotPasswordModal } from "@/contexts/ForgotPasswordModalContext";
import { useLoginModal } from "@/contexts/LoginModalContext";
import { useTrialModal } from "@/contexts/TrialModalContext";
import { cn } from "@/lib/cn";
import { handoffModal } from "@/lib/modalHandoff";
import { MODAL_LOGIN_PANEL_BG_SRC } from "@/lib/modalPanelAssets";
import { validatePhone } from "@/lib/validatePhone";

const ICON_WECHAT_SRC = "/assets/modal/icon_wechat.svg";
const LOGIN_QRCODE_SRC = "/assets/modal/login_qrcode.png";
const ICON_CHECK_CIRCLE_FILL_SRC = "/assets/modal/icon_check_circle_fill.svg";
const ICON_LAST_LOGIN_ARROW_SRC = "/assets/modal/icon_last_login_arrow.svg";
const ICON_CLEAR_SRC = "/assets/trial-modal/icon-clear.svg";
const ICON_EYES_SRC = "/assets/modal/icon_eyes.svg";
const ICON_HIDDEN_SRC = "/assets/modal/icon_hidden.svg";

function blurInputRef(ref: React.Ref<HTMLInputElement>) {
  if (ref && typeof ref === "object" && "current" in ref) {
    ref.current?.blur();
  }
}

const CHECKBOX_CHECKMARK =
  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 10 10\' fill=\'none\'%3E%3Cpath d=\'M8.5 2.5L4 7L1.5 4.5\' stroke=\'white\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")';

const SMS_COUNTDOWN_SECONDS = 59;
/** 生产 60s；本地 dev 8s 便于快速看过期样式 */
const WECHAT_QR_TTL_SECONDS =
  process.env.NODE_ENV === "development" ? 8 : 60;
const WECHAT_SCAN_POLL_MS = 2000;
const WECHAT_QR_DEV_PRESET_KEY = "wechatQr";
/** 本地 dev：?noClinic=1 时登录成功后打开「未加入诊所」创建提示 */
const NO_CLINIC_DEV_PRESET_KEY = "noClinic";

function shouldOpenClinicSelectAfterLogin(): boolean {
  if (process.env.NODE_ENV !== "development") {
    // TODO: 登录接口返回已加入多个诊所时返回 true
    return false;
  }
  return (
    new URLSearchParams(window.location.search).get(
      CLINIC_SELECT_DEV_PRESET_KEY,
    ) === "1"
  );
}

function shouldOpenClinicCreatePromptAfterLogin(): boolean {
  if (process.env.NODE_ENV !== "development") {
    // TODO: 登录接口返回未加入诊所时返回 true
    return false;
  }
  return (
    new URLSearchParams(window.location.search).get(NO_CLINIC_DEV_PRESET_KEY) ===
    "1"
  );
}
/** 样式调完后改为 true：扫码成功 1.5s 后自动关闭弹窗 */
const WECHAT_SUCCESS_AUTO_CLOSE_ENABLED = false;

type WechatQrStatus = "active" | "expired" | "success";

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

function LoginWechatView({ onLoginComplete }: { onLoginComplete?: () => void }) {
  const [status, setStatus] = useState<WechatQrStatus>("active");
  const [qrSession, setQrSession] = useState(0);

  const handleRefresh = useCallback(() => {
    setStatus("active");
    setQrSession((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const preset = new URLSearchParams(window.location.search).get(
      WECHAT_QR_DEV_PRESET_KEY,
    );
    if (preset === "expired" || preset === "success") {
      setStatus(preset);
    }
  }, [qrSession]);

  useEffect(() => {
    if (status !== "active") return;

    const expireTimer = window.setTimeout(() => {
      setStatus("expired");
    }, WECHAT_QR_TTL_SECONDS * 1000);

    return () => window.clearTimeout(expireTimer);
  }, [status, qrSession]);

  useEffect(() => {
    if (status !== "active") return;

    const pollScanStatus = () => {
      // TODO: 接入微信扫码状态轮询，确认后 setStatus("success")
    };

    pollScanStatus();
    const pollTimer = window.setInterval(pollScanStatus, WECHAT_SCAN_POLL_MS);
    return () => window.clearInterval(pollTimer);
  }, [status, qrSession]);

  useEffect(() => {
    if (!WECHAT_SUCCESS_AUTO_CLOSE_ENABLED || status !== "success") return;

    const doneTimer = window.setTimeout(() => {
      onLoginComplete?.();
    }, 1500);

    return () => window.clearTimeout(doneTimer);
  }, [onLoginComplete, status]);

  return (
    <div className="flex w-full max-w-[280px] flex-col items-center gap-6 pt-6">
      <div className="relative size-[200px] overflow-hidden rounded-xl border border-[var(--border-light)] bg-white">
        <Image
          key={qrSession}
          src={LOGIN_QRCODE_SRC}
          alt="微信扫码登录二维码"
          width={200}
          height={200}
          className={cn(
            "size-full object-cover transition-opacity",
            status !== "active" && "opacity-40",
          )}
          unoptimized
        />

        {status === "expired" ? (
          <div
            className="absolute inset-0 flex items-center justify-center bg-white/85 pt-2"
            role="status"
            aria-live="polite"
          >
            <div className="flex flex-col items-center gap-3">
              <Button
                type="button"
                className="h-10 min-h-10 md:h-10 md:min-h-10 rounded-lg px-4 text-sm leading-[22px]"
                onClick={handleRefresh}
              >
                点击刷新
              </Button>
              <p className="text-base font-medium leading-6 text-[var(--text-base)]">
                二维码已过期
              </p>
            </div>
          </div>
        ) : null}

        {status === "success" ? (
          <div
            className="absolute inset-0 flex items-center justify-center bg-white/85 pt-2"
            role="status"
            aria-live="polite"
          >
            <div className="flex flex-col items-center gap-3">
              <Image
                src={ICON_CHECK_CIRCLE_FILL_SRC}
                alt=""
                width={48}
                height={48}
                className="size-12 shrink-0"
                aria-hidden
                unoptimized
              />
              <p className="text-base font-medium leading-6 text-[var(--text-base)]">
                扫码成功
              </p>
            </div>
          </div>
        ) : null}
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
  phoneInputRef: React.Ref<HTMLInputElement>;
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
      blurInputRef(phoneInputRef);
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
  onForgotPassword,
  onSubmit,
}: {
  phone: string;
  password: string;
  phoneError: string | null;
  phoneInputRef: React.Ref<HTMLInputElement>;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onForgotPassword: () => void;
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
            onClick={onForgotPassword}
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
  const { isOpen, close, openOptions } = useLoginModal();
  const { open: openTrialModal } = useTrialModal();
  const { open: openClinicSelectModal } = useClinicSelectModal();
  const { open: openForgotPasswordModal } = useForgotPasswordModal();
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
    handoffModal(openTrialModal, () => {
      close();
      resetForm();
    });
  }, [close, openTrialModal, resetForm]);

  const handleForgotPassword = useCallback(() => {
    const currentPhone = phone;
    close();
    resetForm();
    openForgotPasswordModal({ phone: currentPhone });
  }, [close, openForgotPasswordModal, phone, resetForm]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const lastTab = readLastLoginTab();
    setLastLoginTab(lastTab);
    setActiveTab(openOptions.tab ?? lastTab);
    resetForm();
  }, [isOpen, openOptions.tab, resetForm]);

  useEffect(() => {
    if (!isOpen || activeTab === "wechat") return;

    const timer = window.setTimeout(
      () => phoneInputRef.current?.focus({ preventScroll: true }),
      0,
    );

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

  const openClinicSelectIfNeeded = useCallback(() => {
    if (!shouldOpenClinicSelectAfterLogin()) return false;
    handoffModal(openClinicSelectModal, () => {
      close();
      resetForm();
    });
    return true;
  }, [close, openClinicSelectModal, resetForm]);

  const openClinicCreatePromptIfNeeded = useCallback(() => {
    if (!shouldOpenClinicCreatePromptAfterLogin()) return false;
    handoffModal(
      () => openTrialModal({ view: "clinic-prompt" }),
      () => {
        close();
        resetForm();
      },
    );
    return true;
  }, [close, openTrialModal, resetForm]);

  const handleCredentialSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const error = validatePhone(phone);
    if (error) {
      setPhoneError(error);
      blurInputRef(phoneInputRef);
      return;
    }
    setPhoneError(null);
    writeLastLoginTab(activeTab);
    setLastLoginTab(activeTab);
    // TODO: 接入登录接口；若已加入诊所则 openClinicSelectIfNeeded()，未加入则 openClinicCreatePromptIfNeeded()
    if (openClinicSelectIfNeeded()) return;
    if (openClinicCreatePromptIfNeeded()) return;
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (phoneError) setPhoneError(null);
  };

  const handleWechatLoginComplete = useCallback(() => {
    writeLastLoginTab("wechat");
    setLastLoginTab("wechat");
    // TODO: 接入微信扫码登录完成后的跳转或会话建立
    if (openClinicSelectIfNeeded()) return;
    if (openClinicCreatePromptIfNeeded()) return;
    handleClose();
  }, [
    handleClose,
    openClinicCreatePromptIfNeeded,
    openClinicSelectIfNeeded,
  ]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <ModalShell
      titleId={titleId}
      dialogRef={dialogRef}
      panelBgSrc={MODAL_LOGIN_PANEL_BG_SRC}
      onClose={handleClose}
      zIndex={201}
      panelVisibleFrom="lg"
      dialogClassName="md:w-[520px] md:max-w-[520px] lg:w-full lg:max-w-[900px]"
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
            <LoginWechatView onLoginComplete={handleWechatLoginComplete} />
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
              onForgotPassword={handleForgotPassword}
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
