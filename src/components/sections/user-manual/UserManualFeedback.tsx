"use client";

import { cn } from "@/lib/cn";
import Image from "next/image";
import { useState } from "react";

const THUMB_ICON = "/assets/user-manual/icon-thumb.svg";
const SUCCESS_ICON = "/assets/user-manual/icon-check-circle.svg";

const FEEDBACK_SHELL_CLASS =
  "mx-auto flex w-full max-w-[1200px] rounded-xl bg-[var(--bg-shell)] px-4 py-3 lg:h-[88px] lg:items-center lg:px-8 lg:py-0";

type FeedbackValue = "helpful" | "unsolved" | null;

export function UserManualFeedback() {
  const [value, setValue] = useState<FeedbackValue>(null);

  if (value !== null) {
    return (
      <div className={cn(FEEDBACK_SHELL_CLASS, "h-fit items-center gap-2")}>
        <Image
          src={SUCCESS_ICON}
          alt=""
          width={24}
          height={24}
          className="size-6 shrink-0"
          aria-hidden
          unoptimized
        />
        <p className="text-xl font-medium leading-7 text-[var(--text-base)]">
          感谢您的反馈。
        </p>
      </div>
    );
  }

  return (
    <div className={cn(FEEDBACK_SHELL_CLASS, "h-fit flex-col gap-3 lg:flex-row lg:justify-between lg:gap-6")}>
      <p className="shrink-0 text-center text-xl font-medium leading-7 text-[var(--text-base)] lg:text-left">
        内容是否有帮助？
      </p>
      <div className="flex w-full items-center justify-center gap-3 lg:w-auto lg:shrink-0">
        <FeedbackButton
          label="有帮助"
          selected={value === "helpful"}
          onClick={() => setValue("helpful")}
        />
        <FeedbackButton
          label="未解决"
          selected={value === "unsolved"}
          flipIcon
          onClick={() => setValue("unsolved")}
        />
      </div>
    </div>
  );
}

function FeedbackButton({
  label,
  selected,
  flipIcon,
  onClick,
}: {
  label: string;
  selected: boolean;
  flipIcon?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 w-full items-center justify-center gap-1 rounded-lg border border-[var(--border-light)] bg-[var(--bg-white)] px-4 text-sm leading-[22px] text-[var(--text-base)] transition-colors hover:bg-[var(--user-manual-chip-hover)] lg:min-w-[108px] lg:w-auto",
        selected && "border-[var(--color-primary)] bg-[var(--user-manual-chip-hover)]",
      )}
    >
      <Image
        src={THUMB_ICON}
        alt=""
        width={16}
        height={16}
        className={cn("size-4", flipIcon && "scale-y-[-1]")}
        aria-hidden
        unoptimized
      />
      {label}
    </button>
  );
}
