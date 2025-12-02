import { useEffect } from "react";

import { useResumeContext } from "@/pages/resume/contexts/resume-context-provider";
import { useSectionNavigation } from "@/pages/resume/components/navigation/hooks";
import { SectionTabs } from "./section-tabs";
import { ViewModeToggle } from "./view-mode-toggle";

interface TopTabsProps {
  items: { id: string; label: string }[];
  offset?: number;
  updateHash?: boolean;
}

/**
 * 상단 고정 탭 네비게이션 컴포넌트
 *
 * @description
 * - 섹션 간 스크롤 네비게이션 제공
 * - IntersectionObserver와 URL 해시로 현재 활성 섹션 자동 감지
 * - 이력서 보기 모드 토글 포함
 */
export default function TopTabs({
  items,
  offset = 96,
  updateHash = true,
}: TopTabsProps) {
  const { viewMode, toggleViewMode } = useResumeContext();
  const { active, setActive, scrollToSection, initializeScrollFromHash } =
    useSectionNavigation({
      items,
      offset,
      updateHash,
    });

  // 초기 해시가 있을 경우 스크롤 처리
  useEffect(() => {
    initializeScrollFromHash();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabClick = (id: string) => {
    // 클릭 시 즉시 상태 업데이트 (낙관적 업데이트)
    setActive(id);
    scrollToSection(id, "smooth");
  };

  const isDetailed = viewMode === "detailed";

  return (
    <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--bg),transparent)] shadow-[0_1px_0_0_var(--border)]">
      <div className="mx-auto max-w-screen-xl px-4 py-2">
        {/* 데스크톱 레이아웃 */}
        <div className="hidden md:flex items-center justify-between gap-4">
          <SectionTabs
            items={items}
            activeId={active}
            onTabClick={handleTabClick}
            variant="desktop"
          />
          <ViewModeToggle
            isDetailed={isDetailed}
            onToggle={toggleViewMode}
            variant="desktop"
          />
        </div>

        {/* 모바일 레이아웃 */}
        <div className="md:hidden space-y-2">
          <SectionTabs
            items={items}
            activeId={active}
            onTabClick={handleTabClick}
            variant="mobile"
          />
          <ViewModeToggle
            isDetailed={isDetailed}
            onToggle={toggleViewMode}
            variant="mobile"
          />
        </div>
      </div>
    </div>
  );
}
