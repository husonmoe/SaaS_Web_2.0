"use client";

import { useEffect, useRef, useState } from "react";
import { PageContainer, PageGrid } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import { useTrialModal } from "@/contexts/TrialModalContext";
import { ACTION_CTA_SECTION_ID } from "@/lib/floating-toolbar-anchor";
import Image from "next/image";

const ACTION_MOCKUP_SRC = "/assets/image_action/image_action.png";
const PHONE_ICON_SRC = "/assets/image_action/icon_telephone.svg";

function centerInputInVisualViewport(input: HTMLInputElement) {
  const viewport = window.visualViewport;
  if (!viewport) {
    input.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
    return;
  }

  const rect = input.getBoundingClientRect();
  const visibleCenterY = viewport.offsetTop + viewport.height / 2;
  const inputCenterY = rect.top + rect.height / 2;
  window.scrollBy({ top: inputCenterY - visibleCenterY, behavior: "smooth" });
}

export function ActionCtaSection() {
  const { open } = useTrialModal();
  const [phone, setPhone] = useState("");
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const viewport = window.visualViewport;
    const input = phoneInputRef.current;
    if (!viewport || !input) return;

    const handleViewportResize = () => {
      if (document.activeElement === input) {
        centerInputInVisualViewport(input);
      }
    };

    viewport.addEventListener("resize", handleViewportResize);
    return () => viewport.removeEventListener("resize", handleViewportResize);
  }, []);

  const handleTrialClick = () => {
    open({ phone: phone.trim() });
  };

  return (
    <section
      id={ACTION_CTA_SECTION_ID}
      className="relative h-fit overflow-hidden py-0 lg:h-[264px]"
    >
      <div className="action-cta-bg-layer" aria-hidden />

      <PageContainer className="relative z-10 h-fit w-full py-8 md:py-0 lg:h-full lg:py-0">
        <FadeInOnScroll as="div" className="h-fit lg:h-full">
          <PageGrid className="action-cta-grid h-fit items-start gap-10 md:h-fit md:items-stretch lg:h-full lg:items-stretch lg:gap-12">
          <div className="col-span-full flex flex-col items-start justify-center gap-6 self-stretch md:h-fit md:py-8 lg:col-span-5 lg:h-full lg:gap-8 lg:py-0">
            <div className="flex flex-col gap-2 lg:gap-3">
              <h2 className="text-2xl font-semibold leading-8 text-[var(--text-base)] lg:text-[28px] lg:leading-[36px]">
                体验光谱云诊
              </h2>
              <p className="max-w-[520px] text-sm leading-[22px] text-[var(--text-secondary)] md:line-clamp-2 lg:line-clamp-none lg:text-base lg:leading-6">
                提供结构化智能病历模版、语音输入和常用模版功能，让医生数分钟内即可完成高质量病历，把更多时间还给患者。
              </p>
            </div>

            <div className="flex h-12 w-full max-w-[480px] flex-row items-stretch gap-2 md:max-w-[360px] md:gap-3 lg:h-auto lg:max-w-[480px] lg:gap-3">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">手机号</span>
                <Image
                  src={PHONE_ICON_SRC}
                  alt=""
                  width={20}
                  height={20}
                  className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 lg:left-4"
                  aria-hidden
                  unoptimized
                />
                <input
                  ref={phoneInputRef}
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  onFocus={() => {
                    const input = phoneInputRef.current;
                    if (!input) return;
                    window.setTimeout(() => centerInputInVisualViewport(input), 300);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleTrialClick();
                    }
                  }}
                  placeholder="请输入手机号"
                  autoComplete="tel"
                  className="h-12 w-full rounded-lg border border-[var(--border-light)] bg-white pl-9 pr-2 text-base leading-6 text-[var(--text-base)] outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus:border-[var(--color-primary)] lg:rounded-xl lg:pl-11 lg:pr-4"
                />
              </label>
              <Button
                type="button"
                className="h-12 min-h-12 w-[100px] shrink-0 rounded-lg px-4 text-sm leading-[22px] md:w-[88px] lg:h-12 lg:min-h-12 lg:w-[152px] lg:rounded-xl lg:px-8 lg:text-base lg:leading-6"
                onClick={handleTrialClick}
              >
                免费试用
              </Button>
            </div>
          </div>

          <div className="col-span-full hidden shrink-0 md:flex md:h-full md:w-[320px] md:items-end md:justify-end lg:col-span-7 lg:h-full lg:w-auto lg:justify-end">
            <div className="relative mx-auto flex h-full w-full max-w-[486px] shrink-0 flex-col items-center justify-end lg:mx-0 lg:w-[486px] lg:max-w-[486px]">
              <Image
                src={ACTION_MOCKUP_SRC}
                alt="光谱云诊多终端产品界面"
                width={1458}
                height={792}
                className="h-full w-full object-contain object-bottom lg:h-auto lg:object-contain"
                sizes="(max-width: 1023px) 320px, 486px"
              />
            </div>
          </div>
          </PageGrid>
        </FadeInOnScroll>
      </PageContainer>
    </section>
  );
}
