export type VersionPlanTheme = "blue" | "green" | "orange";

export type VersionPlan = {
  id: string;
  title: string;
  subtitle: string;
  featuresHeader: string;
  features: string[];
  theme: VersionPlanTheme;
  recommended?: boolean;
};

const ASSET_BASE = "/assets/image_version_scheme";

/** Figma LinearGradient · start (0.89, -0.34) → end (0.45, 1.11) ≈ 192deg */
const CARD_ACCENT_ANGLE = "192.00761420415208deg";

function buildCardGradient(accentRgb: string, washHex: string): string {
  const washRgb = washHex.replace("#", "");
  const r = parseInt(washRgb.slice(0, 2), 16);
  const g = parseInt(washRgb.slice(2, 4), 16);
  const b = parseInt(washRgb.slice(4, 6), 16);

  return [
    `linear-gradient(${CARD_ACCENT_ANGLE}, ${accentRgb} 0%, rgba(255, 247, 242, 0) 36%)`,
    `linear-gradient(180deg, rgb(${r}, ${g}, ${b}) 0%, rgba(${r}, ${g}, ${b}, 0) 30%)`,
    "#ffffff",
  ].join(", ");
}

export const VERSION_THEMES: Record<
  VersionPlanTheme,
  {
    color: string;
    badgeBg: string;
    ctaBg: string;
    cardGradient: string;
    diamondIcon: string;
    personIcon: string;
    texture: string;
  }
> = {
  blue: {
    color: "#0089ff",
    badgeBg: "rgba(0, 137, 255, 0.06)",
    ctaBg: "#0089ff",
    cardGradient: buildCardGradient("rgba(0, 138, 255, 0.04)", "#f2fbff"),
    diamondIcon: `${ASSET_BASE}/icon_diamond_blue.png`,
    personIcon: `${ASSET_BASE}/icon_person_fill_blue.png`,
    texture: `${ASSET_BASE}/bg_texture_blue.png`,
  },
  green: {
    color: "#35968b",
    badgeBg: "rgba(53, 150, 139, 0.06)",
    ctaBg: "#35968b",
    cardGradient: buildCardGradient("rgba(19, 187, 168, 0.04)", "#f0fafa"),
    diamondIcon: `${ASSET_BASE}/icon_diamond_green.png`,
    personIcon: `${ASSET_BASE}/icon_person_fill_green.png`,
    texture: `${ASSET_BASE}/bg_texture_green.png`,
  },
  orange: {
    color: "#f65601",
    badgeBg: "rgba(246, 86, 1, 0.06)",
    ctaBg: "#f65601",
    cardGradient: buildCardGradient("rgba(246, 86, 1, 0.04)", "#fff8f3"),
    diamondIcon: `${ASSET_BASE}/icon_diamond_orange.png`,
    personIcon: `${ASSET_BASE}/icon_person_fill_orange.png`,
    texture: `${ASSET_BASE}/bg_texture_orange.png`,
  },
};

export const VERSION_PLANS: VersionPlan[] = [
  {
    id: "basic",
    title: "基础版",
    subtitle: "适用于大部分诊所",
    featuresHeader: "基础版包括：",
    features: [
      "预约挂号 / 门诊 / 收费 / 发药",
      "电子病历 / 处方系统",
      "药品进销存管理",
      "经营统计分析",
    ],
    theme: "blue",
  },
  {
    id: "insurance",
    title: "医保版",
    subtitle: "适用于医保客户",
    featuresHeader: "含基础版能力，还包括：",
    features: ["医保对接服务", "接口免费升级"],
    theme: "green",
    recommended: true,
  },
  {
    id: "pro",
    title: "专业版",
    subtitle: "适用于连锁店 / 中医馆等",
    featuresHeader: "含医保版能力，还包括：",
    features: [
      "微诊所 / 患者随访",
      "叫号大屏",
      "支持连锁管理",
      "专属客服服务",
    ],
    theme: "orange",
  },
];

export const VERSION_COMPARE_TAG = `${ASSET_BASE}/tag.png`;
