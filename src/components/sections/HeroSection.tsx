import Image from "next/image";
import { PageContainer, PageGrid } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";

const LAUREL_LEFT = "/assets/figma-cache/laurel-left.svg";
const LAUREL_RIGHT = "/assets/figma-cache/laurel-right.svg";

const FEATURES = ["0 打字", "AI辅助问诊", "医保对接", "一键入库"];

const HERO_MOCKUP_SRC = "/assets/image_header.png";

export function HeroSection() {
  return (
    <section className="relative -mt-[72px] overflow-hidden pt-[calc(72px+2rem)] pb-16 md:pt-[calc(72px+3rem)] md:pb-24">
      {/* 背景图 bg_header.png：延伸至透明顶栏下方 */}
      <div className="hero-header-bg-layer" aria-hidden />

      <PageContainer className="relative z-10">
        <PageGrid className="items-center">
          <div className="col-span-full flex flex-col gap-10 lg:col-span-5">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-1">
                <Image
                  src={LAUREL_LEFT}
                  alt=""
                  width={14}
                  height={20}
                  className="h-5 w-3.5"
                  unoptimized
                />
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-end)] bg-clip-text text-lg font-semibold text-transparent">
                  药师帮旗下
                </span>
                <Image
                  src={LAUREL_RIGHT}
                  alt=""
                  width={14}
                  height={20}
                  className="h-5 w-3.5 rotate-180"
                  unoptimized
                />
              </div>

              <h1 className="text-[36px] font-medium leading-tight text-[var(--text-base)] md:text-[52px] md:leading-[68px]">
                开诊所就用
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-end)] bg-clip-text text-transparent">
                  光谱云诊
                </span>
              </h1>

              <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 text-lg text-[var(--text-base)] md:text-xl">
                {FEATURES.map((item, i) => (
                  <li key={item} className="flex items-center gap-3">
                    {i > 0 && (
                      <span
                        className="h-3 w-px bg-[var(--border-light)]"
                        aria-hidden
                      />
                    )}
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Button className="h-14 w-[152px] rounded-xl px-10 text-lg">
              免费试用
            </Button>
          </div>

          <div className="col-span-full lg:col-span-7">
            <div className="relative mx-auto w-full max-w-[680px] lg:max-w-none">
              <Image
                src={HERO_MOCKUP_SRC}
                alt="光谱云诊产品界面预览"
                width={2416}
                height={1686}
                className="h-auto w-full object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
          </div>
        </PageGrid>
      </PageContainer>
    </section>
  );
}
