import type { Metadata } from "next";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { VersionComparisonHeroSection } from "@/components/sections/version-comparison/VersionComparisonHeroSection";
import { VersionComparisonTableSection } from "@/components/sections/version-comparison/VersionComparisonTableSection";
import { VersionComparisonStepsSection } from "@/components/sections/version-comparison/VersionComparisonStepsSection";
import { VersionComparisonFaqSection } from "@/components/sections/version-comparison/VersionComparisonFaqSection";

export const metadata: Metadata = {
  title: "版本对比—光谱云诊",
  description:
    "对比光谱云诊基础版、医保版、专业版功能差异，选择适合您诊所的数字化升级方案。",
};

export default function VersionComparisonPage() {
  return (
    <MarketingPageShell>
      <SiteHeader />
      <main>
        <VersionComparisonHeroSection />
        <VersionComparisonTableSection />
        <VersionComparisonStepsSection />
        <VersionComparisonFaqSection />
      </main>
    </MarketingPageShell>
  );
}
