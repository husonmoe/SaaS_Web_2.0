import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeroBgLayer } from "@/components/layout/PageHeroBgLayer";
import { OPERATIONS_GUIDE_HERO } from "@/components/sections/operations-guide/operationsGuideContent";

export function OperationsGuideHeroSection() {
  return (
    <section className="page-hero-section operations-guide-hero-section relative isolate overflow-visible pt-[60px] pb-[60px] md:pb-[100px] lg:pt-[100px] lg:pb-16">
      <PageHeroBgLayer />

      <PageContainer className="relative z-10 flex flex-col items-center">
        <header className="flex max-w-[1200px] flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-semibold leading-[38px] text-[var(--text-base)] md:text-[52px] md:leading-[68px]">
            {OPERATIONS_GUIDE_HERO.title}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] md:text-xl lg:max-w-[840px] lg:text-2xl lg:leading-8">
            {OPERATIONS_GUIDE_HERO.subtitle}
          </p>
        </header>
      </PageContainer>
    </section>
  );
}
