import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeroBgLayer } from "@/components/layout/PageHeroBgLayer";
import { OPERATIONS_GUIDE_HERO } from "@/components/sections/operations-guide/operationsGuideContent";

export function OperationsGuideHeroSection() {
  return (
    <section className="page-hero-section relative isolate overflow-visible pt-[100px] pb-16 md:pb-[100px]">
      <PageHeroBgLayer />

      <PageContainer className="relative z-10 flex flex-col items-center">
        <header className="flex max-w-[1200px] flex-col items-center gap-4 text-center">
          <h1 className="text-[36px] font-semibold leading-tight text-[var(--text-base)] md:text-[52px] md:leading-[68px]">
            {OPERATIONS_GUIDE_HERO.title}
          </h1>
          <p className="max-w-[840px] text-lg text-[var(--text-secondary)] md:text-2xl md:leading-8">
            {OPERATIONS_GUIDE_HERO.subtitle}
          </p>
        </header>
      </PageContainer>
    </section>
  );
}
