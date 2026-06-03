import { PageContainer } from "@/components/layout/PageContainer";
import { VersionComparisonMatrix } from "@/components/sections/version-comparison/VersionComparisonMatrix";
// import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";

export function VersionComparisonTableSection() {
  return (
    <section className="bg-[var(--bg-white)] py-16 md:py-[100px]">
      <PageContainer className="flex flex-col items-center gap-10 md:gap-16">
        {/* FadeInOnScroll 暂关 */}
        <h2 className="text-center text-3xl font-semibold leading-tight text-[var(--text-base)] md:text-[44px] md:leading-[56px]">
          各版本功能对比
        </h2>

        <VersionComparisonMatrix />
      </PageContainer>
    </section>
  );
}
