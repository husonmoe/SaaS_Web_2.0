import { PageContainer } from "@/components/layout/PageContainer";
import { VERSION_PLANS } from "@/components/sections/versionSchemeContent";
import { VERSION_COMPARISON_GROUPS } from "@/components/sections/version-comparison/versionComparisonContent";

export function VersionComparisonTableSection() {
  const hasData = VERSION_COMPARISON_GROUPS.length > 0;

  return (
    <section className="bg-[var(--bg-shell)] py-16 md:py-[100px]">
      <PageContainer className="flex flex-col items-center gap-10 md:gap-16">
        <h2 className="text-center text-3xl font-semibold leading-tight text-[var(--text-base)] md:text-[44px] md:leading-[56px]">
          各版本功能对比
        </h2>

        {!hasData ? (
          <div className="w-full max-w-[1200px] rounded-2xl border border-dashed border-[var(--border-light)] bg-white px-6 py-16 text-center">
            <p className="text-lg text-[var(--text-secondary)]">
              功能对比矩阵开发中
            </p>
            <p className="mt-2 text-sm text-[var(--text-tertiary)]">
              表头：功能 · {VERSION_PLANS.map((p) => p.title).join(" · ")}
              <br />
              含「只看差异点」筛选与各模块可折叠分组（Figma node{" "}
              <code className="text-xs">407:146496</code>）
            </p>
          </div>
        ) : null}
      </PageContainer>
    </section>
  );
}
