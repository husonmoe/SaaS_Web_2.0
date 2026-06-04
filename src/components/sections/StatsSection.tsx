import { PageContainer } from "@/components/layout/PageContainer";
import { StatsCounterGrid } from "@/components/sections/StatsCounterGrid";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import { cn } from "@/lib/cn";

export function StatsSection() {
  return (
    <section className="bg-white py-[60px] md:py-[100px]">
      <PageContainer
        className={cn("flex h-fit flex-col items-center lg:items-start")}
      >
        <FadeInOnScroll
          as="div"
          className={cn(
            "flex w-full max-w-[1200px] flex-col items-center gap-8 lg:items-start lg:gap-16",
          )}
        >
          <div
            className={cn(
              "flex flex-col items-center text-center lg:items-start lg:text-left",
            )}
          >
            <h2 className="text-[28px] font-semibold leading-[36px] text-[var(--text-base)] md:text-[44px] md:leading-[56px]">
              资源覆盖百万基层
            </h2>
            <p className="mt-3 text-xs leading-5 text-[var(--text-secondary)] md:text-xl md:leading-7">
              药师帮团队倾心打造的新一代数字化诊所系统，为百万中小医疗机构提供软件和其它医疗技术服务。
            </p>
          </div>

          <StatsCounterGrid />
        </FadeInOnScroll>
      </PageContainer>
    </section>
  );
}
