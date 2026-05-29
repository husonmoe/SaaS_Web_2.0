export type CaseVersionTag = "basic" | "insurance" | "pro";

export type CustomerCaseItem = {
  id: string;
  location: string;
  version: CaseVersionTag;
  versionLabel: string;
  quote: string;
};

export const VERSION_TAG_STYLES: Record<
  CaseVersionTag,
  { color: string; bg: string }
> = {
  basic: { color: "#0089ff", bg: "rgba(0, 137, 255, 0.08)" },
  insurance: { color: "#35968b", bg: "rgba(53, 150, 139, 0.08)" },
  pro: { color: "#f65601", bg: "rgba(246, 86, 1, 0.08)" },
};

export const CUSTOMER_CASES: CustomerCaseItem[] = [
  {
    id: "guangdong",
    location: "广东·某中医馆",
    version: "pro",
    versionLabel: "专业版",
    quote: "AI 经方辅助让我开方更自信了",
  },
  {
    id: "henan",
    location: "河南·村卫生室",
    version: "basic",
    versionLabel: "基础版",
    quote: "0 打字和医保进销存让我的工作更高效",
  },
  {
    id: "beijing",
    location: "北京·某西医诊所",
    version: "insurance",
    versionLabel: "医保版",
    quote: "患者管理和电子病历是我用过最顺手的",
  },
  {
    id: "yunnan",
    location: "云南·某中医馆",
    version: "pro",
    versionLabel: "专业版",
    quote: "AI 辅助问诊让诊疗过程更智能",
  },
  {
    id: "guizhou",
    location: "贵州·某卫生站",
    version: "basic",
    versionLabel: "基础版",
    quote: "解决了我们药品追溯码的录入难题",
  },
];

export type MapStatItem = {
  id: string;
  before: string;
  target: number;
  after: string;
};

export const MAP_STATS: MapStatItem[] = [
  {
    id: "provinces",
    before: "覆盖全国 ",
    target: 28,
    after: " 个省份",
  },
  {
    id: "clinics",
    before: "助力 ",
    target: 32000,
    after: " 家诊所实现数字化升级",
  },
];
