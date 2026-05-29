# 光谱云诊官网重构 2.0 · 设计规范

## 1. 文档信息

| 项目 | 内容 |
| --- | --- |
| Figma 文件 | [官网重构-2.0](https://www.figma.com/design/gnKU0pRP9Fh2R4zPZvNmyk/%E5%AE%98%E7%BD%91%E9%87%8D%E6%9E%84-2.0) |
| 首页 Section | `299:12221`（首页） |
| Web 画板 | `97:33948` · 1920×7676 |
| Pad 画板 | `143:15837` · 834px |
| Mobile 画板 | `149:9127` · 375px |
| 前端工程 | `SaaS_Web_2.0` · Next.js 14 + Tailwind |

## 2. 响应式栅格

| 档位 | 画板宽 | 列数 | Gutter | 边距/容器 |
| --- | --- | --- | --- | --- |
| Mobile | 375 | 4 | 24px | 左右 24px |
| Pad | 834 | 8 | 24px | 左右 64px |
| Web | 1920 | 12 | 24px | 内容 max 1200px 居中 |

**代码断点：** 默认 Mobile · `md: 834px` · `lg: 1200px`

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

## 4. 首页区块（Web 自上而下）

| 顺序 | 区块 | Figma node | 前端状态 |
| --- | --- | --- | --- |
| 1 | Header | `163:49698` | ✅ `SiteHeader` |
| 2 | Hero | `97:33949` | ✅ `HeroSection`（mockup 待补资产） |
| 3 | 数据统计 | `97:36263` | ✅ `StatsSection` |
| 4 | 产品模块 | `97:36338` | ✅ `ProductSection` |
| 5 | 功能亮点 | `97:37256` | ⏳ 占位 |
| 6 | 客户案例 | `140:15673` | ⏳ 占位 |
| 7 | 版本方案 | `97:37432` | ⏳ 占位 |
| 8 | FAQ | `97:37587` | ⏳ 占位 |
| 9 | CTA | `228:17347` | ⏳ 占位 |
| 10 | Footer | `185:12946` | ✅ `SiteFooter` |

## 5. 组件目录

- `src/components/layout/PageContainer.tsx`
- `src/components/ui/Button.tsx`
- `src/components/sections/*`

## 6. 本地开发

```bash
cd SaaS_Web_2.0
npm run dev
```

访问 http://localhost:3000
