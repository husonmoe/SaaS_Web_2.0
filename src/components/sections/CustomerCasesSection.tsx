import { PageContainer } from "@/components/layout/PageContainer";
import { CustomerCaseCard } from "@/components/sections/CustomerCaseCard";
import { CustomerCasesMapPanel } from "@/components/sections/CustomerCasesMapPanel";
import { CustomerCasesScroller } from "@/components/sections/CustomerCasesScroller";
import { CUSTOMER_CASES } from "@/components/sections/customerCasesContent";

export function CustomerCasesSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-shell)] py-16 md:py-[100px]">
      <div className="customer-cases-bg-layer" aria-hidden />

      <PageContainer className="relative z-10 flex flex-col items-center gap-10 md:gap-16">
        <h2 className="max-w-[1200px] text-center text-3xl font-semibold leading-tight text-[var(--text-base)] md:text-[44px] md:leading-[56px]">
          百万基层医护的共同选择
        </h2>

        <div className="grid w-full max-w-[1200px] grid-cols-1 items-start gap-10 lg:h-[520px] lg:grid-cols-2 lg:gap-16 lg:items-stretch">
          <CustomerCasesMapPanel />

          <div className="flex flex-col gap-4 lg:hidden">
            {CUSTOMER_CASES.map((item) => (
              <CustomerCaseCard key={item.id} {...item} />
            ))}
          </div>

          <div className="hidden lg:block lg:h-[520px] lg:max-h-[520px] lg:w-[384px] lg:shrink-0 lg:justify-self-end lg:overflow-hidden">
            <CustomerCasesScroller />
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
