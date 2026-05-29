import { PageContainer } from "@/components/layout/PageContainer";
import { StatsCounterGrid } from "@/components/sections/StatsCounterGrid";

export function StatsSection() {
  return (
    <section className="bg-white py-16 md:py-[100px]">
      <PageContainer className="flex flex-col items-center gap-10">
        <div className="max-w-[1200px] text-center">
          <h2 className="text-3xl font-semibold leading-tight text-[var(--text-base)] md:text-[44px] md:leading-[56px]">
            资源覆盖百万基层
          </h2>
          <p className="mt-3 text-lg text-[var(--text-secondary)] md:text-2xl md:leading-8">
            药师帮团队倾心打造的新一代数字化诊所系统，为百万中小医疗机构提供软件和其它医疗技术服务。
          </p>
        </div>

        <StatsCounterGrid />
      </PageContainer>
    </section>
  );
}
