"use client";

import Image from "next/image";
import { forwardRef, useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { useLoginModal } from "@/contexts/LoginModalContext";
import { useTrialModal } from "@/contexts/TrialModalContext";
import { SITE_FOOTER_ID } from "@/lib/floating-toolbar-anchor";
import { EXTERNAL_PATHS } from "@/lib/paths";

const FOOTER_SOCIAL_BUTTON_CLASS =
  "inline-flex size-7 items-center justify-center rounded-full bg-[#BBC4CB] text-[#BBC4CB] transition-colors hover:bg-[#6D777E] hover:text-[#6D777E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

const ICONS = {
  logo: "/assets/LOGO.png",
  qr: "/assets/figma-cache/qr.png",
  channelsQr: "/assets/figma-cache/footer-channels-qr.png",
  officialAccountQr: "/assets/figma-cache/footer-official-account-qr.png",
  social: {
    wechat: "/assets/figma-cache/social-1.svg",
    channels: "/assets/figma-cache/social-2.svg",
    xiaohongshu: "/assets/figma-cache/social-xiaohongshu-glyph.svg",
  },
  badge: "/assets/figma-cache/badge.png",
};

const FOOTER_SOCIAL_LINKS = [
  {
    id: "official-account",
    label: "光谱云诊公众号",
    hoverQr: ICONS.officialAccountQr,
    hoverCaption: "光谱云诊公众号",
  },
  {
    id: "channels",
    label: "光谱云诊视频号",
    hoverQr: ICONS.channelsQr,
    hoverCaption: "光谱云诊视频号",
  },
  { id: "xiaohongshu", label: "小红书" },
] as const;

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

const FOOTER_LINK_CLASS =
  "text-base text-[var(--text-secondary)] hover:text-[var(--text-base)] active:text-[var(--text-base)]";

type ProductFooterLink =
  | { label: string; action: "login" }
  | { label: string; action: "trial" }
  | { label: string; action: "external"; href: string };

const PRODUCT_LINKS: ProductFooterLink[] = [
  { label: "诊所登录", action: "login" },
  { label: "免费试用", action: "trial" },
  {
    label: "药师帮商城",
    action: "external",
    href: EXTERNAL_PATHS.yaoshibangLogin,
  },
];

const FRIEND_LINKS = ["药师帮官网", "光谱健康官网", "掌店易Pro"];

const CONTACT_INFO = [
  "400-666-5061",
  "zhengsuo@ysbang.cn",
  "09:30 - 18:30",
];

export const SiteFooter = forwardRef<HTMLElement>(function SiteFooter(_, ref) {
  return (
    <footer id={SITE_FOOTER_ID} ref={ref} className="bg-[var(--bg-shell)]">
      <PageContainer>
        {/* 移动端 · 服务特性：四列图标 + 标题 */}
        <div className="flex justify-between gap-0 py-6 md:hidden">
          {SERVICES.map((item) => (
            <div
              key={item.title}
              className="flex h-fit w-fit flex-col items-center gap-1"
            >
              <Image
                src={item.iconSrc}
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0"
                unoptimized
              />
              <p className="text-center text-sm leading-[22px] text-[var(--text-secondary)]">
                {item.title}
              </p>
            </div>
          ))}
        </div>

        {/* 桌面端 · 服务特性：图标 + 标题 */}
        <div className="hidden h-fit justify-start gap-0 py-6 md:flex">
          {SERVICES.map((item) => (
            <div
              key={item.title}
              className="flex h-fit w-full flex-row items-center justify-start gap-1"
            >
              <Image
                src={item.iconSrc}
                alt=""
                width={44}
                height={44}
                className="size-11 shrink-0"
                unoptimized
              />
              <div className="min-w-0">
                <p className="text-base font-normal leading-6 text-[var(--text-secondary)]">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        <hr className="border-[var(--border-light)]" />

        {/* 移动端 · 品牌 + 社交 / 联系我们 */}
        <div className="grid grid-cols-2 items-stretch py-6 md:hidden">
          <div className="flex w-full flex-col items-start justify-between gap-1 self-stretch">
            <Image
              src={ICONS.logo}
              alt="光谱云诊"
              width={116}
              height={32}
              className="h-7 w-[101.5px]"
            />
            <div className="my-1 flex items-start gap-4">
              {FOOTER_SOCIAL_LINKS.map((item) => (
                <FooterSocialIcon key={item.id} {...item} />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start justify-start gap-2 self-stretch">
            <p className="text-base font-medium leading-6 text-[var(--text-base)]">
              联系我们
            </p>
            <ul className="flex w-full flex-col items-start gap-1">
              {CONTACT_INFO.map((line) => (
                <li
                  key={line}
                  className="text-sm leading-[22px] text-[var(--text-secondary)]"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 桌面端 · 品牌 / 产品入口 / 友情链接 / 联系我们 */}
        <div className="hidden gap-6 py-8 md:flex">
          <div className="flex w-full flex-1 flex-col items-start justify-between gap-6 md:min-w-0">
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

          <FooterProductColumn />
          <FooterColumn title="友情链接" links={FRIEND_LINKS} />
          <FooterColumn
            title="联系我们"
            links={CONTACT_INFO}
            interactive={false}
          />
        </div>

        <hr className="border-[var(--border-light)]" />

        {/* 移动端 · 版权信息 */}
        <div className="flex flex-col items-center gap-2 py-6 text-center md:hidden">
          <p className="text-xs leading-5 text-[var(--text-tertiary)]">
            © 2023 广州光谱健康科技有限公司版权所有
          </p>
          <p className="inline-flex flex-wrap items-center justify-center gap-1 text-xs leading-5 text-[var(--text-tertiary)]">
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
          </p>
        </div>

        {/* 桌面端 · 社交 + 版权 */}
        <div className="hidden flex-col items-center gap-4 py-6 text-left md:flex lg:justify-between">
          <div className="flex gap-4">
            {FOOTER_SOCIAL_LINKS.map((item) => (
              <FooterSocialIcon key={item.id} {...item} />
            ))}
          </div>
          <div className="flex flex-nowrap items-center justify-end gap-5 text-sm leading-[22px] text-[var(--text-tertiary)]">
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

function FooterProductColumn() {
  const { open: openLogin } = useLoginModal();
  const { open: openTrial } = useTrialModal();

  return (
    <div className="w-full flex-1 md:min-w-0">
      <p className="mb-8 font-medium text-[var(--text-base)]">产品入口</p>
      <ul className="flex flex-col gap-4">
        {PRODUCT_LINKS.map((link) => (
          <li key={link.label}>
            {link.action === "external" ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={FOOTER_LINK_CLASS}
              >
                {link.label}
              </a>
            ) : (
              <button
                type="button"
                className={FOOTER_LINK_CLASS}
                onClick={
                  link.action === "login"
                    ? () => openLogin()
                    : () => openTrial()
                }
              >
                {link.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

type FooterSocialIconProps = {
  id: (typeof FOOTER_SOCIAL_LINKS)[number]["id"];
  label: string;
  hoverQr?: string;
  hoverCaption?: string;
};

function FooterSocialGlyph({
  id,
  className = "size-7 shrink-0",
}: {
  id: FooterSocialIconProps["id"];
  className?: string;
}) {
  const src =
    id === "official-account"
      ? ICONS.social.wechat
      : id === "channels"
        ? ICONS.social.channels
        : ICONS.social.xiaohongshu;

  return (
    <Image
      src={src}
      alt=""
      width={28}
      height={28}
      className={className}
      unoptimized
    />
  );
}

function FooterSocialIcon({
  id,
  label,
  hoverQr,
  hoverCaption,
}: FooterSocialIconProps) {
  const popupTitleId = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const iconImage = <FooterSocialGlyph id={id} />;

  useEffect(() => {
    setMounted(true);
  }, []);

  const closePopup = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closePopup, open]);

  if (!hoverQr) {
    return (
      <span className={FOOTER_SOCIAL_BUTTON_CLASS} aria-label={label}>
        {iconImage}
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        className={FOOTER_SOCIAL_BUTTON_CLASS}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        {iconImage}
      </button>

      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden overscroll-none p-4">
              <button
                type="button"
                className="absolute inset-0 bg-[#000000]/40"
                aria-label="关闭弹窗"
                onClick={closePopup}
              />

              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={popupTitleId}
                className="relative flex flex-col items-center gap-2 rounded-2xl border border-[var(--border-light)] bg-white px-4 pb-6 pt-[15px] shadow-[0_8px_12px_rgba(15,47,76,0.08)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hoverQr}
                  alt={hoverCaption ?? label}
                  width={220}
                  height={220}
                  className="block size-[220px] shrink-0 rounded-none border-0 object-contain outline-none"
                  decoding="async"
                />
                {hoverCaption ? (
                  <p
                    id={popupTitleId}
                    className="text-base leading-6 text-[var(--text-secondary)]"
                  >
                    {hoverCaption}
                  </p>
                ) : (
                  <p id={popupTitleId} className="sr-only">
                    {label}
                  </p>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function FooterColumn({
  title,
  links,
  interactive = true,
}: {
  title: string;
  links: string[];
  interactive?: boolean;
}) {
  return (
    <div className="w-full flex-1 md:min-w-0">
      <p className="mb-8 font-medium text-[var(--text-base)]">{title}</p>
      <ul className="flex flex-col gap-4">
        {links.map((link) => (
          <li key={link}>
            {interactive ? (
              <a href="#" className={FOOTER_LINK_CLASS}>
                {link}
              </a>
            ) : (
              <span className="text-base text-[var(--text-secondary)]">
                {link}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
