"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { label: "诊所系统", href: "#" },
  { label: "版本对比", href: "#" },
  { label: "运营指南", href: "#" },
  { label: "用户手册", href: "#" },
  { label: "药师帮", href: "#" },
];

/** 顶栏高度；滚动 0→72px 时背景由透明过渡到不透明白底 */
const HEADER_HEIGHT = 72;

const LOGO_SRC = "/assets/LOGO.png";
const PHONE_ICON_SRC = "/assets/figma-cache/phone-icon.svg";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [scrollFill, setScrollFill] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrollFill(Math.min(window.scrollY / HEADER_HEIGHT, 1));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const useHoverTransition = hovered || menuOpen;
  const fillOpacity = menuOpen
    ? 1
    : hovered
      ? 1
      : scrollFill;

  return (
    <header
      className="sticky top-0 z-50 w-full max-w-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 背景层：默认透明；滚动 0–72px 渐显；hover 时 300ms 过渡到白底 */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-[72px] border-b border-[var(--border-light)] bg-white/95 backdrop-blur-sm",
          useHoverTransition && "transition-opacity duration-300 ease-out",
        )}
        style={{ opacity: fillOpacity }}
        aria-hidden
      />

      <div className="relative z-10 flex h-[72px] w-full items-center gap-4 px-[var(--page-margin-x)] lg:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="光谱云诊"
        >
          <Image
            src={LOGO_SRC}
            alt="光谱云诊"
            width={116}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <div className="hidden min-w-0 flex-1 md:flex md:justify-center">
          <nav
            className="flex w-full max-w-[1200px] items-center gap-3"
            aria-label="主导航"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="shrink-0 rounded-[10px] px-5 py-3 text-lg text-[var(--text-base)] hover:bg-[var(--bg-shell)]"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="tel:4006665061"
              className="ml-auto flex shrink-0 items-center gap-2 text-lg text-[var(--text-muted)]"
            >
              <Image
                src={PHONE_ICON_SRC}
                alt=""
                width={24}
                height={24}
                className="size-6"
                unoptimized
              />
              400-666-5061
            </a>
          </nav>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3 md:ml-0">
          <Button variant="outline" className="hidden sm:inline-flex">
            登录诊所
          </Button>
          <Button className="hidden sm:inline-flex">免费试用</Button>
          <button
            type="button"
            className="inline-flex size-10 flex-col items-center justify-center gap-1 rounded-lg border border-[var(--border-light)] bg-white/80 md:hidden"
            aria-label="打开菜单"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="block h-0.5 w-5 bg-[var(--text-base)]" />
            <span className="block h-0.5 w-5 bg-[var(--text-base)]" />
            <span className="block h-0.5 w-5 bg-[var(--text-base)]" />
          </button>
        </div>
      </div>

      <nav
        className={cn(
          "relative z-10 flex flex-col gap-1 border-t border-[var(--border-light)] bg-white px-[var(--page-margin-x)] py-4 md:hidden",
          menuOpen ? "flex" : "hidden",
        )}
        aria-label="主导航"
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-[10px] px-5 py-3 text-lg text-[var(--text-base)] hover:bg-[var(--bg-shell)]"
          >
            {item.label}
          </Link>
        ))}
        <a
          href="tel:4006665061"
          className="flex items-center gap-2 px-5 py-3 text-lg text-[var(--text-muted)]"
        >
          <Image
            src={PHONE_ICON_SRC}
            alt=""
            width={24}
            height={24}
            className="size-6"
            unoptimized
          />
          400-666-5061
        </a>
      </nav>
    </header>
  );
}
