"use client";

import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

const DEFAULT_MAX_TILT = 12;
const HOVER_SCALE = 1.02;
const SHADOW_BASE_Y = 8;
const SHADOW_BLUR = 24;
const SHADOW_OPACITY = 0.08;

type TiltState = {
  rotateX: number;
  rotateY: number;
  scale: number;
  shadowX: number;
  shadowY: number;
  isHovered: boolean;
};

const IDLE_STATE: TiltState = {
  rotateX: 0,
  rotateY: 0,
  scale: 1,
  shadowX: 0,
  shadowY: 0,
  isHovered: false,
};

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  style?: CSSProperties;
  idleShadow?: string;
};

function shadowColor(opacity: number): string {
  return `rgba(var(--shadow-card-rgb), ${opacity})`;
}

function activeShadowStyle(shadowX: number, shadowY: number): string {
  const baseY = shadowY + SHADOW_BASE_Y;

  return `${shadowX}px ${baseY}px ${SHADOW_BLUR}px 0 ${shadowColor(SHADOW_OPACITY)}`;
}

export function TiltCard({
  children,
  className,
  maxTilt = DEFAULT_MAX_TILT,
  style,
  idleShadow,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltState>(IDLE_STATE);

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const percentX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const percentY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      const rotateY = percentX * maxTilt;
      const rotateX = percentY * maxTilt;
      const shadowX = -rotateY * 1.6;
      const shadowY = -rotateX * 1.6;

      setTilt({
        rotateX,
        rotateY,
        scale: HOVER_SCALE,
        shadowX,
        shadowY,
        isHovered: true,
      });
    },
    [maxTilt],
  );

  const handleMouseLeave = useCallback(() => {
    setTilt(IDLE_STATE);
  }, []);

  const cardStyle: CSSProperties = {
    ...style,
    transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
    boxShadow: tilt.isHovered
      ? activeShadowStyle(tilt.shadowX, tilt.shadowY)
      : (idleShadow ?? "none"),
    transition: tilt.isHovered
      ? "transform 0.12s ease-out, box-shadow 0.18s ease-out"
      : "transform 0.55s cubic-bezier(0.33, 1, 0.68, 1), box-shadow 0.55s cubic-bezier(0.33, 1, 0.68, 1)",
  };

  return (
    <div
      className={cn(
        "relative [perspective:1000px]",
        tilt.isHovered && "z-10",
      )}
      onMouseEnter={handleMouseMove}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        style={cardStyle}
        className={cn(
          "rounded-2xl bg-white will-change-transform [transform-style:preserve-3d]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
