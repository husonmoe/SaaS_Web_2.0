import { PageContainer } from "@/components/layout/PageContainer";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import { CustomerCasesMapPanel } from "@/components/sections/CustomerCasesMapPanel";
import { CustomerCasesMobileMarquee } from "@/components/sections/CustomerCasesMobileMarquee";
import { CustomerCasesScroller } from "@/components/sections/CustomerCasesScroller";

export function CustomerCasesSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-shell)] py-[60px] md:py-[100px]">
      <div className="customer-cases-bg-layer" aria-hidden />

      <PageContainer className="relative z-10 flex flex-col items-center gap-8 md:gap-16">
        <FadeInOnScroll
          as="h2"
          className="max-w-[1200px] text-center text-[28px] font-medium leading-9 text-[var(--text-base)] md:text-[44px] md:font-semibold md:leading-[56px]"
        >
          百万基层医护的共同选择
        </FadeInOnScroll>

        <div className="grid w-full max-w-[1200px] grid-cols-1 items-start gap-10 lg:h-[520px] lg:grid-cols-2 lg:gap-16 lg:items-stretch">
          <CustomerCasesMapPanel />

          <CustomerCasesMobileMarquee />

          <div className="hidden lg:block lg:h-[520px] lg:max-h-[520px] lg:w-[384px] lg:shrink-0 lg:justify-self-end lg:overflow-hidden">
            <CustomerCasesScroller />
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
