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

> **当前阶段：** Pad 首页适配进行中（`feat-pad-adapt`）→ Mobile 适配待续

### 4.1 首页区块

| 顺序 | 区块 | Figma node | 前端 | Web | Pad |
| --- | --- | --- | --- | --- | --- |
| 1 | Header | `163:49698` | `SiteHeader` | ✅ | ✅ |
| 2 | Hero | `97:33949` | `HeroSection` | ✅ | ✅ |
| 3 | 数据统计 | `97:36263` | `StatsSection` | ✅ | ✅ |
| 4 | 功能亮点 | `97:37256` | `WhyChooseSection` | ✅ | ✅ |
| 5 | 产品模块 | `97:36338` | `ProductSection` + `ProductPreview` | ✅ | ✅ |
| 6 | 增值服务 | — | `ValueAddedServicesSection` | ✅ | ✅ |
| 7 | 版本方案 | `97:37432` | `VersionSchemeSection` | ✅ | ✅ |
| 8 | 客户案例 | `140:15673` | `CustomerCasesSection` | ✅ | ✅ |
| 9 | FAQ | `97:37587` | `FaqSection` | ✅ | ✅ |
| 10 | CTA | `228:17347` | `ActionCtaSection` | ✅ | ✅ |
| 11 | Footer | `185:12946` | `SiteFooter` | ✅ | ✅ |
| — | 悬浮工具栏 | — | `FloatingToolbar` | ✅ | ⏳ |

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

> 对照 Figma Pad（834px 画板）与 Mobile（375px 画板），按视口 768–1023 / 375–767 验收。

### 5.1 全局与布局

- [x] `SiteHeader`：Pad 顶栏 `justify-between`、Logo 宽度与 Web 居中切换
- [x] `SiteFooter`：Pad 四列 flex 布局、服务条横排、间距与版权区对齐
- [ ] `FloatingToolbar`：Pad 位置与显隐
- [x] `PageContainer` / `PageGrid`：首页各 Section 已按 768 边距验收（沿用全局 Token）

### 5.2 首页各 Section

- [x] `HeroSection`：Pad 顶栏偏移 64px、标题单行、特性标签横排、mockup 间距
- [x] `StatsSection` / `WhyChooseSection`：Pad 区块间距 `py-80`
- [x] `ProductSection` / `ProductPreview`：Pad Tab 与 Mobile 预览 headline/文案字号；中文预览图 SSR 需 `encodeURI`（见 §8）
- [x] `ValueAddedServicesSection` / `VersionSchemeSection`：Pad 纵向卡片堆叠与字号
- [x] `CustomerCasesSection`：Pad 卡片定高、跑马灯宽度与间距
- [x] `FaqSection` / `ActionCtaSection`：Pad 栅格与 CTA 双列（`action-cta.css`）

### 5.3 内页

- [ ] 版本对比：矩阵横向滚动或 Mobile 简化视图
- [ ] 操作指南列表 / 详情
- [ ] 用户手册：分类栏与正文 Mobile 布局
- [ ] 创建诊所：表单标签与控件 Pad / Mobile 堆叠（当前偏 Web 480px 居中）

### 5.4 弹窗

- [ ] `ModalShell`：Mobile 全屏或底部 sheet；左侧插画 Mobile 隐藏（已有 `md:block` 基础）
- [ ] 登录 / 试用 / 选诊所 / 忘记密码 / 微信绑定：内容与 Tab Mobile 排版
- [ ] 创建诊所页 `ServiceContactPopover`：Mobile 定位与触控区域

### 5.5 Mobile 首页（待 `feat-mobile-adapt` 合并后核对）

- [ ] 各 Section 375px 画板逐项打勾（Mobile 分支已有部分实现，需与 Pad 分支对齐）

### 5.6 验收方式

1. Chrome DevTools：375 / 768 / 1024 / 1920 四档截图对比 Figma
2. 真机：iOS Safari 滚动锁、弹窗、表单输入
3. 每完成一项在本文档对应 `[ ]` 改为 `[x]`

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

---

## 8. 实现备忘

### 8.1 中文静态资源路径

`public/assets/image_product_module/` 下预览图文件名含中文。SSR 时若 `<img src>` 直接使用 Unicode 路径，Next.js dev 可能报 `ByteString` 错误。

**约定：** 数据层（`productModuleContent.ts`）存原始路径；仅在渲染/预加载时对 `src` 调用一次 `encodeURI`（见 `ProductPreview.tsx`、`ProductModuleTabs.tsx`）。**禁止**在数据层与渲染层重复编码，否则静态资源 404。

### 8.2 Pad 首页样式补充

| 文件 | 说明 |
| --- | --- |
| `src/styles/hero-bg.css` | Mobile/Pad 顶栏偏移 64px，Web（≥1024）72px |
| `src/styles/action-cta.css` | Pad+ CTA 双列：`minmax(0,1fr) + auto` |
