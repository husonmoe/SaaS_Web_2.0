"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoginModalButton } from "@/components/modals/LoginModalButton";
import { TrialModalButton } from "@/components/modals/TrialModalButton";
import { useForgotPasswordModal } from "@/contexts/ForgotPasswordModalContext";
import { useLoginModal } from "@/contexts/LoginModalContext";
import { useTrialModal } from "@/contexts/TrialModalContext";
import { useWechatBindModal } from "@/contexts/WechatBindModalContext";
import { cn } from "@/lib/cn";
import { EXTERNAL_PATHS, PATHS } from "@/lib/paths";

type NavItem =
  | { label: string; href: string; external?: false }
  | { label: string; href: string; external: true };

const NAV_ITEMS: NavItem[] = [
  { label: "诊所系统", href: PATHS.home },
  { label: "版本对比", href: PATHS.versionComparison },
  { label: "运营指南", href: PATHS.operationsGuide },
  { label: "用户手册", href: PATHS.userManual },
  { label: "药师帮", href: EXTERNAL_PATHS.yaoshibangLogin, external: true },
];

/** 顶栏高度；滚动 0→72px 时背景由透明过渡到不透明白底 */
const HEADER_HEIGHT = 72;

/** 弹窗锁滚动时 body 为 fixed，window.scrollY 会变为 0，需从 body.top 读取真实偏移 */
function getEffectiveScrollY(): number {
  const { body } = document;
  if (body.style.position === "fixed" && body.style.top) {
    const parsed = Number.parseInt(body.style.top, 10);
    if (!Number.isNaN(parsed)) return Math.max(0, -parsed);
  }
  return window.scrollY;
}

const LOGO_SRC = "/assets/LOGO.png";
const PHONE_ICON_SRC = "/assets/figma-cache/phone-icon.svg";

const NAV_LINK_CLASS =
  "shrink-0 rounded-[10px] px-5 py-3 text-lg text-[var(--text-base)] hover:bg-[var(--bg-shell)]";

const MOBILE_NAV_LINK_CLASS =
  "flex h-12 shrink-0 items-center justify-start rounded-none px-[var(--page-margin-x)] text-base text-[var(--text-base)] hover:bg-[var(--bg-shell)]";

function NavLink({
  item,
  onNavigate,
  onPointerEnter,
  linkClassName = NAV_LINK_CLASS,
}: {
  item: NavItem;
  onNavigate?: () => void;
  onPointerEnter?: (event: React.MouseEvent) => void;
  linkClassName?: string;
}) {
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
        onMouseEnter={onPointerEnter}
        onClick={() => onNavigate?.()}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      className={linkClassName}
      onMouseEnter={onPointerEnter}
      onClick={() => onNavigate?.()}
    >
      {item.label}
    </Link>
  );
}

