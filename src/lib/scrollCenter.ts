/** 将子元素水平滚动至容器可视区域居中 */
export function centerElementInScrollContainer(
  container: HTMLElement | null,
  element: HTMLElement | null,
  behavior: ScrollBehavior = "smooth",
) {
  if (!container || !element) return;

  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const nextScrollLeft =
    container.scrollLeft +
    (elementRect.left - containerRect.left) -
    (containerRect.width - elementRect.width) / 2;

  container.scrollTo({
    left: Math.max(0, nextScrollLeft),
    behavior,
  });
}

/** 滚动至吸顶哨兵对齐顶栏底部（分类条初始吸顶位置） */
export function scrollToStickySentinel(
  sentinel: HTMLElement | null,
  headerOffsetPx: number,
  behavior: ScrollBehavior = "smooth",
) {
  if (!sentinel) return;

  const targetTop =
    sentinel.getBoundingClientRect().top + window.scrollY - headerOffsetPx;

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior,
  });
}
