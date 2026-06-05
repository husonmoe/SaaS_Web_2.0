import type { OperationsGuideArticle } from "@/components/sections/operations-guide/operationsGuideContent";
import { operationsGuideDetailPath } from "@/lib/paths";
import Image from "next/image";
import Link from "next/link";

type OperationsGuideArticleCardProps = OperationsGuideArticle;

export function OperationsGuideArticleCard({
  title,
  publishedAt,
  viewCount,
  coverSrc,
  slug,
}: OperationsGuideArticleCardProps) {
  return (
    <Link
      href={operationsGuideDetailPath(slug)}
      target="_blank"
      rel="noopener noreferrer"
      className="operations-guide-article-card group flex h-fit w-full flex-col self-start overflow-hidden rounded-xl border border-[var(--border-light)] bg-[var(--bg-white)] transition-[box-shadow] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      aria-label={`阅读：${title}（新标签页打开）`}
    >
      <div className="p-2 md:p-4">
        <div className="relative aspect-[282/120] w-full overflow-hidden rounded-md">
          <Image
            src={coverSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 282px, 50vw"
            unoptimized
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 px-3 pb-3 md:gap-6 md:px-6 md:pb-4">
        <h2 className="line-clamp-2 text-sm font-medium leading-5 text-[var(--text-base)] md:text-base md:leading-6">
          {title}
        </h2>
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs leading-5 text-[var(--text-tertiary)] md:gap-4">
          <span>{publishedAt}</span>
          <span>{viewCount}人看过</span>
        </div>
      </div>
    </Link>
  );
}
