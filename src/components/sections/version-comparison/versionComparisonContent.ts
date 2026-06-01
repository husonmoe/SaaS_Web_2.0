/**
 * 版本对比页 · 功能矩阵（Figma Form 407:146496）
 * @see https://www.figma.com/design/gnKU0pRP9Fh2R4zPZvNmyk?node-id=407-146496
 */

export type VersionColumnId = "basic" | "insurance" | "pro";

export type ComparisonCellValue =
  | { type: "check" }
  | { type: "dash" }
  | { type: "text"; value: string };

export type ComparisonFeatureRow = {
  id: string;
  label: string;
  /** 功能名旁说明图标 */
  info?: boolean;
  /** 分组内小标题行（如 GSP 管理） */
  emphasis?: boolean;
  values: Record<VersionColumnId, ComparisonCellValue>;
};

export type ComparisonFeatureGroup = {
  id: string;
  title: string;
  defaultExpanded?: boolean;
  rows: ComparisonFeatureRow[];
};

const check = { type: "check" } as const;
const dash = { type: "dash" } as const;

export const VERSION_COMPARISON_GROUPS: ComparisonFeatureGroup[] = [
  {
    id: "clinic-workflow",
    title: "诊所流程",
    defaultExpanded: true,
    rows: [
      { id: "clinic-workflow-01", label: "挂号预约", values: { basic: check, insurance: check, pro: check } },
      { id: "clinic-workflow-02", label: "门诊接诊", values: { basic: check, insurance: check, pro: check } },
      { id: "clinic-workflow-03", label: "划价收费", values: { basic: check, insurance: check, pro: check } },
      { id: "clinic-workflow-04", label: "零售售药", values: { basic: check, insurance: check, pro: check } },
      { id: "clinic-workflow-05", label: "药房发药", values: { basic: check, insurance: check, pro: check } },
      { id: "clinic-workflow-06", label: "病历 / 处方模板", values: { basic: check, insurance: check, pro: check } },
      { id: "clinic-workflow-07", label: "经方验方", values: { basic: check, insurance: check, pro: check } },
      { id: "clinic-workflow-08", label: "治疗理疗", values: { basic: check, insurance: check, pro: check } },
      { id: "clinic-workflow-09", label: "病历附件上传", values: { basic: check, insurance: check, pro: check } },
      { id: "clinic-workflow-10", label: "AI 辅助诊疗", values: { basic: check, insurance: check, pro: check } },
      { id: "clinic-workflow-11", label: "AI 用药审核", values: { basic: check, insurance: check, pro: check } },
      { id: "clinic-workflow-12", label: "药品说明书", values: { basic: check, insurance: check, pro: check } },
      { id: "clinic-workflow-13", label: "执行站", values: { basic: check, insurance: check, pro: check } },
      { id: "clinic-workflow-14", label: "经营统计", values: { basic: check, insurance: check, pro: check } },
      { id: "clinic-workflow-15", label: "手机 APP（全功能）", values: { basic: check, insurance: check, pro: check } },
      { id: "clinic-workflow-16", label: "聚合支付", info: true, values: { basic: check, insurance: check, pro: check } },
      { id: "clinic-workflow-17", label: "业绩提成报表", values: { basic: check, insurance: check, pro: check } },
    ],
  },
  {
    id: "pharmacy-supply",
    title: "药品管理与供应链",
    defaultExpanded: true,
    rows: [
      { id: "pharmacy-supply-01", label: "药品出入库", values: { basic: check, insurance: check, pro: check } },
      { id: "pharmacy-supply-02", label: "药品盘点", values: { basic: check, insurance: check, pro: check } },
      { id: "pharmacy-supply-03", label: "库存 / 效期预警", values: { basic: check, insurance: check, pro: check } },
      { id: "pharmacy-supply-04", label: "毛利异常预警", values: { basic: check, insurance: check, pro: check } },
      { id: "pharmacy-supply-05", label: "耗材 / 商品管理", values: { basic: check, insurance: check, pro: check } },
      { id: "pharmacy-supply-06", label: "药品加工管理", values: { basic: check, insurance: check, pro: check } },
      { id: "pharmacy-supply-07", label: "药品配送管理", values: { basic: check, insurance: check, pro: check } },
      { id: "pharmacy-supply-08", label: "追溯码采集", values: { basic: check, insurance: check, pro: check } },
      { id: "pharmacy-supply-09", label: "追溯码管理", values: { basic: check, insurance: check, pro: check } },
      { id: "pharmacy-supply-10", label: "GSP 管理", emphasis: true, values: { basic: check, insurance: check, pro: check } },
      { id: "pharmacy-supply-11", label: "药品采购计划", values: { basic: check, insurance: check, pro: check } },
      { id: "pharmacy-supply-12", label: "自动计算采购单", values: { basic: check, insurance: check, pro: check } },
      { id: "pharmacy-supply-13", label: "药品直采", values: { basic: check, insurance: check, pro: check } },
      { id: "pharmacy-supply-14", label: "空中药房", values: { basic: check, insurance: check, pro: check } },
      { id: "pharmacy-supply-15", label: "供应商对接", values: { basic: check, insurance: check, pro: check } },
      { id: "pharmacy-supply-16", label: "供应商结算", values: { basic: check, insurance: check, pro: check } },
      { id: "pharmacy-supply-17", label: "多药房管理", values: { basic: check, insurance: check, pro: check } },
    ],
  },
  {
    id: "patient-marketing",
    title: "患者管理与营销",
    defaultExpanded: true,
    rows: [
      { id: "patient-marketing-01", label: "患者信息管理", info: true, values: { basic: check, insurance: check, pro: check } },
      { id: "patient-marketing-02", label: "患者消费轨迹", values: { basic: check, insurance: check, pro: check } },
      { id: "patient-marketing-03", label: "患者标签", values: { basic: check, insurance: check, pro: check } },
      { id: "patient-marketing-04", label: "会员等级管理", values: { basic: check, insurance: check, pro: check } },
      { id: "patient-marketing-05", label: "会员充值", values: { basic: check, insurance: check, pro: check } },
      { id: "patient-marketing-06", label: "会员积分", values: { basic: check, insurance: check, pro: check } },
      { id: "patient-marketing-07", label: "会员折扣", values: { basic: check, insurance: check, pro: check } },
      { id: "patient-marketing-08", label: "服务短信推送", info: true, values: { basic: dash, insurance: check, pro: check } },
      { id: "patient-marketing-09", label: "服务微信推送", info: true, values: { basic: dash, insurance: check, pro: check } },
      { id: "patient-marketing-10", label: "营销工具 - 套餐", values: { basic: check, insurance: check, pro: check } },
      { id: "patient-marketing-11", label: "营销工具 - 折扣", values: { basic: dash, insurance: check, pro: check } },
      { id: "patient-marketing-12", label: "营销工具 - 满减返", values: { basic: dash, insurance: check, pro: check } },
      { id: "patient-marketing-13", label: "营销工具 - 优惠券", values: { basic: dash, insurance: check, pro: check } },
      { id: "patient-marketing-14", label: "营销工具 - 卡项", values: { basic: dash, insurance: check, pro: check } },
      { id: "patient-marketing-15", label: "营销工具 - 老带新", values: { basic: dash, insurance: check, pro: check } },
      { id: "patient-marketing-16", label: "营销工具 - 消息群发", values: { basic: dash, insurance: check, pro: check } },
      { id: "patient-marketing-17", label: "患者随访", values: { basic: dash, insurance: check, pro: check } },
      { id: "patient-marketing-18", label: "自动发送随访通知", values: { basic: dash, insurance: check, pro: check } },
      { id: "patient-marketing-19", label: "慢病管理", values: { basic: dash, insurance: check, pro: check } },
      { id: "patient-marketing-20", label: "家庭医生", values: { basic: dash, insurance: check, pro: check } },
      { id: "patient-marketing-21", label: "儿保系统", values: { basic: { type: "text", value: "6000 / 年" }, insurance: { type: "text", value: "免费" }, pro: { type: "text", value: "免费" } } },
    ],
  },
];

export function rowValuesEqual(row: ComparisonFeatureRow): boolean {
  const cells = Object.values(row.values);
  return cells.every((c) => JSON.stringify(c) === JSON.stringify(cells[0]));
}

export function filterComparisonGroups(
  groups: ComparisonFeatureGroup[],
  hideIdentical: boolean,
): ComparisonFeatureGroup[] {
  if (!hideIdentical) return groups;
  return groups
    .map((group) => ({
      ...group,
      rows: group.rows.filter((row) => !rowValuesEqual(row)),
    }))
    .filter((group) => group.rows.length > 0);
}
