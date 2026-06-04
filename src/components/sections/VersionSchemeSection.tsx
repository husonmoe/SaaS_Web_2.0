import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { VersionPlanCard } from "@/components/sections/VersionPlanCard";
import { VERSION_PLANS } from "@/components/sections/versionSchemeContent";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import { cn } from "@/lib/cn";
import { PATHS } from "@/lib/paths";

export function VersionSchemeSection() {
  return (
    <section className="bg-white py-[60px] md:py-[100px]">
      <PageContainer className="flex flex-col items-center gap-8 md:gap-16">
        <FadeInOnScroll
          as="h2"
          className="max-w-[1200px] text-center text-[28px] font-medium leading-9 text-[var(--text-base)] md:text-[44px] md:font-semibold md:leading-[56px]"
        >
          数字化升级方案
        </FadeInOnScroll>

        <div className="grid w-full max-w-[1200px] grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {VERSION_PLANS.map((plan) => (
            <FadeInOnScroll key={plan.id} as="div">
              <VersionPlanCard plan={plan} />
            </FadeInOnScroll>
          ))}
        </div>

        <FadeInOnScroll as="div">
          <Link
            href={PATHS.versionComparison}
            className={cn(
              "inline-flex h-14 min-h-14 w-[200px] items-center justify-center gap-1 rounded-full border border-[var(--border-light)] bg-white pl-5 pr-4 text-base text-[var(--text-base)] transition-colors hover:bg-[var(--btn-outline-hover)] active:bg-[var(--btn-outline-active)] md:h-[60px] md:min-h-[60px] md:w-auto md:pl-10 md:pr-8 md:text-lg",
            )}
          >
            <span>查看版本对比</span>
            <Image
              src="/assets/icon_chervon_right_s.svg"
              alt=""
              width={24}
              height={24}
              className="size-5 shrink-0"
              aria-hidden
            />
          </Link>
        </FadeInOnScroll>
      </PageContainer>
    </section>
  );
}
