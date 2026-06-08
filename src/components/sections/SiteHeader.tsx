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
  "flex h-10 shrink-0 items-center justify-center rounded-[8px] px-3 py-2 text-[15px] leading-[22px] text-[var(--text-base)] hover:bg-[var(--bg-shell)] lg:h-auto lg:px-5 lg:py-3 lg:text-lg";

const MOBILE_NAV_LINK_CLASS =
  "flex h-12 shrink-0 items-center justify-start rounded-none px-6 text-base text-[var(--text-base)] hover:bg-[var(--bg-shell)]";

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

  const resetHeaderInteractionState = useCallback(() => {
    setHovered(false);
    setPointerInHeader(false);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMenuOpen(false);
    resetHeaderInteractionState();
    requestAnimationFrame(syncScrollFill);
  }, [resetHeaderInteractionState]);

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

  /** 锁滚动后 window.scrollY 归零；弹窗关闭后重置 hover 态并按真实偏移重算背景 */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (!modalOpen) {
        resetHeaderInteractionState();
      }
      syncScrollFill();
    });
    return () => cancelAnimationFrame(id);
  }, [modalOpen, resetHeaderInteractionState]);

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
          "pointer-events-none absolute inset-x-0 top-0 h-16 bg-white/95 backdrop-blur-sm lg:h-[72px]",
          "border-b border-[var(--border-light)]",
          menuOpen && "max-md:border-b-0",
          useHoverTransition && "transition-opacity duration-300 ease-out",
        )}
        style={{ opacity: fillOpacity }}
        aria-hidden
      />

      <div className="relative z-10 flex h-16 w-full items-center justify-between gap-4 pl-4 pr-3 md:justify-center md:px-4 lg:h-[72px] lg:justify-center lg:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center md:w-fit lg:w-[222px]"
          aria-label="光谱云诊"
          onMouseEnter={(event) => activateHeader(event.clientX, event.clientY)}
        >
          <Image
            src={LOGO_SRC}
            alt="光谱云诊"
            width={116}
            height={32}
            className="h-7 w-auto md:h-8 lg:h-8"
            priority
          />
        </Link>

        <div className="hidden min-w-0 flex-1 md:flex md:justify-center lg:flex lg:justify-center">
          <nav
            className="flex w-full max-w-[1200px] items-center justify-center gap-2 lg:gap-3"
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
              className="hidden shrink-0 items-center gap-2 text-sm text-[var(--text-muted)]"
              aria-label="客服电话 400-666-5061"
            >
              <Image
                src={PHONE_ICON_SRC}
                alt=""
                width={24}
                height={24}
                className="size-5 lg:size-6"
                unoptimized
              />
              400-666-5061
            </span>
          </nav>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3 md:ml-0">
          <LoginModalButton
            variant="outline"
            className={cn(
              "hidden md:inline-flex md:h-10 md:min-h-10 md:rounded-lg md:px-4 md:text-sm md:leading-[22px] lg:h-12 lg:min-h-12 lg:rounded-[10px] lg:px-5 lg:text-base lg:leading-6",
              headerInverted &&
                "border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,white)] active:bg-[color-mix(in_srgb,var(--color-primary)_16%,white)]",
            )}
            onMouseEnter={(event) => activateHeader(event.clientX, event.clientY)}
          >
            登录诊所
          </LoginModalButton>
          <TrialModalButton
            className="hidden lg:inline-flex lg:h-12 lg:min-h-12 lg:rounded-[10px] lg:px-5 lg:text-base lg:leading-6"
            onMouseEnter={(event) => activateHeader(event.clientX, event.clientY)}
          >
            免费试用
          </TrialModalButton>
          <button
            type="button"
            className={cn(
              "relative inline-flex h-8 w-8 shrink-0 items-center justify-center md:hidden",
              menuOpen && "is-active",
            )}
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={menuOpen}
            onMouseEnter={(event) => activateHeader(event.clientX, event.clientY)}
            onClick={() => {
              if (menuOpen) {
                closeMobileMenu();
              } else {
                setMenuOpen(true);
              }
            }}
          >
            <span
              aria-hidden
              className={cn(
                "absolute left-1/2 top-1/2 block h-0.5 w-[18px] origin-center -translate-x-1/2 bg-[var(--text-base)] transition-all duration-300 ease-out",
                menuOpen
                  ? "-translate-y-1/2 rotate-45"
                  : "-translate-y-[calc(50%+5px)]",
              )}
            />
            <span
              aria-hidden
              className={cn(
                "absolute left-1/2 top-1/2 block h-0.5 w-[18px] origin-center -translate-x-1/2 -translate-y-1/2 bg-[var(--text-base)] transition-[opacity,transform] duration-300 ease-out",
                menuOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100",
              )}
            />
            <span
              aria-hidden
              className={cn(
                "absolute left-1/2 top-1/2 block h-0.5 w-[18px] origin-center -translate-x-1/2 bg-[var(--text-base)] transition-all duration-300 ease-out",
                menuOpen
                  ? "-translate-y-1/2 -rotate-45"
                  : "-translate-y-[calc(50%-5px)]",
              )}
            />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 top-16 z-40 bg-[#000000]/40 md:hidden"
            aria-label="关闭菜单"
            onClick={closeMobileMenu}
          />
          <nav
            className="fixed inset-x-0 top-16 z-50 flex flex-col gap-0 bg-white md:hidden"
            aria-label="主导航"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                linkClassName={MOBILE_NAV_LINK_CLASS}
                onNavigate={closeMobileMenu}
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
