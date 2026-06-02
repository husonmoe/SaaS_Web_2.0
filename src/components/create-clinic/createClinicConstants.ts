/** 本地 dev：?createClinic=1 打开创建诊所页；?createClinicStep=2 直接进入第二步 */
export const CREATE_CLINIC_DEV_PRESET_KEY = "createClinic";
export const CREATE_CLINIC_STEP_DEV_PRESET_KEY = "createClinicStep";

export const SMS_COUNTDOWN_SECONDS = 59;

export const ICON_HELP_SRC = "/assets/icon_help.svg";
export const ICON_CLEAR_SRC = "/assets/trial-modal/icon-clear.svg";
export const ICON_CHECK_SRC = "/assets/icon_check.svg";
export const ICON_TRIANGLE_DOWN_SRC = "/assets/icon_triangle_down.svg";
export const ICON_ADD_SRC = "/assets/icon_add.svg";
export const ICON_DELETE_SRC = "/assets/icon_delete.svg";
export const ICON_PHOTO_SRC = "/assets/icon_photo.svg";
export const LOGO_SRC = "/assets/LOGO.png";

export const INPUT_CLASS =
  "h-10 w-full rounded-lg border border-[var(--border-heavy)] bg-white px-3 text-sm leading-[22px] text-[var(--text-base)] outline-none transition-colors placeholder:text-[var(--text-quaternary)] focus:border-[var(--color-primary)]";

export type CreateClinicFormData = {
  displayName: string;
  phone: string;
  smsCode: string;
  clinicName: string;
  region: string;
  addressDetail: string;
  licenseFile: File | null;
};

export const INITIAL_CREATE_CLINIC_FORM: CreateClinicFormData = {
  displayName: "",
  phone: "",
  smsCode: "",
  clinicName: "",
  region: "",
  addressDetail: "",
  licenseFile: null,
};
