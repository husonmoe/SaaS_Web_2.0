import { HomePageShell } from "@/components/HomePageShell";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProductSection } from "@/components/sections/ProductSection";
import { CustomerCasesSection } from "@/components/sections/CustomerCasesSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ActionCtaSection } from "@/components/sections/ActionCtaSection";
import { ValueAddedServicesSection } from "@/components/sections/ValueAddedServicesSection";
import { VersionSchemeSection } from "@/components/sections/VersionSchemeSection";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { StatsSection } from "@/components/sections/StatsSection";
import { WhyChooseSection } from "@/components/sections/WhyChooseSection";

export default function HomePage() {
  return (
    <HomePageShell>
      <SiteHeader />
      <main>
        <HeroSection />
        <StatsSection />
        <WhyChooseSection />
        <ProductSection />
        <ValueAddedServicesSection />
        <VersionSchemeSection />
        <CustomerCasesSection />
        <FaqSection />
        <ActionCtaSection />
      </main>
    </HomePageShell>
  );
}
