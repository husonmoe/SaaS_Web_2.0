"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { ProductFeature, ProductTabContent, HeadlinePart } from "@/components/sections/productModuleContent";
import {
  DEFAULT_APP_IMAGE,
} from "@/components/sections/productModuleContent";

function headlineColorClass(color: "primary" | "base") {
  return color === "primary"
    ? "text-[var(--color-primary)]"
    : "text-[var(--text-base)]";
}

function HeadlineLine({ part }: { part: HeadlinePart }) {
  return (
    <>
      {part.segments.map((segment, index) => (
        <span
          key={index}
          className={headlineColorClass(segment.color ?? "base")}
        >
          {segment.text}
        </span>
      ))}
    </>
  );
}

function AiFeatureIcon({
  isActive,
  animateColor,
}: {
  isActive: boolean;
  animateColor?: boolean;
}) {
  return (
    <svg
      className={cn(
        "size-4 shrink-0",
        animateColor
          ? "animate-feature-icon-color"
          : cn(
              "transition-colors duration-300",
              isActive
                ? "text-[var(--color-primary-end)]"
                : "text-[var(--color-primary-soft)]",
            ),
      )}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M7.62198 0.283299C7.73245 -0.0944331 8.26755 -0.094433 8.37802 0.283299L9.43336 3.89198C9.81043 5.18133 10.8187 6.18957 12.108 6.56664L15.7167 7.62198C16.0944 7.73245 16.0944 8.26755 15.7167 8.37802L12.108 9.43336C10.8187 9.81043 9.81043 10.8187 9.43336 12.108L8.37802 15.7167C8.26755 16.0944 7.73245 16.0944 7.62198 15.7167L6.56664 12.108C6.18957 10.8187 5.18133 9.81043 3.89198 9.43336L0.283299 8.37802C-0.0944331 8.26755 -0.094433 7.73245 0.283299 7.62198L3.89198 6.56664C5.18133 6.18957 6.18957 5.18133 6.56664 3.89198L7.62198 0.283299Z"
        fill="currentColor"
      />
    </svg>
  );
}

function resolveFeatureImage(
  content: ProductTabContent,
  feature: ProductFeature,
): string {
  return feature.image ?? content.appImage ?? DEFAULT_APP_IMAGE;
}

function FeatureItem({
  feature,
  isActive,
  onSelect,
}: {
  feature: ProductFeature;
  isActive: boolean;
  onSelect: () => void;
}) {
  const [spinTick, setSpinTick] = useState(0);
  const [animateColor, setAnimateColor] = useState(false);

  const triggerSpin = (activating = false) => {
    setAnimateColor(activating);
    setSpinTick((tick) => tick + 1);
  };

  const handleSpinEnd = () => {
    setAnimateColor(false);
  };

  return (
    <button
      type="button"
      onClick={() => {
        triggerSpin(!isActive);
        onSelect();
      }}
      className="group flex w-full gap-3 text-left"
    >
      <div className="flex h-7 items-center">
        <span
          key={spinTick}
          onAnimationEnd={handleSpinEnd}
          className={cn(
            "inline-flex origin-center",
            spinTick > 0 && "animate-feature-icon-spin",
          )}
        >
          <AiFeatureIcon isActive={isActive} animateColor={animateColor} />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xl font-medium leading-7 text-[var(--text-base)]">
          {feature.title}
        </p>
        <p className="mt-1 text-base leading-6 text-[var(--text-secondary)]">
          {feature.description}
        </p>
      </div>
    </button>
  );
}

type ProductPreviewProps = {
  content: ProductTabContent;
};

export function ProductPreview({ content }: ProductPreviewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFeature = content.features[activeIndex] ?? content.features[0];
  const previewImage = activeFeature
    ? resolveFeatureImage(content, activeFeature)
    : (content.appImage ?? DEFAULT_APP_IMAGE);

  return (
    <div className="relative min-h-[500px] overflow-visible">
      <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        {/* 左：文案（Figma 130:13005 · w340） */}
        <div className="flex w-full shrink-0 flex-col lg:w-[340px]">
          <div className="pt-[26px] text-[32px] font-semibold leading-[44px] text-[var(--text-base)]">
            <p className="mb-0">
              <HeadlineLine part={content.headline[0]} />
            </p>
            <p>
              <HeadlineLine part={content.headline[1]} />
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-9">
            {content.features.map((feature, index) => (
              <FeatureItem
                key={feature.title}
                feature={feature}
                isActive={index === activeIndex}
                onSelect={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* 右：功能预览图（Figma 97:41742 · 796×500） */}
        <div className="relative min-h-[280px] flex-1 lg:min-h-[500px] lg:max-w-[796px]">
          <Image
            key={previewImage}
            src={previewImage}
            alt={`光谱云诊${content.label} · ${activeFeature?.title ?? ""}`}
            width={2388}
            height={1500}
            quality={95}
            className="h-auto w-full rounded-3xl object-contain object-left lg:h-[500px]"
            sizes="(max-width: 1024px) 100vw, 796px"
          />
        </div>
      </div>
    </div>
  );
}
