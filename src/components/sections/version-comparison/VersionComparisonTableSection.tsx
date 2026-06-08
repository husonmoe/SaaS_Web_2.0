import { PageContainer } from "@/components/layout/PageContainer";
import { VersionComparisonMatrix } from "@/components/sections/version-comparison/VersionComparisonMatrix";
// import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";

export function VersionComparisonTableSection() {
  return (
    <section className="bg-[var(--bg-white)] py-[60px] md:py-[80px] lg:py-[100px]">
      <PageContainer className="flex flex-col items-center gap-10 md:gap-10 lg:gap-16">
        {/* FadeInOnScroll 暂关 */}
        <h2 className="text-center text-[28px] font-semibold leading-[36px] text-[var(--text-base)] md:text-[36px] md:leading-[48px] lg:text-[44px] lg:leading-[56px]">
          各版本功能对比
        </h2>

        <VersionComparisonMatrix />
      </PageContainer>
    </section>
  );
}
