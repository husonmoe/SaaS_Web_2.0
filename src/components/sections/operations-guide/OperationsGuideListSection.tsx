"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { OperationsGuideArticleCard } from "@/components/sections/operations-guide/OperationsGuideArticleCard";
import {
  OPERATIONS_GUIDE_ARTICLES,
  OPERATIONS_GUIDE_PAGE_SIZE,
} from "@/components/sections/operations-guide/operationsGuideContent";
import { useState } from "react";

export function OperationsGuideListSection() {
  const [visibleCount, setVisibleCount] = useState(OPERATIONS_GUIDE_PAGE_SIZE);
  const visibleArticles = OPERATIONS_GUIDE_ARTICLES.slice(0, visibleCount);
  const hasMore = visibleCount < OPERATIONS_GUIDE_ARTICLES.length;

  return (
    <section className="pb-12 md:pb-16">
      <PageContainer className="flex flex-col items-center gap-12 md:gap-16">
        <div className="grid w-full max-w-[1200px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
            className="inline-flex h-[60px] min-w-[188px] items-center justify-center rounded-full border border-[var(--border-light)] bg-[var(--bg-white)] px-10 text-lg leading-[26px] text-[var(--text-base)] transition-colors hover:bg-[var(--btn-outline-hover)] active:bg-[var(--btn-outline-active)]"
          >
            加载更多内容
          </button>
        ) : null}
      </PageContainer>
    </section>
  );
}
