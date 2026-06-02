"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CreateClinicFieldHint,
  CreateClinicFormRow,
} from "@/components/create-clinic/CreateClinicFormRow";
import {
  ICON_CLEAR_SRC,
  INPUT_CLASS,
  SMS_COUNTDOWN_SECONDS,
  type CreateClinicFormData,
} from "@/components/create-clinic/createClinicConstants";
import {
  validateDisplayName,
  validateSmsCode,
} from "@/components/create-clinic/createClinicValidation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { validatePhone } from "@/lib/validatePhone";

type CreateClinicBindPhoneStepProps = {
  form: CreateClinicFormData;
  onChange: (patch: Partial<CreateClinicFormData>) => void;
  onNext: () => void;
};

export function CreateClinicBindPhoneStep({
  form,
  onChange,
  onNext,
}: CreateClinicBindPhoneStepProps) {
  const displayNameRef = useRef<HTMLInputElement>(null);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [smsCodeError, setSmsCodeError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    displayNameRef.current?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = window.setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  const handleGetCode = useCallback(() => {
    const error = validatePhone(form.phone);
    if (error) {
      setPhoneError(error);
      return;
    }
    setPhoneError(null);
    // TODO: 接入发送验证码接口
    setCountdown(SMS_COUNTDOWN_SECONDS);
  }, [form.phone]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nameError = validateDisplayName(form.displayName);
    const phoneValidationError = validatePhone(form.phone);
    const codeError = validateSmsCode(form.smsCode);

    setDisplayNameError(nameError);
    setPhoneError(phoneValidationError);
    setSmsCodeError(codeError);

    if (nameError || phoneValidationError || codeError) return;

    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[480px] flex-col gap-10"
      noValidate
    >
      <div className="flex flex-col gap-6">
        <CreateClinicFormRow label="您的称呼">
          <div className="flex flex-col gap-2">
            <div className="relative">
              <input
                ref={displayNameRef}
                id="create-clinic-display-name"
                type="text"
                value={form.displayName}
                onChange={(event) => {
                  onChange({ displayName: event.target.value });
                  if (displayNameError) setDisplayNameError(null);
                }}
                placeholder="你希望患者怎么称呼你？"
                aria-invalid={displayNameError ? true : undefined}
                className={cn(
                  INPUT_CLASS,
                  displayNameError && "border-[var(--text-error)]",
                  form.displayName && "pr-10",
                )}
              />
              {form.displayName ? (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 size-5 -translate-y-1/2"
                  aria-label="清除称呼"
                  onClick={() => onChange({ displayName: "" })}
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
            <CreateClinicFieldHint error={Boolean(displayNameError)}>
              {displayNameError ??
                "限1-10中英文字符，如“李医生”，“仁爱医生”等"}
            </CreateClinicFieldHint>
          </div>
        </CreateClinicFormRow>

        <CreateClinicFormRow label="手机号码">
          <div className="flex flex-col gap-2">
            <input
              id="create-clinic-phone"
              type="tel"
              value={form.phone}
              onChange={(event) => {
                onChange({ phone: event.target.value });
                if (phoneError) setPhoneError(null);
              }}
              placeholder="输入你的手机号，作为登录账号"
              autoComplete="tel"
              aria-invalid={phoneError ? true : undefined}
              className={cn(
                INPUT_CLASS,
                phoneError && "border-[var(--text-error)]",
              )}
            />
            <CreateClinicFieldHint error={Boolean(phoneError)}>
              {phoneError ?? "输入你的手机号，作为登录账号"}
            </CreateClinicFieldHint>
          </div>
        </CreateClinicFormRow>

        <CreateClinicFormRow label="验证码">
          <div className="flex flex-col gap-2">
            <div
              className={cn(
                "flex h-10 items-center rounded-lg border bg-white transition-colors focus-within:border-[var(--color-primary)]",
                smsCodeError
                  ? "border-[var(--text-error)]"
                  : "border-[var(--border-heavy)]",
              )}
            >
              <input
                id="create-clinic-sms-code"
                type="text"
                inputMode="numeric"
                value={form.smsCode}
                onChange={(event) => {
                  onChange({ smsCode: event.target.value });
                  if (smsCodeError) setSmsCodeError(null);
                }}
                placeholder="验证码"
                autoComplete="one-time-code"
                className="min-w-0 flex-1 border-0 bg-transparent px-3 text-sm leading-[22px] text-[var(--text-base)] outline-none placeholder:text-[var(--text-quaternary)]"
              />
              <span
                className="mx-2 h-4 w-px shrink-0 bg-[var(--border-light)]"
                aria-hidden
              />
              <button
                type="button"
                disabled={countdown > 0}
                className={cn(
                  "shrink-0 px-3 text-sm leading-[22px] transition-opacity",
                  countdown > 0
                    ? "cursor-not-allowed text-[var(--text-quaternary)]"
                    : "text-[var(--color-primary)] hover:opacity-80",
                )}
                onClick={handleGetCode}
              >
                {countdown > 0 ? `${countdown}s重新获取` : "获取验证码"}
              </button>
            </div>
            <CreateClinicFieldHint error={Boolean(smsCodeError)}>
              {smsCodeError ?? "输入有效验证码"}
            </CreateClinicFieldHint>
          </div>
        </CreateClinicFormRow>
      </div>

      <CreateClinicFormRow label="">
        <Button
          type="submit"
          className="h-10 min-h-10 w-32 rounded-lg px-4 text-sm leading-[22px]"
        >
          下一步
        </Button>
      </CreateClinicFormRow>
    </form>
  );
}
