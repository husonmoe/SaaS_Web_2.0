# 光谱云诊官网重构 2.0 · 设计规范与实施规划

## 1. 文档信息

| 项目 | 内容 |
| --- | --- |
| Figma 文件 | [官网重构-2.0](https://www.figma.com/design/gnKU0pRP9Fh2R4zPZvNmyk/%E5%AE%98%E7%BD%91%E9%87%8D%E6%9E%84-2.0) |
| 首页 Section | `299:12221`（首页） |
| Web 画板 | `97:33948` · 1920×7676 |
| Pad 画板 | `143:15837` · 834px |
| Mobile 画板 | `149:9127` · 375px |
| 前端工程 | `SaaS_Web_2.0` · Next.js 15 + Tailwind |

## 2. 响应式栅格

| 档位 | 视口范围 | 画板宽 | 列数 | Gutter | 边距/容器 |
| --- | --- | --- | --- | --- | --- |
| Mobile | 375–767px | 375 | 4 | 24px | 左右 24px |
| Pad | 768–1023px | 834 | 8 | 24px | 左右 64px |
| Web | ≥1024px | 1920 | 12 | 24px | 内容 max 1200px 居中 |

**代码断点：** 默认 Mobile · `md: 768px` · `lg: 1024px`（版芯内容 max 1200px）

实现：`src/styles/grid-tokens.css` + `PageContainer` / `PageGrid`

## 3. 颜色 Token

| Token | 值 |
| --- | --- |
| `--color-primary` | `#0089ff` |
| `--color-primary-end` | `#466dfc` |
| `--text-base` | `#171c21` |
| `--text-secondary` | `#727679` |
| `--text-tertiary` | `#9fa2a6` |
| `--border-light` | `#e7eaed` |
| `--bg-shell` | `#f6f9fc` |

---

## 4. 实施进度总览

> **当前阶段：** Web 端功能与视觉基本完成 → **下一阶段：Pad / Mobile 适配**

### 4.1 首页区块（Web 1920）

| 顺序 | 区块 | Figma node | 前端 | Web |
| --- | --- | --- | --- | --- |
| 1 | Header | `163:49698` | `SiteHeader` | ✅ |
| 2 | Hero | `97:33949` | `HeroSection` | ✅ |
| 3 | 数据统计 | `97:36263` | `StatsSection` | ✅ |
| 4 | 功能亮点 | `97:37256` | `WhyChooseSection` | ✅ |
| 5 | 产品模块 | `97:36338` | `ProductSection` + `ProductPreview` | ✅ |
| 6 | 增值服务 | — | `ValueAddedServicesSection` | ✅ |
| 7 | 版本方案 | `97:37432` | `VersionSchemeSection` | ✅ |
| 8 | 客户案例 | `140:15673` | `CustomerCasesSection` | ✅ |
| 9 | FAQ | `97:37587` | `FaqSection` | ✅ |
| 10 | CTA | `228:17347` | `ActionCtaSection` | ✅ |
| 11 | Footer | `185:12946` | `SiteFooter` | ✅ |
| — | 悬浮工具栏 | — | `FloatingToolbar` | ✅ |

### 4.2 内页（Web）

| 页面 | 路由 | 主要组件 | Web |
| --- | --- | --- | --- |
| 版本对比 | `/version-comparison` | `VersionComparisonMatrix` | ✅ |
| 操作指南列表 | `/operations-guide` | `OperationsGuideListSection` | ✅ |
| 操作指南详情 | `/operations-guide/[slug]` | `OperationsGuideDetailSection` | ✅ |
| 用户手册 | `/user-manual` | `UserManualMainSection` | ✅ |
| 创建诊所 | `/create-clinic` | `CreateClinicPageContent`（2 步表单） | ✅ |

### 4.3 弹窗与账户流程（Web）

| 功能 | 组件 | Web |
| --- | --- | --- |
| 登录弹窗（微信 / 验证码 / 密码） | `LoginModal` | ✅ |
| 免费试用申请 | `TrialModal` | ✅ |
| 选择诊所 | `ClinicSelectModal` | ✅ |
| 忘记密码 | `ForgotPasswordModal` | ✅ |
| 微信绑定 | `WechatBindModal` | ✅ |
| 弹窗外壳 + 左侧插画 | `ModalShell` | ✅ |
| 弹窗切换无空帧 | `modalHandoff` | ✅ |
| 背景滚动锁定 | `useBodyScrollLock` | ✅ |
| 弹窗插画预加载 | `modalPanelAssets` + layout preload | ✅ |
| 创建诊所表单校验 + 错误 overlay | `CreateClinic*` | ✅ |

### 4.4 基础设施

| 项 | 状态 |
| --- | --- |
| 三端栅格 Token + PageContainer | ✅ |
| 主题 Token（`theme-tokens.css`） | ✅ |
| Hero 背景层（`hero-bg.css`） | ✅ |
| Toast 全局提示 | ✅ |
| 本地 dev 刷新 / 预览脚本 | ✅ |
| Cloudflare 部署配置 | ✅ |

---

## 5. Pad / Mobile 适配

### 5.0 分支策略（必读）

| 分支 | 职责 | 合并目标 |
| --- | --- | --- |
| `main` | Web（≥1024px）+ 已合并的 Mobile | 生产部署 |
| `feat-mobile-adapt` | 仅 Mobile（375–767，无前缀类名） | → `main` |
| `feat-pad-adapt` | **仅 Pad（768–1023，`md:`）** | → `main`（验收后） |

**Pad 开发铁律：** 不改 Mobile 基线、不破坏 Web（`lg:` 须与 `main` 一致）。

#### Pad 断点写法

1. **Mobile 基线不动**：不修改无前缀 class。
2. **Pad 用 `md:`**：768–1023px 差异只写 `md:`。
3. **Web 用 `lg:` 锁回**：`md:` 会延续到 ≥1024px 时，必须补 `lg:` 恢复 `main` 样式。

```tsx
// ✅ Pad 单列，Web 双列
<div className="grid grid-cols-1 gap-4 md:flex md:flex-col md:gap-6 lg:grid lg:grid-cols-2 lg:gap-6" />
```

自定义 CSS 的 Pad 规则使用 `@media (min-width: 768px) and (max-width: 1023px)`，避免污染 Web。

> 对照 Figma Pad（834px 画板）与 Mobile（375px 画板），按视口 768–1023 / 375–767 验收。

### 5.1 全局与布局

- [ ] `SiteHeader`：Pad 导航收缩、Mobile 汉堡菜单与抽屉
- [ ] `SiteFooter`：Pad / Mobile 列布局与链接分组
- [ ] `FloatingToolbar`：Pad / Mobile 位置与显隐
- [ ] `PageContainer` / `PageGrid`：核对 768 / 375 边距与列跨度

### 5.2 首页各 Section

- [ ] `HeroSection`：Pad / Mobile 排版、mockup 尺寸与背景裁切
- [ ] `StatsSection` / `WhyChooseSection`
- [ ] `ProductSection` / `ProductPreview`：Tab 与预览区 Mobile 布局
- [ ] `ValueAddedServicesSection` / `VersionSchemeSection`
- [ ] `CustomerCasesSection`：地图与案例卡片 Mobile 滚动
- [ ] `FaqSection` / `ActionCtaSection`

### 5.3 内页

- [ ] 版本对比：矩阵横向滚动或 Mobile 简化视图
- [ ] 操作指南列表 / 详情
- [ ] 用户手册：分类栏与正文 Mobile 布局
- [ ] 创建诊所：表单标签与控件 Pad / Mobile 堆叠（当前偏 Web 480px 居中）

### 5.4 弹窗

- [ ] `ModalShell`：Mobile 全屏或底部 sheet；左侧插画 Mobile 隐藏（已有 `md:block` 基础）
- [ ] 登录 / 试用 / 选诊所 / 忘记密码 / 微信绑定：内容与 Tab Mobile 排版
- [ ] 创建诊所页 `ServiceContactPopover`：Mobile 定位与触控区域

### 5.5 验收方式

1. Chrome DevTools：375 / 768 / 1024 / 1920 四档截图对比 Figma
2. 真机：iOS Safari 滚动锁、弹窗、表单输入
3. 每完成一页在本文档对应 `[ ]` 改为 `[x]`

---

## 6. 组件目录

- `src/components/layout/PageContainer.tsx`
- `src/components/ui/Button.tsx` · `Toast.tsx`
- `src/components/sections/*`
- `src/components/modals/*`
- `src/components/create-clinic/*`

## 7. 本地开发

```bash
cd SaaS_Web_2.0
npm run dev:fresh    # 改代码后推荐
npm run preview:open # 打开 Simple Browser 预览
```

访问 http://localhost:3000

**弹窗 dev 快捷入口（仅开发环境 URL 参数，界面无调试文案）：**

| 参数 | 效果 |
| --- | --- |
| `?bindWechat=1` | 打开微信绑定弹窗 |
| `?trialQr=1` | 试用弹窗扫码视图 |
| `?clinicSelect=1` | 选择诊所弹窗 |
| `?createClinic=1` | 创建诊所页 |
| `?createClinicStep=2` | 创建诊所第二步 |
