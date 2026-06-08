"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type {
  ProductFeature,
  ProductFeatureMedia,
  ProductTabContent,
  HeadlinePart,
} from "@/components/sections/productModuleContent";
import {
  DEFAULT_APP_IMAGE,
  getProductTabMediaSrcs,
} from "@/components/sections/productModuleContent";

const AUTO_PLAY_INTERVAL_MS = 5000;
/** 180° 翻转：装饰性动效建议 500–700ms，便于感知方向变化 */
const FEATURE_ICON_TRANSITION_MS = 500;
const SWIPE_THRESHOLD_PX = 48;

const PREVIEW_MEDIA_CLASS =
  "block h-auto max-h-[500px] w-full rounded-xl object-contain object-left";

const PREVIEW_IMAGE_CLASS = cn(
  PREVIEW_MEDIA_CLASS,
  "origin-center transition-transform duration-300 ease-out motion-reduce:transition-none hover:scale-[1.05] motion-reduce:hover:scale-100",
);

function prefetchImageSrcs(srcs: string[]) {
  for (const src of srcs) {
    const img = new Image();
    img.src = encodeURI(src);
  }
}

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
        src={encodeURI(media.src)}
        alt={alt}
        loading="eager"
        decoding="async"
        className={PREVIEW_IMAGE_CLASS}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={media.src}
      src={encodeURI(media.src)}
      alt={alt}
      width={2388}
      height={1500}
      loading="eager"
      fetchPriority="high"
      decoding="async"
      className={PREVIEW_IMAGE_CLASS}
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
        <p className="text-base font-medium leading-6 text-[var(--text-base)] lg:text-xl lg:leading-7">
          {feature.title}
        </p>
        <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)] lg:text-base lg:leading-6">
          {feature.description}
        </p>
      </div>
    </button>
  );
}

/** 仅作当前页同步示意，不可点击 */
function ProductPreviewDots({
  count,
  activeIndex,
}: {
  count: number;
  activeIndex: number;
}) {
  if (count <= 1) return null;

  return (
    <div
      className="mb-4 flex items-center justify-center gap-1 pt-4 lg:hidden"
      aria-hidden
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={cn(
            "product-preview-dot shrink-0",
            index === activeIndex
              ? "product-preview-dot--active"
              : "product-preview-dot--inactive",
          )}
        />
      ))}
    </div>
  );
}

function ProductPreviewHeadline({ content }: { content: ProductTabContent }) {
  return (
    <div className="text-center text-2xl font-medium leading-7 text-[var(--text-base)]">
      <p className="mb-0">
        <HeadlineLine part={content.headline[0]} />
      </p>
      <p className="mb-0">
        <HeadlineLine part={content.headline[1]} />
      </p>
    </div>
  );
}

