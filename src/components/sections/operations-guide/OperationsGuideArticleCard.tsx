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
      className="operations-guide-article-card group flex flex-col overflow-hidden rounded-2xl border border-[var(--border-light)] bg-[var(--bg-white)] transition-[box-shadow] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      aria-label={`阅读：${title}（新标签页打开）`}
    >
      <div className="p-4">
        <div className="relative aspect-[282/120] w-full overflow-hidden rounded-md">
          <Image
            src={coverSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 282px, (min-width: 640px) 50vw, 100vw"
            unoptimized
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 px-6 pb-4">
        <h2 className="line-clamp-2 text-base font-medium leading-6 text-[var(--text-base)]">
          {title}
        </h2>
        <div className="flex gap-4 text-xs leading-5 text-[var(--text-tertiary)]">
          <span>{publishedAt}</span>
          <span>{viewCount}人看过</span>
        </div>
      </div>
    </Link>
  );
}
