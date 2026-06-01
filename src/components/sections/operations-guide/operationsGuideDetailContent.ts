import type { OperationsGuideArticle } from "@/components/sections/operations-guide/operationsGuideContent";
import { OPERATIONS_GUIDE_ARTICLES } from "@/components/sections/operations-guide/operationsGuideContent";

export type OperationsGuideArticleSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  imageSrc?: string;
};

export type OperationsGuideArticleDetail = OperationsGuideArticle & {
  summary: string;
  authorMeta: string;
  sections: OperationsGuideArticleSection[];
  closingParagraphs: string[];
};

const DETAIL_IMAGES = {
  queueScreen: "/assets/operations-guide/detail-01.png",
  labDevice: "/assets/operations-guide/detail-02.png",
  todoReminder: "/assets/operations-guide/detail-03.png",
  commissionReport: "/assets/operations-guide/detail-04.png",
} as const;

/** 详情页正文 · Figma node 407:168863 */
export const OPERATIONS_GUIDE_ARTICLE_DETAIL: Omit<
  OperationsGuideArticleDetail,
  keyof OperationsGuideArticle
> = {
  summary:
    "本章节将指引您完成光谱云诊客户端的下载、环境配置与首次登录，开启智能诊疗第一步。",
  authorMeta: "小管家 光谱云诊 2026年4月30日 17:08广东",
  sections: [
    {
      id: "queue-screen",
      heading: "01 叫号大屏来了！候诊秩序一键上屏",
      paragraphs: [
        "本期我们上线了叫号大屏系统，并支持语音叫号。",
        "在电视上安装 APK，选择要绑定的诊所，完成配对。",
        "完成后，电视屏幕会实时展示当前诊室 + 接诊医生、当前就诊患者（姓名 + 排队号）、 等待人数。",
        "医生在工作站点击「叫号」，电视立刻弹窗 + 语音播报：\"请张XX到3号诊室就诊\"，患者听见就走过来，秩序好到不用说。",
      ],
      imageSrc: DETAIL_IMAGES.queueScreen,
    },
    {
      id: "lab-device",
      heading: "02 检验设备对接，结果精准回填",
      paragraphs: [
        "完善检验流程，首先自动根据样本类型合并检验单，其次直接对接检验设备实现结果的精准回填。",
      ],
      imageSrc: DETAIL_IMAGES.labDevice,
    },
    {
      id: "inventory-transfer",
      heading: "03 连锁库存调拨上线：多仓库一键调配",
      paragraphs: [
        "多门店多仓库，调货靠截图、靠记忆，总是发错或漏发？",
        "库存调拨功能本期正式上线，支持「调入」「调出」两种业务视角，覆盖完整调拨周期。",
        "此外，总部库存列表新增「全部门店」视图：进价区间、库存总量、可售库存、库内总成本全部自动汇总。",
      ],
      imageSrc: DETAIL_IMAGES.labDevice,
    },
    {
      id: "todo-reminder",
      heading: "04 待办数量统一提醒",
      paragraphs: [
        "原来只有「待收数量」，现在药房待发药、检验科待检验、治疗待执行都统一入口了。开启后，相关人员会收到数量提醒，消息不遗漏。",
      ],
      imageSrc: DETAIL_IMAGES.todoReminder,
    },
    {
      id: "commission-report",
      heading: "05 提成报表",
      paragraphs: [
        "新增提成报表，可以根据销售、充值等经营活动设置激励提成方案，系统将自动计算，方便诊所运营管理。",
      ],
      imageSrc: DETAIL_IMAGES.commissionReport,
    },
  ],
  closingParagraphs: [
    "叫号大屏、提成报表、检验设备等功能为专业版独享，感兴趣的客户可以咨询有关销售人员。除此之外，我们还更新了以下内容：1. 患者端挂号后支持签到取号。",
    "2. 中药处方/病历新增「宽松型」打印样式，紧凑/宽松可自由切换",
    "3. 用药标签患者信息自定义，可选是否打印手机号",
    "4. 经营概况新增费用分类、收费方式概览",
  ],
};

export const OPERATIONS_GUIDE_DETAIL_TITLE =
  "【4月更新】支持叫号大屏、检验设备对接，挂号支持签到取号，连锁门店调拨，新增宽松打印样式";

export function getOperationsGuideArticleDetail(
  slug: string,
): OperationsGuideArticleDetail | undefined {
  const listItem = OPERATIONS_GUIDE_ARTICLES.find((item) => item.slug === slug);
  if (!listItem) return undefined;

  return {
    ...listItem,
    title: OPERATIONS_GUIDE_DETAIL_TITLE,
    ...OPERATIONS_GUIDE_ARTICLE_DETAIL,
  };
}

export function getOperationsGuideArticleSlugs() {
  return OPERATIONS_GUIDE_ARTICLES.map((item) => item.slug);
}
