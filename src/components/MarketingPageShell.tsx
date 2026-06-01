import { FloatingToolbar } from "@/components/FloatingToolbar";
import { SiteFooter } from "@/components/sections/SiteFooter";
import type { ReactNode } from "react";

type MarketingPageShellProps = {
  children: ReactNode;
};

/** 营销页统一外壳：Footer + 悬浮工具栏（卡位 CTA 或页脚上方 60px） */
export function MarketingPageShell({ children }: MarketingPageShellProps) {
  return (
    <div className="relative overflow-visible">
      {children}
      <SiteFooter />
      <FloatingToolbar />
    </div>
  );
}
