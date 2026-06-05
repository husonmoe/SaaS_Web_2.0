import { PageContainer } from "@/components/layout/PageContainer";
import {
  VALUE_SERVICE_COLUMNS,
  type ValueServiceItem,
} from "@/components/sections/valueServicesContent";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import Image from "next/image";

function ValueServiceCard({ item }: { item: ValueServiceItem }) {
  return (
    <article className="overflow-hidden rounded-2xl md:rounded-3xl">
      <Image
        src={item.imageSrc}
        alt={`光谱云诊 · ${item.title}`}
        width={item.width}
        height={item.height}
        className="h-auto w-full"
        sizes="(max-width: 767px) 100vw, 588px"
        unoptimized
      />
    </article>
  );
}

export function ValueAddedServicesSection() {
  return (
    <section className="bg-white py-[60px] md:py-[80px]">
      <PageContainer className="flex flex-col items-center gap-8 md:gap-16">
        <FadeInOnScroll
          as="h2"
          className="max-w-[1200px] text-center text-[28px] font-medium leading-9 text-[var(--text-base)] md:text-[44px] md:font-semibold md:leading-[56px]"
        >
          更多进阶服务
        </FadeInOnScroll>

        <div className="flex w-full max-w-[1200px] flex-col gap-4 md:gap-6">
          {VALUE_SERVICE_COLUMNS.map((column) => (
            <div key={column.map((item) => item.id).join("-")} className="flex flex-col gap-4 md:gap-6">
              {column.map((item) => (
                <FadeInOnScroll key={item.id} as="div">
                  <ValueServiceCard item={item} />
                </FadeInOnScroll>
              ))}
            </div>
          ))}
        </div>

        {/* 暂无「了解功能详情」落地页，恢复时取消注释并重新 import Button */}
        {/* <Button
          variant="outline"
          className="h-[60px] min-h-[60px] gap-1 rounded-full pl-10 pr-8 text-[var(--text-secondary)] md:h-[60px] md:min-h-[60px]"
        >
          <span className="text-[var(--text-secondary)]">了解功能详情</span>
          <Image
            src="/assets/icon_chervon_right_s.svg"
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0"
            aria-hidden
          />
        </Button> */}
      </PageContainer>
    </section>
  );
}
