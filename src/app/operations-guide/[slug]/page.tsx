import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { OperationsGuideDetailSection } from "@/components/sections/operations-guide/OperationsGuideDetailSection";
import {
  getOperationsGuideArticleDetail,
  getOperationsGuideArticleSlugs,
} from "@/components/sections/operations-guide/operationsGuideDetailContent";
import { SiteHeader } from "@/components/sections/SiteHeader";

type OperationsGuideDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getOperationsGuideArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: OperationsGuideDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getOperationsGuideArticleDetail(slug);

  if (!article) {
    return { title: "文章未找到—光谱云诊" };
  }

  return {
    title: `${article.title}—光谱云诊`,
    description: article.summary,
  };
}

export default async function OperationsGuideDetailPage({
  params,
}: OperationsGuideDetailPageProps) {
  const { slug } = await params;
  const article = getOperationsGuideArticleDetail(slug);

  if (!article) {
    notFound();
  }

  return (
    <MarketingPageShell>
      <SiteHeader />
      <main>
        <OperationsGuideDetailSection article={article} />
      </main>
    </MarketingPageShell>
  );
}
