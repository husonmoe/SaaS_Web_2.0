export type ProductFeature = {
  title: string;
  description: string;
  /** 功能预览图；缺省时按 `{label}_{title}` 规则拼接路径 */
  image?: string;
};

/** 产品模块功能预览图路径（public/assets/image_product_module） */
export function productFeatureImagePath(
  tabLabel: string,
  featureTitle: string,
): string {
  return `/assets/image_product_module/${tabLabel}_${featureTitle}.png`;
}

export type HeadlineSegment = {
  text: string;
  color?: "primary" | "base";
};

export type HeadlinePart = {
  segments: HeadlineSegment[];
};

export type ProductTabContent = {
  id: string;
  label: string;
  headline: [HeadlinePart, HeadlinePart];
  features: ProductFeature[];
  /** 中心 SaaS 界面截图；缺省时用默认图 */
  appImage?: string;
};

export const PRODUCT_TAB_CONTENT: ProductTabContent[] = [
  {
    id: "reception",
    label: "快速接诊",
    headline: [
      { segments: [{ text: "极简接诊流程" }] },
      {
        segments: [
          { text: "看诊", color: "base" },
          { text: "效率翻倍", color: "primary" },
        ],
      },
    ],
    features: [
      {
        title: "扫码挂号",
        description:
          "患者微信扫码自助建档，10 秒快速登记，高峰期再忙也不乱。",
        image: productFeatureImagePath("快速接诊", "扫码挂号"),
      },
      {
        title: "极速建档",
        description:
          "电脑端仅需录入姓名电话，零门槛上手，接诊响应快人一步。",
        image: productFeatureImagePath("快速接诊", "极速建档"),
      },
      {
        title: "智能搜寻",
        description:
          "拼音首字母或手机号秒级检索，老患者病历调取无需等待。",
        image: productFeatureImagePath("快速接诊", "智能搜寻"),
      },
    ],
  },
  {
    id: "prescription",
    label: "问诊开方",
    headline: [
      {
        segments: [
          { text: "十秒", color: "primary" },
          { text: "写出详细病历" },
        ],
      },
      {
        segments: [
          { text: "一键", color: "primary" },
          { text: "开出专业处方" },
        ],
      },
    ],
    features: [
      {
        title: "一键开方",
        description:
          "覆盖 97% 的基层常见病，通过鼠标点选，10 秒即可完成病历与处方。",
        image: productFeatureImagePath("问诊开方", "一键开方"),
      },
      {
        title: "处方模版",
        description: "基层常见疾病，海量专业处方模版。一键调用，按需调整。",
        image: productFeatureImagePath("问诊开方", "处方模版"),
      },
      {
        title: "模版随心存",
        description:
          "一键沉淀开方经验。支持整单或单项保存，助您打造专属高效处方库。",
        image: productFeatureImagePath("问诊开方", "模版随心存"),
      },
    ],
  },
  {
    id: "patients",
    label: "患者管理",
    headline: [
      {
        segments: [
          { text: "洞察患者" },
          { text: "病史记录", color: "primary" },
        ],
      },
      { segments: [{ text: "慢病隐情一目了然" }] },
    ],
    features: [
      {
        title: "患者管理",
        description:
          "全面沉淀历史患者档案，首诊、复诊、用药、消费金额全账目清晰可见。",
        image: productFeatureImagePath("患者管理", "患者管理"),
      },
      {
        title: "疾病风险预警",
        description:
          "智能提示患者潜在重病及慢病史，提高诊疗精准度，降低医生执业风险。",
        image: productFeatureImagePath("患者管理", "疾病风险预警"),
      },
      {
        title: "数据安全",
        description:
          "数据云端高强度加密，严格符合国家信息安全标准，守护诊所核心资产。",
        image: productFeatureImagePath("患者管理", "数据安全"),
      },
    ],
  },
  {
    id: "medicine",
    label: "药品管理",
    headline: [
      { segments: [{ text: "药品管理简单清晰" }] },
      {
        segments: [
          { text: "一人兼顾", color: "primary" },
          { text: "轻松搞定" },
        ],
      },
    ],
    features: [
      {
        title: "处方发药",
        description:
          "诊室开方、药房自动同步，处方一键高效打印，医护协同更默契。",
        image: productFeatureImagePath("药品管理", "处方发药"),
      },
      {
        title: "库存管理",
        description:
          "药品库存、厂家、规格及零售价多维度动态展示，账目变动了然于胸。",
        image: productFeatureImagePath("药品管理", "库存管理"),
      },
      {
        title: "库存预警",
        description:
          "低库存时系统智能提醒，自动生成采购计划，告别断药与滞销风险。",
        image: productFeatureImagePath("药品管理", "库存预警"),
      },
    ],
  },
  {
    id: "purchase",
    label: "采购入库",
    headline: [
      { segments: [{ text: "海量药品采购无忧" }] },
      {
        segments: [
          { text: "全自动化", color: "primary" },
          { text: "轻松入库", color: "base" },
        ],
      },
    ],
    features: [
      {
        title: "海量药品",
        description:
          "依托药师帮 330 万优质药源，支持拼团、白条等多种账期优惠，优质低价，极速配送。",
        image: productFeatureImagePath("采购入库", "海量药品"),
      },
      {
        title: "一键入库",
        description:
          "采购药品自动同步，一键确认即可快速入库，账目清晰，省时省心。",
        image: productFeatureImagePath("采购入库", "一键入库"),
      },
      {
        title: "扫码入库",
        description:
          "扫描药品条形码秒级识别，自动录入药品信息，告别手动繁琐录入。",
        image: productFeatureImagePath("采购入库", "扫码入库"),
      },
    ],
  },
];

export const DEFAULT_APP_IMAGE = "/assets/image_header.png";
