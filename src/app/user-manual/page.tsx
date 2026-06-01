import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { UserManualPageContent } from "@/components/sections/user-manual/UserManualPageContent";

export const metadata: Metadata = {
  title: "用户手册—光谱云诊",
  description:
    "光谱云诊全模块使用指南：系统安装、客户端下载、登录方式与日常业务操作说明。",
};

export default function UserManualPage() {
  return (
    <MarketingPageShell>
      <SiteHeader />
      <main>
        <UserManualPageContent />
      </main>
    </MarketingPageShell>
  );
}
