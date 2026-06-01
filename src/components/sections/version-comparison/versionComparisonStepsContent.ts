/**
 * 版本对比页 · 开通流程四步
 */

const ASSET_BASE = "/assets/image_version_comparison";

export type VersionComparisonStep = {
  step: string;
  label: string;
  iconSrc: string;
};

export const VERSION_COMPARISON_STEPS: VersionComparisonStep[] = [
  {
    step: "01",
    label: "选择版本",
    iconSrc: `${ASSET_BASE}/icon_选择版本.png`,
  },
  {
    step: "02",
    label: "在线支付",
    iconSrc: `${ASSET_BASE}/icon_在线支付.png`,
  },
  {
    step: "03",
    label: "开通使用",
    iconSrc: `${ASSET_BASE}/icon_开通使用.png`,
  },
  {
    step: "04",
    label: "专属对接",
    iconSrc: `${ASSET_BASE}/icon_专属对接.png`,
  },
];

export const VERSION_COMPARISON_STEP_ARROW = `${ASSET_BASE}/icon_arrow_2.svg`;
