import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "光谱云诊—开诊所，就用光谱云诊",
  description:
    "光谱云诊，简单易上手的诊所管理系统，支持0打字输入、一键入库。包含患者挂号、电子病历、智能开方、药品进销存、患者管理等核心功能。",
  keywords:
    "光谱诊所管家、光谱健康、诊所管家、电子病历、电子处方、诊所系统、诊所软件、门诊系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
