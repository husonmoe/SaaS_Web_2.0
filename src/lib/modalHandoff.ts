import { flushSync } from "react-dom";

/**
 * 先挂载下一个弹窗再关闭当前弹窗，避免两个 portal 交替时出现空帧或 overlay 闪动。
 */
export function handoffModal(openNext: () => void, closeCurrent: () => void) {
  flushSync(() => openNext());
  closeCurrent();
}
