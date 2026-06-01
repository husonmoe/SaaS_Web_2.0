/**
 * 版本对比页 · 功能矩阵数据（待从 Figma Form 407:146496 逐项录入）
 * @see https://www.figma.com/design/gnKU0pRP9Fh2R4zPZvNmyk?node-id=407-146271
 */

export type VersionColumnId = "basic" | "insurance" | "pro";

export type ComparisonCellValue =
  | { type: "check" }
  | { type: "dash" }
  | { type: "text"; value: string };

export type ComparisonFeatureRow = {
  id: string;
  label: string;
  values: Record<VersionColumnId, ComparisonCellValue>;
};

export type ComparisonFeatureGroup = {
  id: string;
  title: string;
  defaultExpanded?: boolean;
  rows: ComparisonFeatureRow[];
};

/** 对比表分组占位，实现阶段替换为设计稿完整数据 */
export const VERSION_COMPARISON_GROUPS: ComparisonFeatureGroup[] = [];
