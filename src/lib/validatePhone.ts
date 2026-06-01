const PHONE_PATTERN = /^1\d{10}$/;

export function validatePhone(value: string) {
  if (!value.trim()) return "请输入11位有效数字";
  if (!PHONE_PATTERN.test(value.trim())) return "请输入11位有效数字";
  return null;
}
