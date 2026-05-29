import {
  VERSION_COMPARE_TAG,
  VERSION_THEMES,
  type VersionPlan,
} from "@/components/sections/versionSchemeContent";
import Image from "next/image";

const CHECK_ICON_SRC = "/assets/icon_check.svg";

function FeatureCheck({ color }: { color: string }) {
  return (
    <span
      className="inline-block size-4 shrink-0"
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
          className="pointer-events-none absolute -top-4 right-6 z-10 h-auto w-[96px] select-none"
          unoptimized
        />
      ) : null}

      <div className="relative flex flex-1 flex-col px-6 py-8 md:px-12 md:py-8">
        <div className="flex items-center gap-2">
          <Image
            src={theme.diamondIcon}
            alt=""
            width={113}
            height={113}
            className="size-8 shrink-0 md:size-[37.5px]"
            unoptimized
          />
          <h3
            className="text-xl font-semibold leading-7 md:text-[32px] md:leading-[44px]"
            style={{ color: theme.color }}
          >
            {plan.title}
          </h3>
        </div>

        <p className="mt-2 text-sm leading-[22px] text-[var(--text-secondary)] md:text-base md:leading-6">
          {plan.subtitle}
        </p>

        <div
          className="mt-4 inline-flex h-9 w-fit items-center gap-2 rounded-full pl-4 pr-5"
          style={{ backgroundColor: theme.badgeBg }}
        >
          <Image
            src={theme.personIcon}
            alt=""
            width={48}
            height={48}
            className="size-4 shrink-0"
            unoptimized
          />
          <span className="text-base leading-6 text-[var(--text-base)]">
            专属 30 席位/店
          </span>
        </div>

        <hr className="my-6 border-[var(--border-light)]" />

        <p className="text-base leading-6 text-[var(--text-base)]">
          {plan.featuresHeader}
        </p>

        <ul className="mt-4 flex min-h-[120px] flex-col gap-2">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-3 text-base leading-6 text-[var(--text-base)]"
            >
              <FeatureCheck color={theme.color} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            className="inline-flex h-12 min-h-12 flex-1 items-center justify-center rounded-[10px] border border-[var(--border-light)] bg-white text-base leading-6 text-[var(--text-base)] transition-colors hover:bg-[var(--btn-outline-hover)] active:bg-[var(--btn-outline-active)]"
          >
            立即试用
          </button>
          <button
            type="button"
            className="inline-flex h-12 min-h-12 flex-1 items-center justify-center rounded-[10px] text-base leading-6 text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: theme.ctaBg }}
          >
            咨询购买
          </button>
        </div>
      </div>
    </article>
  );
}
