import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CreateClinicFormRowProps = {
  label: string;
  children: ReactNode;
};

export function CreateClinicFormRow({ label, children }: CreateClinicFormRowProps) {
  return (
    <div className="flex w-full gap-6">
      <div className="flex h-10 w-[60px] shrink-0 items-center justify-end">
        <span className="text-right text-sm font-medium leading-[22px] text-[var(--text-base)]">
          {label}
        </span>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

type CreateClinicFieldHintProps = {
  children: ReactNode;
  error?: boolean;
  /** 不占文档流，距上方控件 4px（用于校验错误，避免推动下方元素） */
  overlay?: boolean;
};

export function CreateClinicFieldHint({
  children,
  error,
  overlay,
}: CreateClinicFieldHintProps) {
  return (
    <p
      className={cn(
        "text-sm leading-[22px]",
        error ? "text-[var(--text-error)]" : "text-[var(--text-tertiary)]",
        overlay &&
          "pointer-events-none absolute left-0 top-[calc(100%+4px)] z-10 whitespace-nowrap",
      )}
    >
      {children}
    </p>
  );
}
