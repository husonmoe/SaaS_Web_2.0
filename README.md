# 光谱云诊官网重构 2.0

基于 [Figma 设计稿](https://www.figma.com/design/gnKU0pRP9Fh2R4zPZvNmyk/%E5%AE%98%E7%BD%91%E9%87%8D%E6%9E%84-2.0?node-id=299-12221) 的 Next.js 营销站实现。

## 技术栈

- Next.js 15 (App Router)
- React 18 + TypeScript
- Tailwind CSS 3
- 三端栅格：Mobile 4列 / Pad 8列 / Web 12列（见 [`design.md`](./design.md)）

## 开发

```bash
npm install
npm run dev:fresh
npm run preview:open
```

浏览器打开 http://localhost:3000

## 当前进度

**Web 端：** 首页 11 个区块、4 个内页、5 类营销弹窗、创建诊所流程均已实现。

**下一阶段：** Pad（768–1023px）与 Mobile（375–767px）适配，详见 [`design.md` §5](./design.md#5-下一阶段pad--mobile-适配)。

| 模块 | Web | Pad | Mobile |
| --- | --- | --- | --- |
| 首页全区块 | ✅ | ⏳ | ⏳ |
| 版本对比 / 操作指南 / 用户手册 | ✅ | ⏳ | ⏳ |
| 登录 / 试用 / 选诊所等弹窗 | ✅ | ⏳ | ⏳ |
| 创建诊所 | ✅ | ⏳ | ⏳ |

完整规划与打勾清单见 [`design.md`](./design.md)。
