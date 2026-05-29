"use client";

import { FloatingToolbar } from "@/components/FloatingToolbar";
import { SiteFooter } from "@/components/sections/SiteFooter";
import type { ReactNode } from "react";

type HomePageShellProps = {
  children: ReactNode;
};

/**
 * 首页外壳：relative 定位上下文；悬浮工具栏卡位在 ActionCtaSection 上方 60px。
 */
export function HomePageShell({ children }: HomePageShellProps) {
  return (
    <div className="relative overflow-visible">
      {children}
      <SiteFooter />
      <FloatingToolbar />
    </div>
  );
}
