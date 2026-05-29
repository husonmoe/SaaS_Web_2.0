# 光谱云诊官网重构 2.0

基于 [Figma 设计稿](https://www.figma.com/design/gnKU0pRP9Fh2R4zPZvNmyk/%E5%AE%98%E7%BD%91%E9%87%8D%E6%9E%84-2.0?node-id=299-12221) 的 Next.js 营销站实现。

## 技术栈

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS 3
- 三端栅格：Mobile 4列 / Pad 8列 / Web 12列（见 `design.md`）

## 开发

```bash
npm install
npm run dev
```

浏览器打开 http://localhost:3000

## 当前进度

| 区块 | 状态 |
| --- | --- |
| 顶栏 Header | ✅ |
| Hero 首屏 | ✅（产品 mockup 占位） |
| 数据统计 | ✅ |
| 页脚 Footer | ✅ |
| 中间 5 个内容区 | ⏳ 占位，待按 Figma 节点继续实现 |

设计规范详见 [`design.md`](./design.md)。
