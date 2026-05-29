import { PageContainer, PageGrid } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { ACTION_CTA_SECTION_ID } from "@/lib/floating-toolbar-anchor";
import Image from "next/image";

const ACTION_MOCKUP_SRC = "/assets/image_action/image_action.png";
const PHONE_ICON_SRC = "/assets/image_action/icon_telephone.svg";

export function ActionCtaSection() {
  return (
    <section
      id={ACTION_CTA_SECTION_ID}
      className="relative h-[264px] overflow-hidden py-0"
    >
      <div className="action-cta-bg-layer" aria-hidden />

      <PageContainer className="relative z-10 h-full py-0">
        <PageGrid className="h-full items-start gap-10 lg:gap-12">
          <div className="col-span-full flex h-full flex-col items-start justify-center gap-6 self-stretch lg:col-span-5 lg:gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-[28px] font-semibold leading-[36px] text-[var(--text-base)]">
                体验光谱云诊
              </h2>
              <p className="max-w-[520px] text-base leading-6 text-[var(--text-secondary)] md:text-lg md:leading-7">
                提供结构化智能病历模版、语音输入和常用模版功能，让医生数分钟内即可完成高质量病历，把更多时间还给患者。
              </p>
            </div>

            <div className="flex w-full max-w-[480px] flex-col gap-3 sm:flex-row sm:items-stretch">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">手机号</span>
                <Image
                  src={PHONE_ICON_SRC}
                  alt=""
                  width={20}
                  height={20}
                  className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2"
                  aria-hidden
                  unoptimized
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="请输入手机号"
                  className="h-12 w-full rounded-xl border border-[var(--border-light)] bg-white pl-11 pr-4 text-base leading-6 text-[var(--text-base)] outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus:border-[var(--color-primary)]"
                  autoComplete="tel"
                />
              </label>
              <Button className="h-12 shrink-0 rounded-xl px-8 sm:w-[152px]">
                免费试用
              </Button>
            </div>
          </div>

          <div className="col-span-full lg:col-span-7 lg:flex lg:justify-end">
            <div className="relative mx-auto w-full max-w-[486px] shrink-0 lg:mx-0 lg:w-[486px] lg:max-w-[486px]">
              <Image
                src={ACTION_MOCKUP_SRC}
                alt="光谱云诊多终端产品界面"
                width={1458}
                height={792}
                className="h-auto w-full object-contain"
                sizes="(max-width: 1199px) 100vw, 486px"
              />
            </div>
          </div>
        </PageGrid>
      </PageContainer>
    </section>
  );
}
