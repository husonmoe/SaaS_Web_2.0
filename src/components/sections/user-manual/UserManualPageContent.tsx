"use client";

import { UserManualCategoryBar } from "@/components/sections/user-manual/UserManualCategoryBar";
import { UserManualHeroSection } from "@/components/sections/user-manual/UserManualHeroSection";
import {
  UserManualMainSection,
  getDefaultTopicForCategory,
} from "@/components/sections/user-manual/UserManualMainSection";
import {
  USER_MANUAL_DEFAULT_CATEGORY,
  USER_MANUAL_DEFAULT_TOPIC,
  type UserManualCategoryId,
  type UserManualTopicId,
} from "@/components/sections/user-manual/userManualContent";
import { useRef, useState } from "react";

export function UserManualPageContent() {
  const stickyScopeRef = useRef<HTMLDivElement>(null);
  const [activeCategoryId, setActiveCategoryId] =
    useState<UserManualCategoryId>(USER_MANUAL_DEFAULT_CATEGORY);
  const [activeTopicId, setActiveTopicId] = useState<UserManualTopicId>(
    USER_MANUAL_DEFAULT_TOPIC,
  );

  const handleCategoryChange = (categoryId: UserManualCategoryId) => {
    setActiveCategoryId(categoryId);
    setActiveTopicId(getDefaultTopicForCategory(categoryId));
  };

  return (
    <div
      ref={stickyScopeRef}
      className="user-manual-sticky-scope relative overflow-visible"
    >
      <UserManualHeroSection />

      <div className="user-manual-sticky-body">
        <UserManualCategoryBar
          activeCategoryId={activeCategoryId}
          onCategoryChange={handleCategoryChange}
          scopeRef={stickyScopeRef}
        />

        <UserManualMainSection
          activeCategoryId={activeCategoryId}
          activeTopicId={activeTopicId}
          onTopicChange={setActiveTopicId}
        />
      </div>
    </div>
  );
}
