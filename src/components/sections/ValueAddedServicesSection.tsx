import { PageContainer } from "@/components/layout/PageContainer";
import {
  VALUE_SERVICE_COLUMNS,
  type ValueServiceItem,
} from "@/components/sections/valueServicesContent";
import { Button } from "@/components/ui/Button";
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
        sizes="(max-width: 834px) 100vw, 588px"
        unoptimized
      />
    </article>
  );
}

export function ValueAddedServicesSection() {
  return (
    <section className="bg-white py-16 md:py-[100px]">
      <PageContainer className="flex flex-col items-center gap-10 md:gap-16">
        <h2 className="max-w-[1200px] text-center text-3xl font-semibold leading-tight text-[var(--text-base)] md:text-[44px] md:leading-[56px]">
          更多增值服务
        </h2>

        <div className="grid w-full max-w-[1200px] grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {VALUE_SERVICE_COLUMNS.map((column) => (
            <div key={column.map((item) => item.id).join("-")} className="flex flex-col gap-4 md:gap-6">
              {column.map((item) => (
                <ValueServiceCard key={item.id} item={item} />
              ))}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="h-[60px] min-h-[60px] gap-1 rounded-full pl-10 pr-8 text-[var(--text-secondary)]"
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
        </Button>
      </PageContainer>
    </section>
  );
}
