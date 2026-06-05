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
    <section className="bg-white py-[60px]">
      <PageContainer className="flex flex-col items-center gap-16">
        <FadeInOnScroll
          as="h2"
          className="max-w-[1200px] text-center text-[44px] font-medium leading-[56px] text-[var(--text-base)]"
        >
          数字化升级方案
        </FadeInOnScroll>

        <div className="flex w-full max-w-[1200px] flex-col gap-6">
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
              "flex h-14 min-h-14 w-[200px] items-center justify-center gap-0.5 rounded-full border border-[var(--border-light)] bg-white pl-5 pr-3 text-base text-[var(--text-base)] transition-colors hover:bg-[var(--btn-outline-hover)] active:bg-[var(--btn-outline-active)]",
            )}
          >
            <span>查看版本对比</span>
            <Image
              src="/assets/icon_chervon_right_s.svg"
              alt=""
              width={24}
              height={24}
              className="size-6 shrink-0"
              aria-hidden
            />
          </Link>
        </FadeInOnScroll>
      </PageContainer>
    </section>
  );
}
