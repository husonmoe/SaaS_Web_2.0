import Image from "next/image";
import { PageContainer, PageGrid } from "@/components/layout/PageContainer";
import { PageHeroBgLayer } from "@/components/layout/PageHeroBgLayer";
import { TrialModalButton } from "@/components/modals/TrialModalButton";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";

const LAUREL_LEFT = "/assets/figma-cache/laurel-left.svg";
const LAUREL_RIGHT = "/assets/figma-cache/laurel-right.svg";

const FEATURES = ["0 打字", "AI辅助问诊", "医保对接", "一键入库"];

const HERO_MOCKUP_SRC = "/assets/image_header.png";
const HERO_MOCKUP_WIDTH = 2034;
const HERO_MOCKUP_HEIGHT = 1320;

export function HeroSection() {
  return (
    <section className="relative isolate h-fit overflow-visible pt-8 pb-8 md:pt-[72px] md:pb-[72px] lg:pt-[calc(72px+2rem)] lg:pb-16">
      <PageHeroBgLayer />

      <PageContainer className="relative z-10">
        <PageGrid className="hero-page-grid">
          <FadeInOnScroll
            as="div"
            className="hero-page-grid-text col-span-full flex w-full flex-col items-center gap-6 text-center md:gap-10 lg:items-start lg:gap-10 lg:text-left"
          >
            <div className="flex flex-col gap-2 md:gap-5 lg:gap-6">
              <div className="flex items-center justify-center gap-1 lg:justify-start">
                <Image
                  src={LAUREL_LEFT}
                  alt=""
                  width={14}
                  height={20}
                  className="h-5 w-3.5"
                  unoptimized
                />
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-end)] bg-clip-text text-sm font-semibold text-transparent md:text-lg">
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

              <h1 className="text-[36px] font-medium leading-[52px] text-[var(--text-base)] md:text-[52px] md:leading-[68px] md:whitespace-nowrap lg:whitespace-normal">
                开诊所就用
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-end)] bg-clip-text text-transparent">
                  光谱云诊
                </span>
              </h1>

              <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm leading-[22px] text-[var(--text-base)] md:flex-nowrap md:text-xl md:leading-7 lg:flex-wrap lg:justify-start">
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

            <TrialModalButton className="h-12 min-h-12 w-32 rounded-xl px-6 text-base md:h-14 md:min-h-14 md:w-[152px] md:rounded-xl md:px-10 md:text-lg">
              免费试用
            </TrialModalButton>
          </FadeInOnScroll>

          <FadeInOnScroll
            as="div"
            className="hero-page-grid-media col-span-full mt-16 w-full max-w-[640px] shrink-0 md:mt-20 lg:mt-0 lg:max-w-[640px]"
          >
            <div className="relative mx-auto w-full max-w-[660px] lg:max-w-none">
              <Image
                src={HERO_MOCKUP_SRC}
                alt="光谱云诊产品界面预览"
                width={HERO_MOCKUP_WIDTH}
                height={HERO_MOCKUP_HEIGHT}
                className="h-auto w-full object-contain"
                priority
                sizes="(max-width: 1023px) 100vw, 58vw"
              />
            </div>
          </FadeInOnScroll>
        </PageGrid>
      </PageContainer>
    </section>
  );
}
