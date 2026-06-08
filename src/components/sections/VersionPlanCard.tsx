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
      className="inline-block size-3 shrink-0"
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
      className="version-plan-card relative flex flex-col rounded-2xl"
      style={{ background: theme.cardGradient }}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
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
          className="pointer-events-none absolute top-4 -right-2 z-10 h-8 w-[72px] select-none"
          unoptimized
        />
      ) : null}

      <div className="relative flex flex-1 flex-col px-8 py-6">
        <div className="flex gap-10">
          <div className="flex w-[180px] shrink-0 flex-col">
            <div className="flex items-center gap-1.5">
              <Image
                src={theme.diamondIcon}
                alt=""
                width={113}
                height={113}
                className="size-8 shrink-0"
                unoptimized
              />
              <h3
                className="text-2xl font-semibold leading-8"
                style={{ color: theme.color }}
              >
                {plan.title}
              </h3>
            </div>

            <p className="mt-1 text-base leading-6 text-[var(--text-secondary)]">
              {plan.subtitle}
            </p>

            <div
              className="mt-3 inline-flex h-fit w-fit items-start justify-start rounded-lg px-2 py-2"
              style={{ backgroundColor: theme.badgeBg }}
            >
              <span className="text-sm leading-[18px] text-[var(--text-base)]">
                专属 30 席位/店
              </span>
            </div>
          </div>

          <div
            className="w-px shrink-0 self-stretch bg-[var(--border-light)]"
            aria-hidden
          />

          <div className="flex flex-1 flex-col">
            <p className="text-base font-medium leading-6 text-[var(--text-base)]">
              {plan.featuresHeader}
            </p>

            <ul className="mt-2 flex flex-col gap-1.5">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm leading-[22px] text-[var(--text-secondary)]"
                >
                  <FeatureCheck color={theme.color} />
                  <span className="whitespace-nowrap">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 hidden gap-3">
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
