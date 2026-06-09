# TrialModal 断点样式记录

> 记录日期：2026-06-08  
> 关联提交：试用弹窗 Mobile / Pad / Web 分档样式落地  
> 用途：样式回滚、断点对照、验收基准

**断点约定（项目全局）**

| 档位 | 视口 | Tailwind 前缀 |
| --- | --- | --- |
| Mobile | 375–767px | 默认（无前缀） |
| Pad | 768–1023px | `md:` |
| Web | ≥1024px | `lg:` |

**涉及文件**

- `src/components/modals/TrialModal.tsx`
- `src/components/modals/ModalShell.tsx`（`overlayClassName`）
- `src/components/modals/LoginModal.tsx`（Pad/Web 固定 600px 高度）

**文档位置：** `docs/modals/TrialModal.breakpoints.md`

---

## 1. ModalShell 外壳（TrialModal 传参）

### Mobile（<768px）

| 属性 | 值 | className |
| --- | --- | --- |
| 遮罩层左右间距 | 12.5px（375 画板居中 350px 弹窗） | `overlayClassName="px-[12.5px] py-4"` |
| 弹窗宽度 | 350px | `dialogClassName` → `w-[350px] max-w-[350px]` |
| 弹窗高度 | 450px | `dialogClassName` → `h-[450px]` |
| 左侧插画 | 隐藏 | `panelVisibleFrom="lg"` |
| 内容区高度 | 450px | `h-[450px] max-h-[450px]` |
| 内容区内边距 | 上下左右 24px | `px-6 pt-6 pb-6` |
| 内容区溢出 | 隐藏（无滚动条） | `overflow-hidden` |
| 子元素间距 | 24px | `gap-6` |
| sm 断点防污染 | 锁定 Mobile 内边距 | `sm:pt-6 sm:pb-6 sm:px-6 sm:overflow-hidden` |

### Pad（768–1023px）

| 属性 | 值 | className |
| --- | --- | --- |
| 遮罩层 | 16px 全周 | `md:p-4` |
| 弹窗宽度 | 520px | `md:w-[520px] md:max-w-[520px]` |
| 弹窗高度 | 由内容区决定 | `md:h-auto` |
| 左侧插画 | 隐藏 | `panelVisibleFrom="lg"` |
| 内容区高度 | 600px 固定 | `md:h-[600px] md:max-h-[600px]` |
| 内容区内边距 | 上 80px / 下 40px / 左右 60px | `md:pt-20 md:pb-10 md:px-[60px]` |
| 内容区溢出 | 可滚动 | `md:overflow-y-auto` |
| 子元素间距 | 24px | `gap-6` |

### Web（≥1024px）

| 属性 | 值 | className |
| --- | --- | --- |
| 弹窗宽度 | 最大 900px（左面板 400 + 右内容 500） | `lg:w-full lg:max-w-[900px]` |
| 左侧插画 | 显示 400×600 | `panelVisibleFrom="lg"` |
| 内容区高度 | 600px 固定 | 同 Pad `md:h-[600px]` |
| 内容区内边距 | 同 Pad | `md:pt-20 md:pb-10 md:px-[60px]` |

---

## 2. TrialModalFormView 表单视图

### 共用

| 元素 | 样式 |
| --- | --- |
| 标题 | `text-[32px] leading-[44px]`「免费试用申请」 |
| 副标题 | `text-xl leading-7` 主色 |
| 输入框 | `h-10`（40px） |
| 提交按钮 | `h-12 w-full rounded-[10px]` |
| 底部链接 | `w-full text-center`「已有诊所账号？立即登录」 |
| 错误提示 | 绝对定位 `h-8` 占位，不占文档流 |

### Mobile

| 属性 | 值 |
| --- | --- |
| 外层容器 | `flex-1 min-h-0 gap-6 w-full`（无 max-w 限制，全宽） |
| 标题区高度 | `h-fit`（自适应） |
| 表单间距 | `gap-6`（24px） |
| 表单布局 | `flex-1 min-h-0` 撑满中间区域 |

### Pad / Web

| 属性 | 值 |
| --- | --- |
| 外层容器 | `md:max-w-[280px]` |
| 标题区高度 | `md:h-[116px]` 固定 |
| 表单间距 | `md:gap-10`（40px） |
| 表单布局 | `md:flex-1 md:min-h-0` |

---

## 3. LoginModal 对齐（Pad/Web）

| 属性 | 值 |
| --- | --- |
| 左侧插画 | `panelVisibleFrom="lg"`（Pad 隐藏） |
| 弹窗宽度 | `md:w-[520px]` / `lg:max-w-[900px]` |
| 内容区高度 | 全断点 `h-[600px] max-h-[600px]` |
| 内容区内边距 | `pt-20 pb-10 gap-6` |

---

## 4. 回滚指引

**仅回滚 Mobile 试用弹窗**：恢复 `TrialModal.tsx` 中 `overlayClassName`、`dialogClassName`、`contentClassName` 的 Mobile 段，以及 `TrialModalFormView` 的 `gap-6` / `flex-1` 逻辑。

**回滚 Pad 分档**：移除 `panelVisibleFrom="lg"` 与 `md:w-[520px]`，恢复 `panelVisibleFrom="md"` 或默认。

**回滚 Web 固定高度**：将 `md:h-[600px]` 改回 `lg:h-[600px]` 或 `h-fit`。

**完整回滚本记录对应样式**：

```bash
git log --oneline -- src/components/modals/TrialModal.tsx
# 找到本记录对应 commit 的父提交
git checkout <parent-commit> -- src/components/modals/TrialModal.tsx src/components/modals/ModalShell.tsx src/components/modals/LoginModal.tsx
```

---

## 5. 验收视口

| 视口宽度 | 预期 |
| --- | --- |
| 375px | 弹窗 350×450，无滚动条，表单 gap 24px，底部链接居中 |
| 768px | 弹窗 520px 宽，600px 高，无左面板 |
| 1024px+ | 弹窗 900px，左面板 400px + 右内容 500px，600px 高 |
