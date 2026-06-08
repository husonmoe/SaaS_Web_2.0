"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { UserManualArticleBody } from "@/components/sections/user-manual/UserManualArticleBody";
import { UserManualFeedback } from "@/components/sections/user-manual/UserManualFeedback";
import {
  USER_MANUAL_ARTICLES,
  USER_MANUAL_DEFAULT_TOPIC,
  USER_MANUAL_TOPICS,
  type UserManualCategoryId,
  type UserManualTopicId,
} from "@/components/sections/user-manual/userManualContent";
import { cn } from "@/lib/cn";

type UserManualMainSectionProps = {
  activeCategoryId: UserManualCategoryId;
  activeTopicId: UserManualTopicId;
  onTopicChange: (id: UserManualTopicId) => void;
};

export function UserManualMainSection({
  activeCategoryId,
  activeTopicId,
  onTopicChange,
}: UserManualMainSectionProps) {
  const topics = USER_MANUAL_TOPICS.filter(
    (topic) => topic.categoryId === activeCategoryId,
  );
  const article = USER_MANUAL_ARTICLES[activeTopicId];
  const showTopicLayout = topics.length > 0;

  return (
    <section className="pb-0">
      <PageContainer className="flex flex-col items-center gap-[40px] py-[60px]">
        {showTopicLayout ? (
          <div className="flex w-full max-w-[1200px] flex-col gap-12 lg:mt-16 lg:flex-row lg:gap-6">
            <aside className="user-manual-sidebar hidden w-full shrink-0 lg:block lg:w-[282px] lg:sticky lg:z-30 lg:self-start">
              <p className="pb-5 text-sm leading-[22px] text-[var(--text-tertiary)]">
                目录
              </p>
              <nav className="flex flex-col" aria-label="手册目录">
                {topics.map((topic, index) => {
                  const active = topic.id === activeTopicId;
                  const isLast = index === topics.length - 1;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => onTopicChange(topic.id)}
                      className={cn(
                        "relative border-l border-[var(--border-light)] pl-6 text-left text-sm leading-[22px] transition-colors",
                        isLast ? "py-0" : "pb-5 pt-0",
                        active
                          ? "user-manual-topic-active font-medium text-[var(--text-base)]"
                          : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]",
                      )}
                    >
                      {topic.label}
                    </button>
                  );
                })}
              </nav>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col gap-16">
              {article ? (
                <UserManualArticleBody article={article} />
              ) : (
                <UserManualPlaceholder title={topics.find((t) => t.id === activeTopicId)?.label ?? ""} />
              )}
            </div>
          </div>
        ) : (
          <UserManualPlaceholder
            title={
              USER_MANUAL_TOPICS.find((t) => t.categoryId === activeCategoryId)
                ?.label ?? "该分类"
            }
            description="该分类手册内容正在筹备中，敬请期待。"
          />
        )}

        {article ? <UserManualFeedback key={activeTopicId} /> : null}
      </PageContainer>
    </section>
  );
}

function UserManualPlaceholder({
  title,
  description = "该章节内容正在筹备中，敬请期待。",
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-[320px] flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[var(--border-light)] bg-[var(--bg-shell)] px-8 py-16 text-center">
      <p className="text-2xl font-semibold text-[var(--text-base)]">{title}</p>
      <p className="max-w-md text-base leading-6 text-[var(--text-secondary)]">
        {description}
      </p>
    </div>
  );
}

/** 切换分类时重置到该分类首个目录项 */
export function getDefaultTopicForCategory(
  categoryId: UserManualCategoryId,
): UserManualTopicId {
  const first = USER_MANUAL_TOPICS.find((t) => t.categoryId === categoryId);
  return first?.id ?? USER_MANUAL_DEFAULT_TOPIC;
}
