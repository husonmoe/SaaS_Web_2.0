"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ModalShell } from "@/components/modals/ModalShell";
import { useLoginModal } from "@/contexts/LoginModalContext";
import {
  useTrialModal,
  type TrialModalView,
} from "@/contexts/TrialModalContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { handoffModal } from "@/lib/modalHandoff";
import { PATHS } from "@/lib/paths";
import { validatePhone } from "@/lib/validatePhone";

const LOGO_SRC = "/assets/LOGO.png";
const TRIAL_PANEL_BG_SRC = "/assets/trial-modal/trial-panel-bg.svg";
const TRIAL_PANEL_TAGS = ["0 打字", "AI辅助问诊", "医保对接", "一键入库"];
const TRIAL_PANEL_FEATURES = [
  {
    title: "在线客服",
    desc: "7 x 12 小时专属客服品质服务",
    iconSrc: "/assets/icon_在线客服.svg",
    iconBg: "bg-[rgba(115,130,244,0.08)]",
  },
  {
    title: "系统培训",
    desc: "免费专人培训，助您轻松上手系统",
    iconSrc: "/assets/icon_系统培训.svg",
    iconBg: "bg-[rgba(49,184,146,0.08)]",
  },
  {
    title: "数据搬家",
    desc: "协助数据整理、导出以及导入",
    iconSrc: "/assets/icon_数据搬家.svg",
    iconBg: "bg-[#ebf6ff]",
  },
  {
    title: "持续升级",
    desc: "系统持续升级、迭代数据自动备份",
    iconSrc: "/assets/icon_持续升级.svg",
    iconBg: "bg-[rgba(255,136,38,0.08)]",
  },
] as const;

const TRIAL_QRCODE_SRC = "/assets/modal/login_qrcode.png";
const ICON_WECHAT_SRC = "/assets/modal/icon_wechat.svg";
const ICON_SUCCESS_SRC = "/assets/modal/icon_check_circle_fill.svg";
const SERVICE_CARD_SRC = "/assets/modal/serviceCard.png";
const ICON_CLEAR_SRC = "/assets/trial-modal/icon-clear.svg";
const ICON_CHEVRON_LEFT_SRC = "/assets/icon_chervon_right_s.svg";

/** 本地 dev：?trialQr=1 自动打开扫码创建视图 */
const TRIAL_QR_DEV_PRESET_KEY = "trialQr";
/** 本地 dev：?clinicCreate=1 自动打开「未加入诊所」创建提示 */
const CLINIC_CREATE_DEV_PRESET_KEY = "clinicCreate";

