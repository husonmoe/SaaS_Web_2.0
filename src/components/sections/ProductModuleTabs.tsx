"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { ProductPreview } from "@/components/sections/ProductPreview";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import {
  PRODUCT_TAB_CONTENT,
  getAllProductModuleMediaSrcs,
} from "@/components/sections/productModuleContent";

function prefetchAllProductImages() {
  const srcs = getAllProductModuleMediaSrcs();
  for (const src of srcs) {
    const img = new Image();
    img.src = encodeURI(src);
  }
}

export function ProductModuleTabs() {
  const [activeId, setActiveId] = useState(PRODUCT_TAB_CONTENT[0].id);

  useEffect(() => {
    const run = () => prefetchAllProductImages();
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(run, 400);
    return () => window.clearTimeout(id);
  }, []);
  const activeContent =
    PRODUCT_TAB_CONTENT.find((tab) => tab.id === activeId) ??
    PRODUCT_TAB_CONTENT[0];

  return (
    <div className="flex w-full max-w-[1200px] flex-col items-center gap-6 md:gap-10">
      <FadeInOnScroll
        as="div"
        className="w-full overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          className="mx-auto flex w-full min-w-0 items-start justify-start gap-0 rounded-lg bg-[var(--bg-shell)] p-0.5 md:justify-between md:gap-2 md:rounded-2xl md:p-2 lg:w-max lg:justify-start"
          role="tablist"
          aria-label="产品模块"
        >
          {PRODUCT_TAB_CONTENT.map((tab) => {
            const isActive = activeId === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(tab.id)}
                className={cn(
                  "flex h-9 w-full min-w-0 flex-1 items-center justify-center rounded-md px-0 text-sm leading-[22px] transition-colors md:h-[52px] md:min-w-0 md:flex-1 md:shrink md:rounded-xl md:px-4 md:text-base md:leading-6 lg:w-auto lg:flex-none lg:shrink-0 lg:px-6",
                  isActive
                    ? "bg-[image:var(--gradient-primary)] font-medium text-white"
                    : "font-normal text-[var(--text-base)] hover:bg-white/80",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </FadeInOnScroll>

      <FadeInOnScroll as="div" className="w-full">
        <div role="tabpanel" aria-label={activeContent.label}>
          <ProductPreview key={activeContent.id} content={activeContent} />
        </div>
      </FadeInOnScroll>
    </div>
  );
}
