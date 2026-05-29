import { PageContainer } from "@/components/layout/PageContainer";
import { VersionPlanCard } from "@/components/sections/VersionPlanCard";
import { VERSION_PLANS } from "@/components/sections/versionSchemeContent";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export function VersionSchemeSection() {
  return (
    <section className="bg-white py-16 md:py-[100px]">
      <PageContainer className="flex flex-col items-center gap-10 md:gap-16">
        <h2 className="max-w-[1200px] text-center text-3xl font-semibold leading-tight text-[var(--text-base)] md:text-[44px] md:leading-[56px]">
          数字化升级方案
        </h2>

        <div className="grid w-full max-w-[1200px] grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {VERSION_PLANS.map((plan) => (
            <VersionPlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        <Button variant="outline" className="gap-1 rounded-full px-8">
          查看版本对比
          <Image
            src="/assets/icon_chervon_right_s.svg"
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0"
            aria-hidden
          />
        </Button>
      </PageContainer>
    </section>
  );
}
