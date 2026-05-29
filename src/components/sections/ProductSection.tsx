import { PageContainer } from "@/components/layout/PageContainer";
import { ProductModuleTabs } from "@/components/sections/ProductModuleTabs";

export function ProductSection() {
  return (
    <section className="bg-[image:var(--gradient-section-product)] py-16 md:py-[100px]">
      <PageContainer className="flex flex-col items-center gap-10">
        <h2 className="max-w-[1200px] text-center text-3xl font-semibold leading-tight text-[var(--text-base)] md:text-[44px] md:leading-[56px]">
          让诊所经营更简单
        </h2>

        <ProductModuleTabs />
      </PageContainer>
    </section>
  );
}
