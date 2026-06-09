# 光谱云诊官网重构 2.0

基于 [Figma 设计稿](https://www.figma.com/design/gnKU0pRP9Fh2R4zPZvNmyk/%E5%AE%98%E7%BD%91%E9%87%8D%E6%9E%84-2.0?node-id=299-12221) 的 Next.js 营销站实现。

## 前端接手

**请先阅读 [docs/HANDOFF.md](./docs/HANDOFF.md)**（交付说明、目录结构、架构要点、待办事项）。

| 文档 | 说明 |
| --- | --- |
| [docs/HANDOFF.md](./docs/HANDOFF.md) | 交付总览与上手流程 |
| [docs/CONVENTIONS.md](./docs/CONVENTIONS.md) | 编码规范（断点、栅格、样式） |
| [design.md](./design.md) | 设计 Token、Figma 节点、实现清单 |
| [docs/modals/TrialModal.breakpoints.md](./docs/modals/TrialModal.breakpoints.md) | 试用弹窗三档样式记录 |

## 技术栈

- Next.js 15 (App Router)
- React 18 + TypeScript
- Tailwind CSS 3
- 三端栅格：Mobile 4列 / Pad 8列 / Web 12列（见 [design.md](./design.md)）

## 开发

```bash
npm install
cp .dev.vars.example .dev.vars   # 可选
npm run dev:fresh                # 改代码后推荐
npm run preview:open             # 打开预览（带 ?dev= 防缓存）
```

浏览器打开 http://localhost:3000

## 当前进度

**Web 端：** 首页 11 个区块、4 个内页、5 类营销弹窗、创建诊所流程均已实现。

**Pad 端：** 首页 11 个区块已完成；试用 / 登录弹窗已对齐 520×600；内页与其余弹窗待续。

**Mobile 端：** 试用弹窗已完成 350×450 分档样式；首页与其余模块待续。

| 模块 | Web | Pad | Mobile |
| --- | --- | --- | --- |
| 首页全区块 | ✅ | ✅ | ⏳ |
| 版本对比 / 操作指南 / 用户手册 | ✅ | ⏳ | ⏳ |
| 登录弹窗 | ✅ | ✅ | ⏳ |
| 试用弹窗 | ✅ | ✅ | ✅ |
| 其余弹窗 | ✅ | ⏳ | ⏳ |
| 创建诊所 | ✅ | ⏳ | ⏳ |

完整规划与打勾清单见 [design.md](./design.md)。

## 部署

Push / 合并到 `main` 后由已配置的 Cloudflare 流水线自动部署，无需本地手动 `deploy`。
