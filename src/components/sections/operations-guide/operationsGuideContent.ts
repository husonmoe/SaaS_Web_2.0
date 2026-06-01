/** 运营指南列表 · Figma node 407:168598 */

export type OperationsGuideArticle = {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  viewCount: number;
  coverSrc: string;
};

export const OPERATIONS_GUIDE_HERO = {
  title: "基层医疗运营指南",
  subtitle:
    "直击行业前沿动态、深剖医保政策法规、详解系统实操流程、共享行业标杆经验",
} as const;

const ARTICLE_TITLE =
  "分级诊疗政策落地：基层医疗成主力！明确4个重点任务";

const COVERS = [
  "/assets/operations-guide/thumb-01.png",
  "/assets/operations-guide/thumb-02.png",
  "/assets/operations-guide/thumb-03.png",
  "/assets/operations-guide/thumb-04.png",
  "/assets/operations-guide/thumb-05.png",
  "/assets/operations-guide/thumb-06.png",
  "/assets/operations-guide/thumb-07.png",
  "/assets/operations-guide/thumb-08.png",
  "/assets/operations-guide/thumb-09.png",
  "/assets/operations-guide/thumb-10.png",
  "/assets/operations-guide/thumb-11.png",
  "/assets/operations-guide/thumb-12.png",
] as const;

/** 设计稿首屏 16 条；后续批次用于「加载更多」演示 */
export const OPERATIONS_GUIDE_ARTICLES: OperationsGuideArticle[] = [
  ...Array.from({ length: 16 }, (_, index) => ({
    id: `article-${index + 1}`,
    slug: `article-${index + 1}`,
    title: ARTICLE_TITLE,
    publishedAt: "2026-04-27",
    viewCount: 123,
    coverSrc: COVERS[index % COVERS.length],
  })),
  ...Array.from({ length: 8 }, (_, index) => ({
    id: `article-${index + 17}`,
    slug: `article-${index + 17}`,
    title: ARTICLE_TITLE,
    publishedAt: "2026-04-20",
    viewCount: 98,
    coverSrc: COVERS[(index + 4) % COVERS.length],
  })),
];

export const OPERATIONS_GUIDE_PAGE_SIZE = 16;
