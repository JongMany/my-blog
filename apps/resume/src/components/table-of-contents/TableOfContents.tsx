import React from "react";
import { Card } from "../card";
import { TableOfContentsItem } from "./TableOfContentsItem";
import {
  useIntersectionObserver,
  useHashManager,
  useScrollNavigation,
  updateHash as updateHashFunction,
} from "./hooks";

type TocItem = { id: string; label: string };

export default function TableOfContents({
  items,
  offset = 96, // sticky 보정
  updateHash = true, // ← 해시 업데이트 on/off
}: {
  items: TocItem[];
  offset?: number;
  updateHash?: boolean;
}) {
  const [active, setActive] = React.useState(items[0]?.id);

  // 해시 관리
  useHashManager({
    items,
    offset,
    onActiveChange: setActive,
  });

  // 스크롤 네비게이션
  const { navigateToSection, isLocked } = useScrollNavigation({
    offset,
    onActiveChange: setActive,
    onHashUpdate: (id) => updateHashFunction(id, updateHash),
  });

  // IntersectionObserver
  useIntersectionObserver({
    items,
    offset,
    onActiveChange: (id) => {
      if (id !== active) {
        setActive(id);
        updateHashFunction(id, updateHash); // 스크롤로 활성화될 때도 해시 반영
      }
    },
    isLocked,
  });

  return (
    <Card className="p-3">
      <div className="mb-2 text-sm font-medium text-[var(--muted-fg)]">
        목차
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <TableOfContentsItem
            key={item.id}
            id={item.id}
            label={item.label}
            isActive={active === item.id}
            onClick={navigateToSection}
          />
        ))}
      </div>
    </Card>
  );
}
