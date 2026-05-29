"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { ProductPreview } from "@/components/sections/ProductPreview";
import { PRODUCT_TAB_CONTENT } from "@/components/sections/productModuleContent";

export function ProductModuleTabs() {
  const [activeId, setActiveId] = useState(PRODUCT_TAB_CONTENT[0].id);
  const activeContent =
    PRODUCT_TAB_CONTENT.find((tab) => tab.id === activeId) ??
    PRODUCT_TAB_CONTENT[0];

  return (
    <div className="flex w-full max-w-[1200px] flex-col items-center gap-10">
      <div className="w-full overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className="mx-auto flex w-max min-w-0 gap-2 rounded-2xl bg-[var(--bg-shell)] p-2"
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
                  "h-11 shrink-0 rounded-xl px-4 text-base leading-7 transition-colors md:h-[52px] md:px-6 md:text-xl md:leading-7",
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
      </div>

      <div
        className="w-full"
        role="tabpanel"
        aria-label={activeContent.label}
      >
        <ProductPreview key={activeContent.id} content={activeContent} />
      </div>
    </div>
  );
}
