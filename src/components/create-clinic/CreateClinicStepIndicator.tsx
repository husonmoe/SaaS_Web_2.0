import { cn } from "@/lib/cn";
import Image from "next/image";
import { ICON_CHECK_SRC } from "@/components/create-clinic/createClinicConstants";

type CreateClinicStepIndicatorProps = {
  step: 1 | 2;
};

export function CreateClinicStepIndicator({ step }: CreateClinicStepIndicatorProps) {
  const step1Completed = step === 2;

  return (
    <div className="flex w-full max-w-[800px] items-center justify-center gap-6 rounded-xl bg-[#f9fafc] px-10 py-6 md:gap-6 md:px-40">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-6 items-center justify-center rounded-full",
            step1Completed
              ? "border-[1.5px] border-[var(--color-primary)] bg-white"
              : "bg-[var(--color-primary)]",
          )}
        >
          {step1Completed ? (
            <Image
              src={ICON_CHECK_SRC}
              alt=""
              width={14}
              height={14}
              className="size-3.5"
              aria-hidden
              unoptimized
            />
          ) : (
            <span className="text-base font-semibold leading-6 text-white">1</span>
          )}
        </span>
        <span
          className={cn(
            "text-base leading-6",
            step1Completed || step === 1
              ? "text-[var(--text-base)]"
              : "text-[var(--text-secondary)]",
          )}
        >
          绑定手机号
        </span>
      </div>

      <span className="h-px w-24 shrink-0 bg-[var(--border-light)] md:w-40" aria-hidden />

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-6 items-center justify-center rounded-full text-base font-semibold leading-6",
            step === 2
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--border-light)] text-[var(--text-tertiary)]",
          )}
        >
          2
        </span>
        <span
          className={cn(
            "text-base leading-6",
            step === 2 ? "text-[var(--text-base)]" : "text-[var(--text-secondary)]",
          )}
        >
          填写基本信息
        </span>
      </div>
    </div>
  );
}
