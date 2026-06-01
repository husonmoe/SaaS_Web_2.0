"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type {
  ProductFeature,
  ProductFeatureMedia,
  ProductTabContent,
  HeadlinePart,
} from "@/components/sections/productModuleContent";
import { DEFAULT_APP_IMAGE } from "@/components/sections/productModuleContent";

const AUTO_PLAY_INTERVAL_MS = 5000;
/** 180° 翻转：装饰性动效建议 500–700ms，便于感知方向变化 */
const FEATURE_ICON_TRANSITION_MS = 500;

const PREVIEW_MEDIA_CLASS =
  "block h-auto max-h-[500px] w-full rounded-3xl object-contain object-left";

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

function AiFeatureIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg
      className={cn(
        "size-4 shrink-0",
        isActive
          ? "text-[var(--color-primary-end)]"
          : "text-[var(--color-primary-soft)]",
      )}
      style={{
        transition: `color ${FEATURE_ICON_TRANSITION_MS}ms ease-in-out`,
      }}
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

function resolveFeatureMedia(
  content: ProductTabContent,
  feature: ProductFeature,
): ProductFeatureMedia {
  if (feature.media) return feature.media;

  const src = feature.image ?? content.appImage ?? DEFAULT_APP_IMAGE;
  return { type: "image", src };
}

function FeaturePreviewMedia({
  media,
  alt,
}: {
  media: ProductFeatureMedia;
  alt: string;
}) {
  if (media.type === "video") {
    return (
      <video
        key={media.src}
        src={media.src}
        poster={media.poster}
        autoPlay
        loop
        muted
        playsInline
        className={PREVIEW_MEDIA_CLASS}
        aria-label={alt}
      />
    );
  }

  if (media.type === "gif") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={media.src}
        src={media.src}
        alt={alt}
        className={PREVIEW_MEDIA_CLASS}
      />
    );
  }

  return (
    // 静态 PNG 直连 public，避免 Cloudflare 上 /_next/image 失败；用原生 img 避免宽高属性撑破布局
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={media.src}
      src={media.src}
      alt={alt}
      width={2388}
      height={1500}
      loading="lazy"
      decoding="async"
      className={PREVIEW_MEDIA_CLASS}
    />
  );
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
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex w-full gap-3 text-left"
    >
      <div className="flex h-7 items-center">
        <span
          className={cn(
            "inline-flex origin-center motion-reduce:transition-none",
            isActive ? "rotate-0" : "rotate-180",
          )}
          style={{
            transition: `transform ${FEATURE_ICON_TRANSITION_MS}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`,
          }}
        >
          <AiFeatureIcon isActive={isActive} />
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
  const previewMedia = activeFeature
    ? resolveFeatureMedia(content, activeFeature)
    : {
        type: "image" as const,
        src: content.appImage ?? DEFAULT_APP_IMAGE,
      };
  const previewAlt = `光谱云诊${content.label} · ${activeFeature?.title ?? ""}`;

  useEffect(() => {
    setActiveIndex(0);
  }, [content.id]);

  useEffect(() => {
    if (content.features.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % content.features.length);
    }, AUTO_PLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [content.features.length, content.id, activeIndex]);

  return (
    <div className="relative min-h-[500px] overflow-visible">
      <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
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

        <div className="relative min-h-[280px] flex-1 lg:min-h-[500px] lg:max-w-[796px]">
          <div
            key={`${content.id}-${activeIndex}`}
            className="animate-product-preview-in motion-reduce:animate-none"
          >
            <FeaturePreviewMedia media={previewMedia} alt={previewAlt} />
          </div>
        </div>
      </div>
    </div>
  );
}
