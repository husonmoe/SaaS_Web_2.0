import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-12 min-h-12 items-center justify-center rounded-[10px] px-5 text-base font-normal leading-6 md:h-12",
        variant === "primary" &&
          "bg-[image:var(--gradient-primary)] text-white transition-opacity hover:opacity-90",
        variant === "outline" &&
          "border border-[var(--border-light)] bg-white text-[var(--text-base)] transition-colors hover:bg-[var(--btn-outline-hover)] active:bg-[var(--btn-outline-active)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
