import type { Metadata } from "next";
import { CreateClinicPageContent } from "@/components/create-clinic/CreateClinicPageContent";
import { MarketingPageShell } from "@/components/MarketingPageShell";

export const metadata: Metadata = {
  title: "创建诊所—光谱云诊",
  description: "只需2步，即可创建诊所：绑定手机号并填写基本信息。",
};

export default function CreateClinicPage() {
  return (
    <MarketingPageShell hideFooter hideFloatingToolbar>
      <CreateClinicPageContent />
    </MarketingPageShell>
  );
}