function MobilePreviewSlide({
  feature,
  media,
  alt,
}: {
  feature: ProductFeature;
  media: ProductFeatureMedia;
  alt: string;
}) {
  return (
    <div className="flex w-full shrink-0 flex-col gap-4">
      <div className="relative h-fit overflow-hidden bg-[image:var(--gradient-section-product)]">
        <div className="relative h-fit max-h-[500px] w-full overflow-hidden rounded-xl">
          <FeaturePreviewMedia media={media} alt={alt} />
        </div>
      </div>

      <div className="flex flex-col gap-1 text-left">
        <p className="text-lg font-medium leading-[26px] text-[var(--text-base)]">
          {feature.title}
        </p>
        <p className="text-sm leading-[22px] text-[var(--text-secondary)]">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

type ProductPreviewProps = {
  content: ProductTabContent;
};

export function ProductPreview({ content }: ProductPreviewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStartXRef = useRef<number | null>(null);
  const featureCount = content.features.length;

  const activeFeature = content.features[activeIndex] ?? content.features[0];
  const previewAlt = `光谱云诊${content.label} · ${activeFeature?.title ?? ""}`;
  const featureMedias = content.features.map((feature) => ({
    title: feature.title,
    media: resolveFeatureMedia(content, feature),
    alt: `光谱云诊${content.label} · ${feature.title}`,
  }));
  const fallbackMedia: ProductFeatureMedia = {
    type: "image",
    src: content.appImage ?? DEFAULT_APP_IMAGE,
  };

  const goToIndex = useCallback(
    (index: number) => {
      if (featureCount <= 0) return;
      setActiveIndex(((index % featureCount) + featureCount) % featureCount);
    },
    [featureCount],
  );

  const goNext = useCallback(() => {
    goToIndex(activeIndex + 1);
  }, [activeIndex, goToIndex]);

  const goPrev = useCallback(() => {
    goToIndex(activeIndex - 1);
  }, [activeIndex, goToIndex]);

  const finishPointerSwipe = useCallback(
    (clientX: number) => {
      const startX = pointerStartXRef.current;
      pointerStartXRef.current = null;
      if (startX == null || featureCount <= 1) return;

      const deltaX = clientX - startX;
      if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;

      if (deltaX < 0) goNext();
      else goPrev();
    },
    [featureCount, goNext, goPrev],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (featureCount <= 1) return;
    pointerStartXRef.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    finishPointerSwipe(event.clientX);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerCancel = () => {
    pointerStartXRef.current = null;
  };

  useEffect(() => {
    prefetchImageSrcs(getProductTabMediaSrcs(content));
  }, [content]);

  useEffect(() => {
    setActiveIndex(0);
  }, [content.id]);

  useEffect(() => {
    if (featureCount <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featureCount);
    }, AUTO_PLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [featureCount, content.id]);

  return (
    <>
      <div className="relative z-10 hidden flex-col gap-4 lg:flex lg:flex-row lg:items-start lg:gap-16">
        <div className="flex w-full shrink-0 flex-col items-center text-center lg:w-[340px] lg:items-start lg:text-left">
          <div className="text-[32px] font-semibold leading-[44px] text-[var(--text-base)] lg:pt-[26px]">
            <p className="mb-0">
              <HeadlineLine part={content.headline[0]} />
            </p>
            <p>
              <HeadlineLine part={content.headline[1]} />
            </p>
          </div>

          <div className="mt-12 flex w-full flex-col gap-9">
            {content.features.map((feature, index) => (
              <FeatureItem
                key={feature.title}
                feature={feature}
                isActive={index === activeIndex}
                onSelect={() => goToIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="relative min-h-[500px] flex-1 overflow-hidden bg-[image:var(--gradient-section-product)] lg:max-w-[796px]">
          <div
            key={content.id}
            className="relative min-h-[500px] max-h-[500px] overflow-hidden rounded-3xl"
          >
            {featureMedias.length > 0 ? (
              featureMedias.map((item, index) => (
                <div
                  key={item.title}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-300 ease-out",
                    index === activeIndex
                      ? "z-10 opacity-100"
                      : "z-0 pointer-events-none opacity-0",
                  )}
                  aria-hidden={index !== activeIndex}
                >
                  <FeaturePreviewMedia media={item.media} alt={item.alt} />
                </div>
              ))
            ) : (
              <FeaturePreviewMedia media={fallbackMedia} alt={previewAlt} />
            )}
          </div>
        </div>
      </div>

      {featureCount > 0 ? (
        <div
          key={content.id}
          className="animate-product-preview-in motion-reduce:animate-none w-full lg:hidden"
        >
          <ProductPreviewHeadline content={content} />

          <div className="relative mt-4 min-h-0 overflow-visible">
            <div
              className="w-full touch-pan-y select-none overflow-hidden cursor-grab active:cursor-grabbing"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              aria-live="polite"
              aria-atomic
            >
              <div
                className="product-preview-mobile-track flex h-fit w-full"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {content.features.map((feature, index) => {
                  const media =
                    featureMedias[index]?.media ?? fallbackMedia;
                  const alt =
                    featureMedias[index]?.alt ??
                    `光谱云诊${content.label} · ${feature.title}`;

                  return (
                    <MobilePreviewSlide
                      key={feature.title}
                      feature={feature}
                      media={media}
                      alt={alt}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <ProductPreviewDots count={featureCount} activeIndex={activeIndex} />
    </>
  );
}
