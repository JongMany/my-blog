import { TabButton } from "./tab-button";

interface SectionTabsProps {
  items: { id: string; label: string }[];
  activeId: string;
  onTabClick: (id: string) => void;
  variant?: "desktop" | "mobile";
}

/**
 * 섹션 탭 네비게이션 컴포넌트
 */
export function SectionTabs({
  items,
  activeId,
  onTabClick,
  variant = "desktop",
}: SectionTabsProps) {
  return (
    <nav aria-label="섹션 탭" className="flex gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
      {items.map((item) => (
        <TabButton
          key={item.id}
          id={item.id}
          label={item.label}
          isActive={activeId === item.id}
          onClick={() => onTabClick(item.id)}
          variant={variant}
        />
      ))}
    </nav>
  );
}

