# 编码规范

> 摘自项目开发约定，供前端接手时对照。完整设计 Token 见 [design.md](../design.md)。

## 技术栈

- Next.js 15 App Router + TypeScript
- Tailwind CSS 3（配置见 `tailwind.config.ts`）
- 无 UI 组件库，基础组件在 `src/components/ui/`

## 样式

1. **禁止**原生内联 `style`（`zIndex` 等极少数例外需在 ModalShell 等处保留）
2. 颜色 / 间距优先 CSS Token：`var(--color-primary)`、`var(--text-base)`、`var(--border-light)` 等
3. 动态类名**只能**用 `cn()`：

```tsx
import { cn } from "@/lib/cn";

<div className={cn("page-grid", isActive && "opacity-100", className)} />
```

4. 切换大块内容显隐用 `hidden` / 透明度，**禁止**条件渲染销毁 DOM（防闪烁）

## 响应式断点

| 档位 | 视口 | 前缀 | 栅格列数 |
| --- | --- | --- | --- |
| Mobile | 375–767px | 默认 | 4 |
| Pad | 768–1023px | `md:` | 8 |
| Web | ≥1024px | `lg:` | 12 |

- 版芯最大宽度 1200px（Web）
- 布局复用 `PageContainer` / `PageGrid`，勿手写 `grid-cols-*` 覆盖全局栅格
- 栅格变量：`src/styles/grid-tokens.css`

## 布局组件

```tsx
import { PageContainer } from "@/components/layout/PageContainer";
import { PageGrid } from "@/components/layout/PageGrid";

<PageContainer>
  <PageGrid>
    <div className="col-span-full md:col-span-4 lg:col-span-6">...</div>
  </PageGrid>
</PageContainer>
```

## 表单错误提示

错误态必须用 **overlay 浮层**，不占文档流（见 `CreateClinicFieldHint`）：

- 父级 `relative`
- 错误文案 `absolute`，`top-[calc(100%+4px)]`
- 出现 / 消失不得推动下方元素

## 弹窗

- 外壳：`ModalShell`，支持 `contentClassName` / `dialogClassName` / `overlayClassName`
- 左面板显隐：`panelVisibleFrom="lg"` 或 `"md"`
- 互切：`handoffModal(openNext, closeCurrent)` from `@/lib/modalHandoff`
- 试用弹窗断点样式详见 [modals/TrialModal.breakpoints.md](./modals/TrialModal.breakpoints.md)

## 静态资源

- 路径统一放 `public/assets/`
- 中文文件名 SSR 引用需 `encodeURI`（见 design.md §8.1）
- 弹窗插画预加载：`src/lib/modalPanelAssets.ts` + layout preload

## Git 提交

- Commit message 使用**简体中文**
- 需带 TAPD ID：`--story=[ID]@tapd-[项目ID]`（见仓库 Git Commit Rules）

## 本地预览（必遵）

改完前端后：

```bash
npm run dev:fresh
npm run preview:open
```

勿混用三种地址：本地 dev · Simple Browser tunnel · 线上域名（见团队 preview 规范）。
