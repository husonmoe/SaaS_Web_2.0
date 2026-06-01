export type VersionComparisonFaqItem = {
  id: string;
  title: string;
  answer: string;
};

export const VERSION_COMPARISON_FAQ_ICON = "/assets/icon_cjwt.svg";

export const VERSION_COMPARISON_FAQ_ITEMS: VersionComparisonFaqItem[] = [
  {
    id: "payment",
    title: "支持什么付款方式？",
    answer:
      "点击右上角「免费试用」即可即刻体验，满意后可在支付，分钟级快速开通。",
  },
  {
    id: "invoice",
    title: "支持开具发票吗？要怎么开？",
    answer:
      "目前光谱云诊全面覆盖全科、中医、西医及乡村卫生室，专注提升中小诊所数字化水平。",
  },
  {
    id: "support",
    title: "使用过程中遇到问题怎么办？",
    answer:
      "没问题！我们提供专业迁移服务，支持热门系统数据一键无缝导入，安全省心。",
  },
  {
    id: "refund",
    title: "购买使用后是否可以退款？",
    answer:
      "全开放，支持各渠道药品录入。但对接药师帮可享海量底价货源，且支持自动入库，让账物盘点效率提升 10 倍。",
  },
];
