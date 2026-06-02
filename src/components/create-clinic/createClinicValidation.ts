const DISPLAY_NAME_PATTERN = /^[\u4e00-\u9fa5a-zA-Z]{1,10}$/;
const CLINIC_NAME_PATTERN = /^[\u4e00-\u9fa5]{3,20}$/;
const ADDRESS_DETAIL_PATTERN = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,30}$/;

export function validateDisplayName(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "请输入您的称呼";
  if (!DISPLAY_NAME_PATTERN.test(trimmed)) {
    return "限1-10中英文字符，如“李医生”，“仁爱医生”等";
  }
  return null;
}

export function validateClinicName(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "请输入诊所名称";
  if (!CLINIC_NAME_PATTERN.test(trimmed)) {
    return "创建后不支持修改，限 3-20 个中文字符";
  }
  return null;
}

export function validateAddressDetail(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "请输入详细地址";
  if (!ADDRESS_DETAIL_PATTERN.test(trimmed)) {
    return "输入详细地址，限 1-30 字符，支持中文，英文，数字";
  }
  return null;
}

export function validateSmsCode(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "输入有效验证码";
  return null;
}
