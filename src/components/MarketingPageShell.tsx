"use client";

import { FloatingToolbar } from "@/components/FloatingToolbar";
import { LoginModal } from "@/components/modals/LoginModal";
import { TrialModal } from "@/components/modals/TrialModal";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { LoginModalProvider } from "@/contexts/LoginModalContext";
import { TrialModalProvider } from "@/contexts/TrialModalContext";
import { ToastProvider } from "@/contexts/ToastContext";
import type { ReactNode } from "react";

type MarketingPageShellProps = {
  children: ReactNode;
};

/** 营销页统一外壳：Footer + 悬浮工具栏（卡位 CTA 或页脚上方 60px） */
export function MarketingPageShell({ children }: MarketingPageShellProps) {
  return (
    <ToastProvider>
      <LoginModalProvider>
        <TrialModalProvider>
          <div className="relative overflow-visible">
            {children}
            <SiteFooter />
            <FloatingToolbar />
            <LoginModal />
            <TrialModal />
          </div>
        </TrialModalProvider>
      </LoginModalProvider>
    </ToastProvider>
  );
}
