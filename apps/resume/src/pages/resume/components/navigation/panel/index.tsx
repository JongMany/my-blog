import { useEffect } from "react";
import { cn } from "@srf/ui";

import { TOC_ITEMS } from "@/pages/resume/constants";
import { Card } from "@/components/card";
import { useViewport } from "@/contexts/viewport-context";
import { useSectionNavigation } from "@/pages/resume/components/navigation/hooks";
import { NavigationHeader } from "./navigation-header";
import { NavigationList } from "./navigation-list";

interface NavigationPanelProps {
  className?: string;
}

/**
 * 네비게이션 패널 컴포넌트
 *
 * @description
 * - 사이드바에 표시되는 섹션 네비게이션
 * - IntersectionObserver와 URL 해시로 현재 활성 섹션 자동 감지
 * - 대형 데스크톱에서만 표시됨
 */
export default function NavigationPanel({ className }: NavigationPanelProps) {
  const { isLargeDesktop } = useViewport();

  if (!isLargeDesktop) return null;

  return (
    <aside className={cn("lg:col-span-2", className)}>
      <div className="lg:sticky lg:top-24">
        <NavigationContent items={TOC_ITEMS} />
      </div>
    </aside>
  );
}

interface NavigationContentProps {
  items: { id: string; label: string }[];
  offset?: number;
  updateHash?: boolean;
}

function NavigationContent({
  items,
  offset = 96,
  updateHash = true,
}: NavigationContentProps) {
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

  const handleItemClick = (id: string) => {
    // 클릭 시 즉시 상태 업데이트 (낙관적 업데이트)
    setActive(id);
    scrollToSection(id, "smooth");
  };

  return (
    <Card className="p-3">
      <NavigationHeader />
      <NavigationList
        items={items}
        activeId={active}
        onItemClick={handleItemClick}
      />
    </Card>
  );
}
