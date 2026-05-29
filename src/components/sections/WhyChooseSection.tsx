import { PageContainer } from "@/components/layout/PageContainer";
import { TiltCard } from "@/components/ui/TiltCard";
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
    <TiltCard className="flex flex-col items-center px-6 py-10 text-center">
      <Image
        src={item.iconSrc}
        alt=""
        width={48}
        height={48}
        className="mb-6 size-12 shrink-0"
        unoptimized
      />
      <h3 className="text-xl font-semibold leading-7 text-[var(--text-base)]">
        {item.title}
      </h3>
      <div className="mt-4 flex flex-col gap-1 text-base leading-6 text-[var(--text-secondary)]">
        {item.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </TiltCard>
  );
}

export function WhyChooseSection() {
  return (
    <section className="bg-[var(--bg-shell)] py-16 md:py-[100px]">
      <PageContainer className="flex flex-col items-center gap-16">
        <h2 className="max-w-[1200px] text-center text-3xl font-semibold leading-tight text-[var(--text-base)] md:text-[44px] md:leading-[56px]">
          为什么选择光谱云诊
        </h2>

        <div className="grid w-full max-w-[1200px] grid-cols-1 gap-4 overflow-visible sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {WHY_CHOOSE_ITEMS.map((item) => (
            <WhyChooseCard key={item.title} item={item} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
