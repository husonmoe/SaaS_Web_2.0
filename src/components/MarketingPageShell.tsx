"use client";

import { FloatingToolbar } from "@/components/FloatingToolbar";
import { LoginModal } from "@/components/modals/LoginModal";
import { TrialModal } from "@/components/modals/TrialModal";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { LoginModalProvider, useLoginModal } from "@/contexts/LoginModalContext";
import { TrialModalProvider, useTrialModal } from "@/contexts/TrialModalContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import type { ReactNode } from "react";

type MarketingPageShellProps = {
  children: ReactNode;
};

function BodyScrollLock() {
  const { isOpen: loginOpen } = useLoginModal();
  const { isOpen: trialOpen } = useTrialModal();

  useBodyScrollLock(loginOpen || trialOpen);

  return null;
}

/** 营销页统一外壳：Footer + 悬浮工具栏（卡位 CTA 或页脚上方 60px） */
export function MarketingPageShell({ children }: MarketingPageShellProps) {
  return (
    <ToastProvider>
      <LoginModalProvider>
        <TrialModalProvider>
          <BodyScrollLock />
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