function TrialModalLeftPanel() {
  return (
    <div className="relative size-full overflow-hidden bg-gradient-to-b from-[#c8dbf2] to-[#f6f9fc]">
      <Image
        src={TRIAL_PANEL_BG_SRC}
        alt=""
        fill
        className="object-cover"
        aria-hidden
        unoptimized
      />

      <div className="relative flex flex-col gap-10 px-10 pt-[50px]">
        <Image
          src={LOGO_SRC}
          alt="光谱云诊"
          width={116}
          height={32}
          className="h-8 w-auto"
          unoptimized
        />

        <div className="flex flex-col gap-2">
          <p className="text-[28px] font-medium leading-10 text-[var(--text-base)]">
            百万基层医护的共同选择
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {TRIAL_PANEL_TAGS.map((tag, index) => (
              <span key={tag} className="flex items-center gap-3">
                {index > 0 ? (
                  <span
                    className="h-3 w-px shrink-0 bg-white"
                    aria-hidden
                  />
                ) : null}
                <span className="text-sm leading-[22px] text-[var(--text-secondary)]">
                  {tag}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {TRIAL_PANEL_FEATURES.map((feature) => (
            <div key={feature.title} className="flex items-center gap-4">
              <div
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-full",
                  feature.iconBg,
                )}
              >
                <Image
                  src={feature.iconSrc}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                  aria-hidden
                  unoptimized
                />
              </div>
              <div className="flex min-w-0 flex-col">
                <p className="text-base leading-6 text-[var(--text-base)]">
                  {feature.title}
                </p>
                <p className="text-xs leading-5 text-[var(--text-secondary)]">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
          handoffModal(() => openLoginModal(), closeTrialModal);
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
  phoneInputRef: React.Ref<HTMLInputElement>;
  onPhoneChange: (value: string) => void;
  onOrgNameChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  return (
    <>
      <div className="flex w-full max-w-[280px] flex-col items-center gap-2 text-center">
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
        className="flex w-full max-w-[280px] flex-col gap-10"
        noValidate
      >
        <div className="flex flex-col gap-8">
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
            <p
              id="trial-phone-error"
              className={cn(
                "min-h-[22px] text-sm leading-[22px] text-[var(--text-error)]",
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

      <TrialModalLoginFooter />
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

/** Figma login_clinic_create：登录后未加入诊所时的创建提示 */
function TrialModalClinicPromptView({
  titleId,
  onRegister,
  onSwitchToSmsLogin,
}: {
  titleId: string;
  onRegister: () => void;
  onSwitchToSmsLogin: () => void;
}) {
  return (
    <>
      <button
        type="button"
        className="absolute left-6 top-4 flex h-10 items-center gap-1 rounded-lg border border-[var(--border-light)] bg-white py-2.5 pl-3 pr-4 text-sm leading-[22px] text-[var(--text-base)] transition-colors hover:bg-[var(--btn-outline-hover)]"
        onClick={onSwitchToSmsLogin}
      >
        <Image
          src={ICON_CHEVRON_LEFT_SRC}
          alt=""
          width={16}
          height={16}
          className="size-4 shrink-0 rotate-180"
          aria-hidden
          unoptimized
        />
        切换至手机号登录
      </button>

      <div className="flex w-full max-w-[380px] flex-1 flex-col items-center justify-center gap-12">
        <h2
          id={titleId}
          className="text-center text-2xl font-medium leading-8 text-[var(--text-base)]"
        >
          您尚未加入诊所，是否创建？
        </h2>
        <Button
          type="button"
          className="h-12 min-h-12 w-[168px] rounded-[10px] px-5"
          onClick={onRegister}
        >
          报名创建
        </Button>
      </div>
    </>
  );
}

function TrialModalQrcodeView({ titleId }: { titleId: string }) {
  return (
    <>
      <div className="flex w-full max-w-[380px] flex-1 flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center gap-2 pt-6 text-center">
          <p className="text-base leading-6 text-[var(--color-primary)]">
            您尚未加入诊所，扫码即可创建
          </p>
          <h2
            id={titleId}
            className="text-2xl font-medium leading-8 text-[var(--text-base)]"
          >
            2步创建诊所 15天免费试用
          </h2>
        </div>

        <div className="flex w-full flex-col items-center gap-6 pt-6">
          <div className="size-[200px] overflow-hidden rounded-xl border border-[var(--border-light)] bg-white">
            <Image
              src={TRIAL_QRCODE_SRC}
              alt="微信扫码创建诊所"
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
              使用「微信」扫一扫
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export function TrialModal() {
  const { isOpen, close, open, openOptions } = useTrialModal();
  const { open: openLoginModal } = useLoginModal();
  const router = useRouter();
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

  const handleSwitchToSmsLogin = useCallback(() => {
    handoffModal(
      () => openLoginModal({ tab: "sms" }),
      () => {
        close();
        resetForm();
      },
    );
  }, [close, openLoginModal, resetForm]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const params = new URLSearchParams(window.location.search);
    if (params.get(TRIAL_QR_DEV_PRESET_KEY) === "1") {
      open({ view: "qrcode" });
      return;
    }
    if (params.get(CLINIC_CREATE_DEV_PRESET_KEY) === "1") {
      open({ view: "clinic-prompt" });
    }
  }, [open]);

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

  const handleRegisterCreateClinic = useCallback(() => {
    close();
    resetForm();
    router.push(PATHS.createClinic);
  }, [close, resetForm, router]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <ModalShell
      titleId={titleId}
      dialogRef={dialogRef}
      panel={<TrialModalLeftPanel />}
      onClose={handleClose}
      contentClassName="h-fit min-h-0 gap-6 sm:gap-6 sm:pt-20 sm:pb-10"
      panelVisibleFrom="lg"
      dialogClassName="md:w-[520px] md:max-w-[520px] lg:w-full lg:max-w-[900px]"
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
      ) : view === "success" ? (
        <TrialModalSuccessView titleId={titleId} />
      ) : view === "clinic-prompt" ? (
        <TrialModalClinicPromptView
          titleId={titleId}
          onRegister={handleRegisterCreateClinic}
          onSwitchToSmsLogin={handleSwitchToSmsLogin}
        />
      ) : (
        <TrialModalQrcodeView titleId={titleId} />
      )}
    </ModalShell>,
    document.body,
  );
}
