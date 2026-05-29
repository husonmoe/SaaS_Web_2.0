export type FaqItem = {
  id: string;
  iconSrc: string;
  title: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "clinic-types",
    iconSrc: "/assets/icon_hospital.svg",
    title: "支持哪些诊所类型？",
    answer:
      "目前光谱云诊全面覆盖全科、中医、西医及乡村卫生室，专注提升中小诊所数字化水平。",
  },
  {
    id: "quick-start",
    iconSrc: "/assets/icon_computer.svg",
    title: "如何快速开通使用？",
    answer:
      "点击右上角「免费试用」即可立刻体验，满意后可在在线支付，分钟级快速开通。",
  },
  {
    id: "yaoshibang",
    iconSrc: "/assets/icon_cart.svg",
    title: "必须通过药师帮平台采购药吗？",
    answer:
      "全开放，支持各渠道药品录入。但对接药师帮可享海量底价货源，且支持自动入库，让账物盘点效率提升 10 倍。",
  },
  {
    id: "data-migration",
    iconSrc: "/assets/icon_save.svg",
    title: "老系统的数据能迁移过来吗？",
    answer:
      "没问题！我们提供专业迁移服务，支持热门系统数据一键无缝导入，安全省心。",
  },
  {
    id: "data-security",
    iconSrc: "/assets/icon_shield_error.svg",
    title: "如何保障数据的安全性？",
    answer:
      "采用金融级云端加密与脱敏技术，符合国家大数据安全标准，守护您的数据隐私。",
  },
  {
    id: "medical-insurance",
    iconSrc: "/assets/icon_siderbar_medical insurance.svg",
    title: "可以对接医保吗？",
    answer:
      "已适配多地医保，正按政策加速全国接入。具体省份可对接排期请联系专属工程师。",
  },
];
