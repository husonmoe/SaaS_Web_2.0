"use client";

import { FloatingToolbar } from "@/components/FloatingToolbar";
import { ClinicSelectModal } from "@/components/modals/ClinicSelectModal";
import { ForgotPasswordModal } from "@/components/modals/ForgotPasswordModal";
import { LoginModal } from "@/components/modals/LoginModal";
import { TrialModal } from "@/components/modals/TrialModal";
import { WechatBindModal } from "@/components/modals/WechatBindModal";
import { SiteFooter } from "@/components/sections/SiteFooter";
import {
  ForgotPasswordModalProvider,
  useForgotPasswordModal,
} from "@/contexts/ForgotPasswordModalContext";
import {
  ClinicSelectModalProvider,
  useClinicSelectModal,
} from "@/contexts/ClinicSelectModalContext";
import { LoginModalProvider, useLoginModal } from "@/contexts/LoginModalContext";
import { TrialModalProvider, useTrialModal } from "@/contexts/TrialModalContext";
import {
  WechatBindModalProvider,
  useWechatBindModal,
} from "@/contexts/WechatBindModalContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import type { ReactNode } from "react";

type MarketingPageShellProps = {
  children: ReactNode;
  hideFooter?: boolean;
  hideFloatingToolbar?: boolean;
};

function BodyScrollLock() {
  const { isOpen: loginOpen } = useLoginModal();
  const { isOpen: trialOpen } = useTrialModal();
  const { isOpen: clinicSelectOpen } = useClinicSelectModal();
  const { isOpen: forgotOpen } = useForgotPasswordModal();
  const { isOpen: bindWechatOpen } = useWechatBindModal();

  useBodyScrollLock(
    loginOpen || trialOpen || clinicSelectOpen || forgotOpen || bindWechatOpen,
  );

  return null;
}

/** 营销页统一外壳：Footer + 悬浮工具栏（卡位 CTA 或页脚上方 60px） */
export function MarketingPageShell({
  children,
  hideFooter = false,
  hideFloatingToolbar = false,
}: MarketingPageShellProps) {
  return (
    <ToastProvider>
      <LoginModalProvider>
        <ClinicSelectModalProvider>
          <TrialModalProvider>
            <ForgotPasswordModalProvider>
              <WechatBindModalProvider>
                <BodyScrollLock />
                <div className="relative overflow-visible">
                  {children}
                  {hideFooter ? null : <SiteFooter />}
                  {hideFloatingToolbar ? null : <FloatingToolbar />}
                  <LoginModal />
                  <ClinicSelectModal />
                  <TrialModal />
                  <ForgotPasswordModal />
                  <WechatBindModal />
                </div>
              </WechatBindModalProvider>
            </ForgotPasswordModalProvider>
          </TrialModalProvider>
        </ClinicSelectModalProvider>
      </LoginModalProvider>
    </ToastProvider>
  );
}
