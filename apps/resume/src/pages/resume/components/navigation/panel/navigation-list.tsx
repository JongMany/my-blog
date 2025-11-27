import { NavigationItem } from "./navigation-item";

interface NavigationListProps {
  items: { id: string; label: string }[];
  activeId?: string;
  onItemClick: (id: string) => void;
}

/**
 * 네비게이션 패널 리스트 컴포넌트
 */
export function NavigationList({
  items,
  activeId,
  onItemClick,
}: NavigationListProps) {
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

