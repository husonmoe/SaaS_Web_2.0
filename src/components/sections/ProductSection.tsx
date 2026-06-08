import { PageContainer } from "@/components/layout/PageContainer";
import { ProductModuleTabs } from "@/components/sections/ProductModuleTabs";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";

export function ProductSection() {
  return (
    <section className="bg-[image:var(--gradient-section-product)] py-[60px] md:py-[100px]">
      <PageContainer className="flex flex-col items-center gap-8 md:gap-10">
        <FadeInOnScroll
          as="h2"
          className="max-w-[1200px] text-center text-[28px] font-medium leading-9 text-[var(--text-base)] md:text-[44px] md:font-semibold md:leading-[56px]"
        >
          让诊所经营更简单
        </FadeInOnScroll>

        <ProductModuleTabs />
      </PageContainer>
    </section>
  );
}
