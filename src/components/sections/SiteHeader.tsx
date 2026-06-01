"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoginModalButton } from "@/components/modals/LoginModalButton";
import { TrialModalButton } from "@/components/modals/TrialModalButton";
import { useLoginModal } from "@/contexts/LoginModalContext";
import { useTrialModal } from "@/contexts/TrialModalContext";
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

function openExternalUrl(url: string) {
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.location.assign(url);
  }
}

function NavLink({
  item,
  onNavigate,
  onPointerEnter,
}: {
  item: NavItem;
  onNavigate?: () => void;
  onPointerEnter?: (event: React.MouseEvent) => void;
}) {
  if (item.external) {
    return (
      <a
        href={item.href}
        rel="noopener noreferrer"
        className={NAV_LINK_CLASS}
        onMouseEnter={onPointerEnter}
        onClick={(event) => {
          event.preventDefault();
          onNavigate?.();
          openExternalUrl(item.href);
        }}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      className={NAV_LINK_CLASS}
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
  const modalOpen = loginOpen || trialOpen;

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
          "pointer-events-none absolute inset-x-0 top-0 h-[72px] border-b border-[var(--border-light)] bg-white/95 backdrop-blur-sm",
          useHoverTransition && "transition-opacity duration-300 ease-out",
        )}
        style={{ opacity: fillOpacity }}
        aria-hidden
      />

      <div className="relative z-10 flex h-[72px] w-full items-center gap-4 px-[var(--page-margin-x)] lg:px-6">
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

        <div className="ml-auto flex shrink-0 items-center gap-3 md:ml-0">
          <LoginModalButton
            variant="outline"
            className={cn(
              "hidden sm:inline-flex",
              headerInverted &&
                "border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,white)] active:bg-[color-mix(in_srgb,var(--color-primary)_16%,white)]",
            )}
            onMouseEnter={(event) => activateHeader(event.clientX, event.clientY)}
          >
            登录诊所
          </LoginModalButton>
          <TrialModalButton
            className="hidden sm:inline-flex"
            onMouseEnter={(event) => activateHeader(event.clientX, event.clientY)}
          >
            免费试用
          </TrialModalButton>
          <button
            type="button"
            className="inline-flex size-10 flex-col items-center justify-center gap-1 rounded-lg border border-[var(--border-light)] bg-white/80 md:hidden"
            aria-label="打开菜单"
            aria-expanded={menuOpen}
            onMouseEnter={(event) => activateHeader(event.clientX, event.clientY)}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="block h-0.5 w-5 bg-[var(--text-base)]" />
            <span className="block h-0.5 w-5 bg-[var(--text-base)]" />
            <span className="block h-0.5 w-5 bg-[var(--text-base)]" />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          className="relative z-10 flex flex-col gap-1 border-t border-[var(--border-light)] bg-white px-[var(--page-margin-x)] py-4 md:hidden"
          aria-label="主导航"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              onNavigate={() => setMenuOpen(false)}
              onPointerEnter={(event) =>
                activateHeader(event.clientX, event.clientY)
              }
            />
          ))}
          <span
            className="flex items-center gap-2 px-5 py-3 text-lg text-[var(--text-muted)]"
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
      ) : null}
    </header>
  );
}
