"use client";

import { type ElementType, type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type FadeInOnScrollProps = {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  as?: ElementType;
};

export function FadeInOnScroll({
  children,
  className,
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  once = true,
  as: Component = "div",
}: FadeInOnScrollProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.unobserve(entry.target);
          return;
        }

        if (!once) setIsInView(false);
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return (
    <Component
      ref={elementRef}
      className={cn(
        "transition-all duration-700 ease-out",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className,
      )}
    >
      {children}
    </Component>
  );
}
