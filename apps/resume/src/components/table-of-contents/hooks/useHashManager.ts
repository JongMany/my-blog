import { useEffect } from "react";

interface UseHashManagerProps {
  items: Array<{ id: string }>;
  offset: number;
  onActiveChange: (id: string) => void;
}

export function useHashManager({
  items,
  offset,
  onActiveChange,
}: UseHashManagerProps) {
  // 초기 #hash 처리 (있으면 해당 섹션으로 점프)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && items.some((i) => i.id === hash)) {
      onActiveChange(hash);
      const el = document.getElementById(hash);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
      }
    }
  }, [items, offset, onActiveChange]);
}

export function updateHash(id: string, shouldUpdate: boolean = true) {
  if (!shouldUpdate) return;
  // replaceState: 히스토리 누적 방지
  history.replaceState(null, "", `#${id}`);
}
