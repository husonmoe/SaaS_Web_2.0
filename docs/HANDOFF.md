# 前端交付说明

> 光谱云诊官网重构 2.0 · 交付文档  
> 最后更新：2026-06-09

## 1. 项目概览

| 项 | 内容 |
| --- | --- |
| 仓库 | `SaaS_Web_2.0` |
| 技术栈 | Next.js 15 · React 18 · TypeScript · Tailwind CSS 3 |
| 部署 | Cloudflare Workers（OpenNext），**push `main` 后自动部署** |
| 设计稿 | [Figma 官网重构 2.0](https://www.figma.com/design/gnKU0pRP9Fh2R4zPZvNmyk/%E5%AE%98%E7%BD%91%E9%87%8D%E6%9E%84-2.0) |

## 2. 快速上手（5 分钟）

```bash
git clone <repo-url>
cd SaaS_Web_2.0
npm install
cp .dev.vars.example .dev.vars   # 可选，本地 Cloudflare 预览用
npm run dev:fresh              # 改代码后务必用此命令重启
npm run preview:open           # 打开内置预览（带 ?dev= 防缓存）
```

浏览器访问 http://localhost:3000

**注意：** 若本地出现 `http:/` 目录，为 Cursor Simple Browser 误生成，已在 `.gitignore` 忽略，可直接删除。

## 3. 文档索引

| 文档 | 用途 |
| --- | --- |
| [README.md](../README.md) | 项目简介与进度矩阵 |
| [design.md](../design.md) | 设计规范、Figma 节点、实现打勾清单 |
| [CONVENTIONS.md](./CONVENTIONS.md) | 编码规范（断点、栅格、样式、表单） |
| [modals/TrialModal.breakpoints.md](./modals/TrialModal.breakpoints.md) | 试用弹窗三档样式与回滚指引 |
| [design-ref/](../design-ref/) | Pad / Mobile 设计参考截图 |

## 4. 目录结构

```
SaaS_Web_2.0/
├── docs/                    # 交付与规范文档
├── design-ref/              # Figma 导出参考图（mobile/ pad/）
├── public/assets/           # 静态资源（图片、图标）
├── scripts/                 # 本地 dev / 预览脚本
├── src/
│   ├── app/                 # 路由页面（App Router）
│   ├── components/
│   │   ├── MarketingPageShell.tsx   # ★ 营销页外壳（Footer + 弹窗 + Provider）
│   │   ├── layout/          # PageContainer、PageGrid
│   │   ├── sections/        # 首页 / 内页区块
│   │   ├── modals/          # 5 类营销弹窗 + ModalShell
│   │   ├── create-clinic/   # 创建诊所流程
│   │   └── ui/              # Button、Toast 等基础组件
│   ├── contexts/            # 弹窗 / Toast 状态
│   ├── hooks/               # 滚动锁、动画、工具栏定位
│   ├── lib/                 # cn、paths、校验、资源路径
│   └── styles/              # CSS Token 与区块样式
├── design.md
├── tailwind.config.ts       # 断点：md 768 / lg 1024
└── wrangler.jsonc           # Cloudflare 部署配置
```

## 5. 架构要点

### 5.1 页面入口

- **首页：** `src/app/page.tsx` → 11 个 Section 组件
- **内页：** `version-comparison` · `operations-guide` · `user-manual` · `create-clinic`
- **外壳：** 各页面包裹 `MarketingPageShell`，统一挂载 Footer、悬浮工具栏、全部弹窗

### 5.2 弹窗体系

| 弹窗 | 组件 | Context |
| --- | --- | --- |
| 登录 | `LoginModal` | `LoginModalContext` |
| 免费试用 | `TrialModal` | `TrialModalContext` |
| 选择诊所 | `ClinicSelectModal` | `ClinicSelectModalContext` |
| 忘记密码 | `ForgotPasswordModal` | `ForgotPasswordModalContext` |
| 微信绑定 | `WechatBindModal` | `WechatBindModalContext` |

- 共用外壳：`ModalShell`（左插画 + 右内容，`panelVisibleFrom` 控制显隐）
- 弹窗互切：`src/lib/modalHandoff.ts`（无空帧）
- 滚动锁：`useBodyScrollLock`（在 `MarketingPageShell` 内）

### 5.3 样式体系

- **Tailwind 3** + **CSS 变量 Token**（`src/styles/theme-tokens.css`）
- **栅格：** `src/styles/grid-tokens.css` + `PageGrid`（Mobile 4 / Pad 8 / Web 12 列）
- **类名合并：** 仅用 `cn()`（`@/lib/cn`）
- **禁止：** 原生内联 `style`、条件渲染销毁大块 DOM

## 6. 三端进度（交接时状态）

| 模块 | Web | Pad | Mobile |
| --- | --- | --- | --- |
| 首页 11 区块 | ✅ | ✅ | 部分 |
| 内页（版本对比等） | ✅ | 进行中 | 待续 |
| 登录弹窗 | ✅ | ✅ | 待续 |
| **试用弹窗** | ✅ | ✅ | ✅ |
| 其余弹窗 | ✅ | 待续 | 待续 |
| 创建诊所 | ✅ | 待续 | 待续 |

详细打勾见 [design.md §5](../design.md#5-pad--mobile-适配)。

## 7. 本地开发技巧

### 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev:fresh` | 杀端口 + 重启 dev（**改样式后必用**） |
| `npm run preview:open` | 打开预览并带 `?dev=` 时间戳 |
| `npm run preview:verify` | 校验本地 HTML 是否含指定 class |
| `npm run lint` | ESLint |

### 弹窗 Dev 快捷入口（仅开发环境 URL 参数）

| 参数 | 效果 |
| --- | --- |
| `?bindWechat=1` | 微信绑定弹窗 |
| `?trialQr=1` | 试用弹窗 · 扫码视图 |
| `?clinicSelect=1` | 选择诊所弹窗 |
| `?createClinic=1` | 创建诊所页 |
| `?createClinicStep=2` | 创建诊所第二步 |

### 验收视口

Chrome DevTools：**375** · **768** · **1024** · **1920** 四档对比 Figma。

## 8. 部署与发布

- **不要**在本地手动跑 `npm run deploy`（除非明确要求）
- 合并 / push 到 `main` 后，已链接的 Cloudflare 流水线自动部署
- 线上更新需等流水线完成；本地预览不代表线上

## 9. 待办与风险

1. **Pad / Mobile 内页与剩余弹窗** 尚未全部验收
2. **FloatingToolbar** Pad 位置待调整
3. **中文静态资源路径** SSR 需 `encodeURI`（见 design.md §8.1）
4. **无后端接口**：登录 / 试用提交等为前端占位，需后续对接 API
5. `.cursor/rules/` 为本地 AI 辅助规则，**未入库**；规范已摘录至 [CONVENTIONS.md](./CONVENTIONS.md)

## 10. 联系人动线

新同学建议阅读顺序：

1. 本文档 → 2. `CONVENTIONS.md` → 3. `design.md` → 4. 跑通 `dev:fresh` + 打开试用弹窗三档验收
