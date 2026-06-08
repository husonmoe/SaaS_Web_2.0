"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { OperationsGuideArticleCard } from "@/components/sections/operations-guide/OperationsGuideArticleCard";
import {
  OPERATIONS_GUIDE_ARTICLES,
  OPERATIONS_GUIDE_PAGE_SIZE,
} from "@/components/sections/operations-guide/operationsGuideContent";
import { cn } from "@/lib/cn";
import { useState } from "react";

export function OperationsGuideListSection() {
  const [visibleCount, setVisibleCount] = useState(OPERATIONS_GUIDE_PAGE_SIZE);
  const visibleArticles = OPERATIONS_GUIDE_ARTICLES.slice(0, visibleCount);
  const hasMore = visibleCount < OPERATIONS_GUIDE_ARTICLES.length;

  return (
    <section className="operations-guide-list-section pb-12 md:pb-16">
      <PageContainer className="flex flex-col items-center gap-12 md:gap-10">
        <div className="grid w-full max-w-[1200px] grid-cols-2 items-start gap-x-3 gap-y-6 md:gap-x-6 lg:grid-cols-4 lg:gap-6">
          {visibleArticles.map((article) => (
            <OperationsGuideArticleCard key={article.id} {...article} />
          ))}
        </div>

        {hasMore ? (
          <button
            type="button"
            onClick={() =>
              setVisibleCount((count) =>
                Math.min(count + OPERATIONS_GUIDE_PAGE_SIZE, OPERATIONS_GUIDE_ARTICLES.length),
              )
            }
            className={cn(
              "flex h-14 min-h-14 w-[200px] items-center justify-center rounded-full border border-[var(--border-light)] bg-white px-5 text-base text-[var(--text-base)] transition-colors hover:bg-[var(--btn-outline-hover)] active:bg-[var(--btn-outline-active)] lg:h-[60px] lg:min-h-[60px] lg:w-auto lg:px-10 lg:text-lg",
            )}
          >
            加载更多内容
          </button>
        ) : null}
      </PageContainer>
    </section>
  );
}
