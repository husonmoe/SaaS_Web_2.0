import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { OperationsGuideHeroSection } from "@/components/sections/operations-guide/OperationsGuideHeroSection";
import { OperationsGuideListSection } from "@/components/sections/operations-guide/OperationsGuideListSection";

export const metadata: Metadata = {
  title: "运营指南—光谱云诊",
  description:
    "基层医疗运营指南：行业动态、医保政策、系统实操与标杆经验，助力诊所数字化经营。",
};

export default function OperationsGuidePage() {
  return (
    <MarketingPageShell>
      <SiteHeader />
      <main>
        <OperationsGuideHeroSection />
        <OperationsGuideListSection />
      </main>
    </MarketingPageShell>
  );
}
