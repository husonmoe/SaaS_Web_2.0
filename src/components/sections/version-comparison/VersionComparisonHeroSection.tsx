import { PageContainer } from "@/components/layout/PageContainer";
import { VersionPlanCard } from "@/components/sections/VersionPlanCard";
import { VERSION_PLANS } from "@/components/sections/versionSchemeContent";

export function VersionComparisonHeroSection() {
  return (
    <section className="bg-white pt-[calc(72px+100px)] pb-16 md:pb-[100px]">
      <PageContainer className="flex flex-col items-center gap-10 md:gap-16">
        <header className="flex max-w-[1200px] flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-semibold leading-tight text-[var(--text-base)] md:text-[44px] md:leading-[56px]">
            数字化升级方案
          </h1>
          <p className="text-lg text-[var(--text-secondary)] md:text-xl">
            根据您的机构规模与经营需求，选择最合适的数字化升级方案
          </p>
        </header>

        <div className="grid w-full max-w-[1200px] grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {VERSION_PLANS.map((plan) => (
            <VersionPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
