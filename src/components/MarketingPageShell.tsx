import { SiteFooter } from "@/components/sections/SiteFooter";
import type { ReactNode } from "react";

type MarketingPageShellProps = {
  children: ReactNode;
};

/** 内页外壳：顶栏由页面自行引入，底部统一 Footer */
export function MarketingPageShell({ children }: MarketingPageShellProps) {
  return (
    <div className="relative overflow-visible">
      {children}
      <SiteFooter />
    </div>
  );
}
