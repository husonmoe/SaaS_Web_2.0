/** 营销站路由路径 */
export const PATHS = {
  home: "/",
  versionComparison: "/version-comparison",
  operationsGuide: "/operations-guide",
  userManual: "/user-manual",
  createClinic: "/create-clinic",
} as const;

/** 站外链接 */
export const EXTERNAL_PATHS = {
  yaoshibangLogin:
    "https://dian.ysbang.cn/#/login?redirect=%2Fhome",
} as const;

export function operationsGuideDetailPath(slug: string) {
  return `${PATHS.operationsGuide}/${slug}` as const;
}
