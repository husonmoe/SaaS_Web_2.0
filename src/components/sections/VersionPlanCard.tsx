"use client";

import {
  VERSION_COMPARE_TAG,
  VERSION_THEMES,
  type VersionPlan,
} from "@/components/sections/versionSchemeContent";
import { useTrialModal } from "@/contexts/TrialModalContext";
import Image from "next/image";

const CHECK_ICON_SRC = "/assets/icon_check.svg";

function FeatureCheck({ color }: { color: string }) {
  return (
    <span
      className="inline-block size-3 shrink-0 md:size-4"
      style={{
        backgroundColor: color,
        mask: `url(${CHECK_ICON_SRC}) center / contain no-repeat`,
        WebkitMask: `url(${CHECK_ICON_SRC}) center / contain no-repeat`,
      }}
      aria-hidden
    />
  );
}

export function VersionPlanCard({ plan }: { plan: VersionPlan }) {
  const { open: openTrialModal } = useTrialModal();
  const theme = VERSION_THEMES[plan.theme];

  return (
    <article
      className="version-plan-card relative flex flex-col rounded-2xl md:rounded-3xl"
      style={{ background: theme.cardGradient }}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl md:rounded-3xl"
        aria-hidden
      >
        <Image
          src={theme.texture}
          alt=""
          width={960}
          height={465}
          className="absolute right-0 top-0 h-auto w-[min(100%,240px)] select-none object-cover object-right-top"
          unoptimized
        />
      </div>

      {plan.recommended ? (
        <Image
          src={VERSION_COMPARE_TAG}
          alt="推荐版本"
          width={288}
          height={123}
          className="pointer-events-none absolute top-4 -right-2 z-10 h-8 w-[72px] select-none md:-top-4 md:right-6 md:h-auto md:w-[96px]"
          unoptimized
        />
      ) : null}

      <div className="relative flex flex-1 flex-col px-4 py-4 md:px-12 md:py-8">
        <div className="flex gap-3 md:flex-col md:gap-0">
          <div className="flex w-[120px] shrink-0 flex-col md:w-auto">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Image
                src={theme.diamondIcon}
                alt=""
                width={113}
                height={113}
                className="size-5 shrink-0 md:size-[37.5px]"
                unoptimized
              />
              <h3
                className="text-xl font-semibold leading-[28px] md:text-[32px] md:leading-[44px]"
                style={{ color: theme.color }}
              >
                {plan.title}
              </h3>
            </div>

            <p className="mt-1 text-sm leading-[22px] text-[var(--text-secondary)] md:mt-2 md:text-base md:leading-6">
              {plan.subtitle}
            </p>

            <div
              className="mt-3 inline-flex h-fit w-fit items-start justify-start rounded-lg px-2 py-2 md:mt-4 md:h-fit md:px-4 md:py-2"
              style={{ backgroundColor: theme.badgeBg }}
            >
              <span className="text-xs leading-[14px] text-[var(--text-base)] md:text-base md:leading-6">
                专属 30 席位/店
              </span>
            </div>
          </div>

          <div
            className="w-px shrink-0 self-stretch bg-[var(--border-light)] md:my-6 md:h-px md:w-full md:self-auto"
            aria-hidden
          />

          <div className="flex flex-1 flex-col md:flex-none">
            <p className="text-sm font-medium leading-[22px] text-[var(--text-base)] md:text-base md:font-normal md:leading-6">
              {plan.featuresHeader}
            </p>

            <ul className="mt-2 flex flex-col gap-1.5 md:mt-4 md:min-h-[120px] md:gap-2">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm leading-[22px] text-[var(--text-secondary)] md:gap-3 md:text-base md:leading-6"
                >
                  <FeatureCheck color={theme.color} />
                  <span className="whitespace-nowrap">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 hidden gap-3 md:flex">
          <button
            type="button"
            className="inline-flex h-12 min-h-12 flex-1 items-center justify-center rounded-[10px] border border-[var(--border-light)] bg-white text-base leading-6 text-[var(--text-base)] transition-colors hover:bg-[var(--btn-outline-hover)] active:bg-[var(--btn-outline-active)]"
            onClick={() => openTrialModal()}
          >
            立即试用
          </button>
          <button
            type="button"
            className="inline-flex h-12 min-h-12 flex-1 items-center justify-center rounded-[10px] text-base leading-6 text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: theme.ctaBg }}
            onClick={() => openTrialModal()}
          >
            咨询购买
          </button>
        </div>
      </div>
    </article>
  );
}
