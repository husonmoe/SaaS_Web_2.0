"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ServiceContactPopoverCard } from "@/components/create-clinic/ServiceContactPopoverCard";
import { ICON_HELP_SRC } from "@/components/create-clinic/createClinicConstants";
import { cn } from "@/lib/cn";

export function CreateClinicServiceContactButton() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);

  const open = hovered || pinned;

  const close = useCallback(() => {
    setPinned(false);
    setHovered(false);
  }, []);

  useEffect(() => {
    if (!pinned) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, pinned]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        if (!pinned) setHovered(false);
      }}
    >
      <button
        type="button"
        className={cn(
          "inline-flex h-8 items-center gap-1 rounded-md px-3 py-1.5 text-sm leading-[22px] text-[var(--text-base)] transition-colors hover:bg-[#EFF2F6] active:bg-[#EFF2F6]",
          pinned && "bg-[#EFF2F6]",
        )}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setPinned(true)}
      >
        <Image
          src={ICON_HELP_SRC}
          alt=""
          width={16}
          height={16}
          className="size-4 shrink-0"
          aria-hidden
          unoptimized
        />
        联系客服
      </button>

      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+8px)] z-50"
          role="dialog"
          aria-label="联系客服"
        >
          <ServiceContactPopoverCard />
        </div>
      ) : null}
    </div>
  );
}
