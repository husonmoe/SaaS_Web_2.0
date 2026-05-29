import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";
import { PageContainer } from "@/components/layout/PageContainer";

const ICONS = {
  logo: "/assets/LOGO.png",
  qr: "/assets/figma-cache/qr.png",
  social: [
    "/assets/figma-cache/social-1.svg",
    "/assets/figma-cache/social-2.svg",
    "/assets/figma-cache/social-3.svg",
  ],
  badge: "/assets/figma-cache/badge.png",
};

const SERVICES = [
  {
    title: "在线客服",
    desc: "7 x 12小时专属客服品质服务",
    iconSrc: "/assets/icon_在线客服.svg",
  },
  {
    title: "系统培训",
    desc: "免费专人培训，助您轻松上手系统",
    iconSrc: "/assets/icon_系统培训.svg",
  },
  {
    title: "数据搬家",
    desc: "协助数据整理、导出以及导入",
    iconSrc: "/assets/icon_数据搬家.svg",
  },
  {
    title: "持续升级",
    desc: "系统持续升级、迭代数据自动备份",
    iconSrc: "/assets/icon_持续升级.svg",
  },
];

const PRODUCT_LINKS = ["诊所登录", "免费试用", "药师帮商城"];
const FRIEND_LINKS = ["药师帮官网", "光谱健康官网", "掌店易Pro"];
const CONTACT = [
  "客服 400-666-5061",
  "邮箱 zhengsuo@ysbang.cn",
  "服务时间 09:30 - 18:30",
];

export const SiteFooter = forwardRef<HTMLElement>(function SiteFooter(_, ref) {
  return (
    <footer ref={ref} className="bg-[var(--bg-shell)]">
      <PageContainer>
        <div className="grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((item) => (
            <div key={item.title} className="flex items-center gap-2">
              <Image
                src={item.iconSrc}
                alt=""
                width={44}
                height={44}
                className="size-11 shrink-0"
                unoptimized
              />
              <div>
                <p className="font-medium text-[var(--text-base)]">
                  {item.title}
                </p>
                <p className="text-sm text-[var(--text-tertiary)]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <hr className="border-[var(--border-light)]" />

        <div className="grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex w-full flex-col gap-8">
            <Image
              src={ICONS.logo}
              alt="光谱云诊"
              width={116}
              height={32}
              className="h-8 w-[116px]"
            />
            <div className="size-[110px] overflow-hidden rounded-md">
              <Image
                src={ICONS.qr}
                alt="二维码"
                width={106}
                height={106}
                className="size-full object-cover"
                unoptimized
              />
            </div>
          </div>

          <FooterColumn title="产品入口" links={PRODUCT_LINKS} />
          <FooterColumn title="友情链接" links={FRIEND_LINKS} />
          <FooterColumn title="联系我们" links={CONTACT} />
        </div>

        <hr className="border-[var(--border-light)]" />

        <div className="flex flex-col gap-6 py-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-4">
            {ICONS.social.map((src) => (
              <Image
                key={src}
                src={src}
                alt=""
                width={24}
                height={24}
                className="size-6"
                unoptimized
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)]">
            <span>© 2023 广州光谱健康科技有限公司版权所有</span>
            <span>粤ICP备2021101844号-2</span>
            <span className="inline-flex items-center gap-1">
              <Image
                src={ICONS.badge}
                alt=""
                width={16}
                height={16}
                unoptimized
              />
              粤B2-20220314
            </span>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
});

SiteFooter.displayName = "SiteFooter";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: string[];
}) {
  return (
    <div className="w-full pl-[52px]">
      <p className="mb-8 font-medium text-[var(--text-base)]">{title}</p>
      <ul className="flex flex-col gap-4">
        {links.map((link) => (
          <li key={link}>
            <Link
              href="#"
              className="text-base text-[var(--text-secondary)] hover:text-[var(--text-base)] active:text-[var(--text-base)]"
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
