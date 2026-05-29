import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
};

export function PageContainer({
  children,
  className,
  as: Tag = "div",
}: PageContainerProps) {
  return <Tag className={cn("page-container", className)}>{children}</Tag>;
}

type PageGridProps = {
  children: ReactNode;
  className?: string;
};

export function PageGrid({ children, className }: PageGridProps) {
  return <div className={cn("page-grid", className)}>{children}</div>;
}
