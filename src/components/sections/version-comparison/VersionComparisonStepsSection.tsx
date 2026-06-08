import { PageContainer } from "@/components/layout/PageContainer";
import {
  VERSION_COMPARISON_STEP_ARROW,
  VERSION_COMPARISON_STEPS,
  type VersionComparisonStep,
} from "@/components/sections/version-comparison/versionComparisonStepsContent";
// import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import { cn } from "@/lib/cn";
import Image from "next/image";
import { Fragment } from "react";

function StepItem({
  step,
  label,
  iconSrc,
  compact = false,
}: VersionComparisonStep & { compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex",
        compact
          ? "shrink-0 flex-col items-center gap-2 md:gap-3"
          : "items-center gap-4",
      )}
    >
      <Image
        src={iconSrc}
        alt=""
        width={64}
        height={64}
        className={cn("shrink-0", compact ? "size-[52px]" : "size-16")}
        unoptimized
      />
      <div
        className={cn(
          "flex flex-col",
          compact && "items-center justify-start",
        )}
      >
        <span className="text-2xl font-semibold leading-8 text-[var(--color-primary)]">
          {step}
        </span>
        <span className="text-base leading-6 text-[var(--text-base)]">
          {label}
        </span>
      </div>
    </div>
  );
}

function StepArrow({ className }: { className?: string }) {
  return (
    <Image
      src={VERSION_COMPARISON_STEP_ARROW}
      alt=""
      width={24}
      height={24}
      className={className ?? "size-6 shrink-0"}
      aria-hidden
    />
  );
}

const STEP_ROW_PAIRS = [
  VERSION_COMPARISON_STEPS.slice(0, 2),
  VERSION_COMPARISON_STEPS.slice(2, 4),
] as const;

export function VersionComparisonStepsSection() {
  return (
    <section className="bg-[var(--bg-white)] py-[60px] md:py-[40px] lg:py-[100px]">
      <PageContainer className="flex flex-col items-center gap-8 md:gap-10 lg:gap-16">
        {/* FadeInOnScroll 暂关 */}
        <div className="flex w-full flex-col items-center gap-8 md:gap-10 lg:gap-16">
          <h2 className="max-w-[1200px] text-center text-[28px] font-semibold leading-[36px] text-[var(--text-base)] md:text-[36px] md:leading-[48px] lg:text-[44px] lg:leading-[56px]">
            简单四步，开启诊所新体验
          </h2>

          {/* Mobile：2×2 网格 */}
          <div className="flex w-full max-w-[1200px] flex-col items-center gap-8 md:hidden">
            {STEP_ROW_PAIRS.map((row) => (
              <div
                key={row[0].step}
                className="flex w-full items-center justify-between gap-2 sm:justify-center sm:gap-12"
              >
                {row.map((item, index) => (
                  <Fragment key={item.step}>
                    {index > 0 ? <StepArrow /> : null}
                    <StepItem {...item} />
                  </Fragment>
                ))}
              </div>
            ))}
          </div>

          {/* Pad：单行横排 */}
          <div className="hidden w-full max-w-[1200px] flex-row items-center justify-between md:flex lg:hidden">
            {VERSION_COMPARISON_STEPS.map((item, index) => (
              <Fragment key={item.step}>
                {index > 0 ? <StepArrow /> : null}
                <StepItem {...item} compact />
              </Fragment>
            ))}
          </div>

          {/* Web：单行横排 */}
          <div className="hidden w-full max-w-[1200px] flex-col items-center gap-0 lg:flex lg:flex-row lg:justify-between">
            {VERSION_COMPARISON_STEPS.map((item, index) => (
              <Fragment key={item.step}>
                {index > 0 ? (
                  <StepArrow className="size-6 shrink-0 rotate-0" />
                ) : null}
                <StepItem {...item} />
              </Fragment>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
