import type { ClinicSelectItem } from "@/contexts/ClinicSelectModalContext";

/** 本地 dev：?clinicSelect=1 自动打开选择诊所弹窗 */
export const CLINIC_SELECT_DEV_PRESET_KEY = "clinicSelect";

export const DEFAULT_CLINIC_IMAGE_SRC = "/assets/modal/image_clinic.png";

/** Figma login_clinic_select 示例数据；接入接口后由 open options 传入 */
export const MOCK_CLINIC_SELECT_ITEMS: ClinicSelectItem[] = [
  {
    id: "clinic-1",
    name: "广州市海珠区未来光谱综合门诊一号门店",
    lastLoginLabel: "上次登录：9月16日",
  },
  {
    id: "clinic-2",
    name: "乐安社区卫生服务站",
    lastLoginLabel: "上次登录：9月16日",
  },
  {
    id: "clinic-3",
    name: "天河区华南城健康管理中心",
    lastLoginLabel: "上次登录：9月15日",
  },
  {
    id: "clinic-4",
    name: "白云区荔湾街道社区卫生服务中心",
    lastLoginLabel: "上次登录：9月14日",
  },
];
