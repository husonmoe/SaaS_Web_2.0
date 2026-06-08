import { PageContainer } from "@/components/layout/PageContainer";
import { TiltCard } from "@/components/ui/TiltCard";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import Image from "next/image";

type WhyChooseItem = {
  title: string;
  lines: [string, string, string];
  iconSrc: string;
};

const WHY_CHOOSE_ITEMS: WhyChooseItem[] = [
  {
    title: "看病有把握",
    lines: [
      "智能 AI 助手辅助开方",
      "自动审核用药禁忌",
      "让医疗服务更安全",
    ],
    iconSrc: "/assets/image_product_module/icon_看病有把握.png",
  },
  {
    title: "患者留得住",
    lines: [
      "详尽记录历史就诊情况",
      "慢性病随访提醒",
      "让医患关系更稳固",
    ],
    iconSrc: "/assets/image_product_module/icon_患者留得住.png",
  },
  {
    title: "管理更高效",
    lines: [
      "覆盖全科医疗业务场景",
      "流程标准化",
      "一人也能轻松管理诊所",
    ],
    iconSrc: "/assets/image_product_module/icon_管理更高效.png",
  },
  {
    title: "合规有保障",
    lines: [
      "紧跟医保与卫健政策",
      "接口实时升级",
      "确保机构合规运行",
    ],
    iconSrc: "/assets/image_product_module/icon_合规有保障.png",
  },
];

function WhyChooseCard({ item }: { item: WhyChooseItem }) {
  return (
    <FadeInOnScroll as="div" className="h-full">
      <TiltCard className="flex h-full flex-col items-center rounded-xl px-4 py-6 text-center md:rounded-2xl md:px-6 md:py-10">
        <Image
          src={item.iconSrc}
          alt=""
          width={48}
          height={48}
          className="mb-4 size-8 shrink-0 md:mb-6 md:size-12"
          unoptimized
        />
        <h3 className="text-lg font-medium leading-[26px] text-[var(--text-base)] md:text-xl md:font-semibold md:leading-7">
          {item.title}
        </h3>
        <div className="mt-1 flex flex-col gap-0.5 whitespace-nowrap text-sm leading-[22px] text-[var(--text-secondary)] md:mt-4 md:gap-1 md:text-base md:leading-6">
          {item.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </TiltCard>
    </FadeInOnScroll>
  );
}

export function WhyChooseSection() {
  return (
    <section className="bg-[var(--bg-shell)] py-[60px] md:py-[80px] lg:py-[100px]">
      <PageContainer className="flex flex-col items-center gap-8 md:gap-16">
        <FadeInOnScroll
          as="h2"
          className="max-w-[1200px] text-center text-[28px] font-medium leading-9 text-[var(--text-base)] md:text-[44px] md:font-semibold md:leading-[56px]"
        >
          为什么选择光谱云诊
        </FadeInOnScroll>

        <div className="grid w-full max-w-[1200px] grid-cols-2 gap-3 overflow-visible md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-6">
          {WHY_CHOOSE_ITEMS.map((item) => (
            <WhyChooseCard key={item.title} item={item} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
