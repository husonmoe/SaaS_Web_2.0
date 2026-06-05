"use client";

import {
  USER_MANUAL_TOPICS,
  type UserManualCategoryId,
  type UserManualTopicId,
} from "@/components/sections/user-manual/userManualContent";
import { cn } from "@/lib/cn";
import { centerElementInScrollContainer } from "@/lib/scrollCenter";
import { useEffect, useRef } from "react";

type UserManualTopicBarProps = {
  activeCategoryId: UserManualCategoryId;
  activeTopicId: UserManualTopicId;
  onTopicChange: (id: UserManualTopicId) => void;
  className?: string;
};

/** 移动端横向目录条，与分类条同组吸顶；Figma node 407:182236 */
export function UserManualTopicBar({
  activeCategoryId,
  activeTopicId,
  onTopicChange,
  className,
}: UserManualTopicBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<UserManualTopicId, HTMLButtonElement | null>>>(
    {},
  );

  const topics = USER_MANUAL_TOPICS.filter(
    (topic) => topic.categoryId === activeCategoryId,
  );

  useEffect(() => {
    centerElementInScrollContainer(
      scrollRef.current,
      tabRefs.current[activeTopicId] ?? null,
    );
  }, [activeCategoryId, activeTopicId]);

  if (topics.length === 0) return null;

  return (
    <div
      ref={scrollRef}
      className={cn(
        "w-full overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden",
        className,
      )}
    >
      <nav
        className={cn(
          "flex w-max min-w-full flex-nowrap items-center justify-start gap-6",
          "px-[var(--page-margin-x)] pb-0 pt-0",
        )}
        aria-label="手册目录"
      >
        {topics.map((topic) => {
          const active = topic.id === activeTopicId;
          return (
            <button
              key={topic.id}
              ref={(node) => {
                tabRefs.current[topic.id] = node;
              }}
              type="button"
              onClick={() => onTopicChange(topic.id)}
              className={cn(
                "relative inline-flex h-12 shrink-0 items-center whitespace-nowrap text-sm leading-[22px] transition-colors",
                active
                  ? "user-manual-topic-tab-active font-medium text-[var(--text-base)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]",
              )}
            >
              {topic.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
