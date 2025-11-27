import { useEffect } from "react";
import { cn } from "@srf/ui";

import { TOC_ITEMS } from "../../../constants";
import { Card } from "../../../../../components/card";
import { useViewport } from "../../../../../contexts/ViewportContext";
import { useActiveSection, useSectionScroll } from "../hooks";

type NavigationItem = { id: string; label: string };

interface NavigationPanelProps {
  className?: string;
}

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
  items: NavigationItem[];
  offset?: number;
  updateHash?: boolean;
}

function NavigationContent({
  items,
  offset = 96,
  updateHash = true,
}: NavigationContentProps) {
  const { active, setActive, lockRef } = useActiveSection({
    items,
    offset,
  });
  const { scrollToSection, initializeScrollFromHash } = useSectionScroll({
    offset,
    updateHash,
  });

  // 초기 해시가 있을 경우 스크롤 처리
  useEffect(() => {
    initializeScrollFromHash(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleItemClick = (id: string) => {
    // 클릭 시 즉시 상태 업데이트 (낙관적 업데이트)
    setActive(id);
    scrollToSection(id, "smooth", (lockId: number | null) => {
      if (lockRef.current) {
        window.clearTimeout(lockRef.current);
      }
      lockRef.current = lockId;
    });
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
function NavigationHeader() {
  return (
    <div className="mb-2 text-sm font-medium text-[var(--muted-fg)]">목차</div>
  );
}

interface NavigationListProps {
  items: NavigationItem[];
  activeId?: string;
  onItemClick: (id: string) => void;
}

function NavigationList({ items, activeId, onItemClick }: NavigationListProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item) => (
        <NavigationItem
          key={item.id}
          id={item.id}
          label={item.label}
          isActive={activeId === item.id}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
}

interface NavigationItemProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

function NavigationItem({ id, label, isActive, onClick }: NavigationItemProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={cn(
        "w-full rounded-full px-3 py-1.5 text-left text-sm transition",
        isActive
          ? "bg-[var(--primary)] text-[var(--primary-ink)]"
          : "bg-[var(--surface)] hover:bg-[var(--hover-bg)]",
      )}
      aria-current={isActive ? "true" : undefined}
    >
      {label}
    </button>
  );
}
