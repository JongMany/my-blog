import { TOC_ITEMS } from "../../constants";
import { cn } from "@srf/ui";
import { Card } from "../../../../components/card";
import {
  useIntersectionObserver,
  useHashManager,
  useScrollNavigation,
  updateHash as updateHashFunction,
} from "./hooks";
import { useState } from "react";
import { useViewport } from "../../../../contexts/ViewportContext";

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
  const [active, setActive] = useState(items[0]?.id);

  useHashManager({
    items,
    offset,
    onActiveChange: setActive,
  });

  const { navigateToSection, isLocked } = useScrollNavigation({
    offset,
    onActiveChange: setActive,
    onHashUpdate: (id) => updateHashFunction(id, updateHash),
  });

  useIntersectionObserver({
    items,
    offset,
    onActiveChange: (id) => {
      if (id !== active) {
        setActive(id);
        updateHashFunction(id, updateHash);
      }
    },
    isLocked,
  });

  return (
    <Card className="p-3">
      <NavigationHeader />
      <NavigationList
        items={items}
        activeId={active}
        onItemClick={navigateToSection}
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
