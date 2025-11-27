import { useEffect } from "react";

import { useResumeContext } from "../../../contexts/resume-context-provider";
import { useActiveSection, useSectionScroll } from "../hooks";
import { SectionTabs } from "./ui/section-tabs";
import { ViewModeToggle } from "./ui/view-mode-toggle";

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
  const { active, setActive, lockRef } = useActiveSection({
    items,
    offset,
  });
  const { scrollToSection, initializeScrollFromHash } = useSectionScroll({
    offset,
    updateHash,
  });

  // 초기 해시가 있을 경우 스크롤 처리
  // (active 상태는 useActiveSection에서 자동으로 처리됨)
  useEffect(() => {
    initializeScrollFromHash(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabClick = (id: string) => {
    // 클릭 시 즉시 상태 업데이트 (낙관적 업데이트)
    setActive(id);
    scrollToSection(id, "smooth", (lockId: number | null) => {
      if (lockRef.current) {
        window.clearTimeout(lockRef.current);
      }
      lockRef.current = lockId;
    });
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