export function SiteHeader() {
  const { isOpen: loginOpen } = useLoginModal();
  const { isOpen: trialOpen } = useTrialModal();
  const { isOpen: forgotOpen } = useForgotPasswordModal();
  const { isOpen: bindWechatOpen } = useWechatBindModal();
  const modalOpen = loginOpen || trialOpen || forgotOpen || bindWechatOpen;

  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pointerInHeader, setPointerInHeader] = useState(false);
  const [scrollFill, setScrollFill] = useState(0);

  const syncScrollFill = () => {
    setScrollFill(Math.min(getEffectiveScrollY() / HEADER_HEIGHT, 1));
  };

  const updatePointerInHeader = useCallback(
    (clientX: number, clientY: number) => {
      const header = headerRef.current;
      if (!header) return;

      const hit = document.elementFromPoint(clientX, clientY);
      if (hit instanceof Element && header.contains(hit)) {
        setPointerInHeader(true);
        return;
      }

      // 弹窗遮罩挡住 hit 检测时，仍按顶栏区域坐标判断（如鼠标停在「登录」按钮上）
      if (modalOpen) {
        const { left, right, top, bottom } = header.getBoundingClientRect();
        setPointerInHeader(
          clientX >= left &&
            clientX <= right &&
            clientY >= top &&
            clientY <= bottom,
        );
        return;
      }

      setPointerInHeader(false);
    },
    [modalOpen],
  );

  useEffect(() => {
    syncScrollFill();
    window.addEventListener("scroll", syncScrollFill, { passive: true });
    return () => window.removeEventListener("scroll", syncScrollFill);
  }, []);

  /** 锁滚动后 window.scrollY 归零，需在 body.fixed 生效后按真实偏移重算背景 */
  useEffect(() => {
    const id = requestAnimationFrame(syncScrollFill);
    return () => cancelAnimationFrame(id);
  }, [modalOpen]);

  /** 弹窗遮罩会触发 header 的 mouseleave，用坐标判断指针是否仍在顶栏区域 */
  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      updatePointerInHeader(event.clientX, event.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [updatePointerInHeader]);

  const headerActive = hovered || pointerInHeader;
  const useHoverTransition = headerActive || menuOpen;
  const fillOpacity = menuOpen ? 1 : headerActive ? 1 : scrollFill;
  const headerInverted = fillOpacity >= 1;

  const activateHeader = (clientX: number, clientY: number) => {
    setHovered(true);
    updatePointerInHeader(clientX, clientY);
  };

  const deactivateHeader = (event: React.MouseEvent<HTMLElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    setHovered(false);
    setPointerInHeader(false);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full max-w-none"
      onMouseOver={(event) => {
        if (event.currentTarget.contains(event.target as Node)) {
          activateHeader(event.clientX, event.clientY);
        }
      }}
      onMouseOut={deactivateHeader}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
          return;
        }
        setHovered(false);
      }}
    >
      {/* 背景层：默认透明；滚动 0–72px 渐显；hover 时 300ms 过渡到白底 */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-12 bg-white/95 backdrop-blur-sm lg:h-[72px]",
          "border-b border-[var(--border-light)]",
          menuOpen && "max-lg:border-b-0",
          useHoverTransition && "transition-opacity duration-300 ease-out",
        )}
        style={{ opacity: fillOpacity }}
        aria-hidden
      />

      <div className="relative z-10 flex h-12 w-full items-center justify-center gap-4 pl-4 pr-3 lg:h-[72px] lg:px-6">
        <Link
          href="/"
          className="flex w-[222px] shrink-0 items-center"
          aria-label="光谱云诊"
          onMouseEnter={(event) => activateHeader(event.clientX, event.clientY)}
        >
          <Image
            src={LOGO_SRC}
            alt="光谱云诊"
            width={116}
            height={32}
            className="h-6 w-auto lg:h-8"
            priority
          />
        </Link>

        <div className="hidden min-w-0 flex-1 lg:flex lg:justify-center">
          <nav
            className="flex w-full max-w-[1200px] items-center gap-3"
            aria-label="主导航"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                onPointerEnter={(event) =>
                  activateHeader(event.clientX, event.clientY)
                }
              />
            ))}
            <span
              className="ml-auto flex shrink-0 items-center gap-2 text-lg text-[var(--text-muted)]"
              aria-label="客服电话 400-666-5061"
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
            </span>
          </nav>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3 lg:ml-0">
          <LoginModalButton
            variant="outline"
            className={cn(
              "hidden lg:inline-flex",
              headerInverted &&
                "border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,white)] active:bg-[color-mix(in_srgb,var(--color-primary)_16%,white)]",
            )}
            onMouseEnter={(event) => activateHeader(event.clientX, event.clientY)}
          >
            登录诊所
          </LoginModalButton>
          <TrialModalButton
            className="hidden lg:inline-flex"
            onMouseEnter={(event) => activateHeader(event.clientX, event.clientY)}
          >
            免费试用
          </TrialModalButton>
          <button
            type="button"
            className={cn(
              "inline-flex h-7 w-7 shrink-0 flex-col items-center justify-center gap-[3px] lg:hidden",
              menuOpen && "is-active",
            )}
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={menuOpen}
            onMouseEnter={(event) => activateHeader(event.clientX, event.clientY)}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span
              className={cn(
                "block h-0.5 w-4 origin-center bg-[var(--text-base)] transition-all duration-300 ease-out",
                menuOpen && "translate-y-[5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-4 origin-center bg-[var(--text-base)] transition-all duration-300 ease-out",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-4 origin-center bg-[var(--text-base)] transition-all duration-300 ease-out",
                menuOpen && "-translate-y-[5px] -rotate-45",
              )}
            />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 top-12 z-40 bg-[#000000]/40 lg:hidden"
            aria-label="关闭菜单"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            className="fixed inset-x-0 top-12 z-50 flex flex-col gap-0 bg-white lg:hidden"
            aria-label="主导航"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                linkClassName={MOBILE_NAV_LINK_CLASS}
                onNavigate={() => setMenuOpen(false)}
                onPointerEnter={(event) =>
                  activateHeader(event.clientX, event.clientY)
                }
              />
            ))}
          </nav>
        </>
      ) : null}
    </header>
  );
}
