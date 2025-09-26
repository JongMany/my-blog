import { useEffect, useRef } from "react";

interface UseIntersectionObserverProps {
  items: Array<{ id: string }>;
  offset: number;
  onActiveChange: (id: string) => void;
  isLocked: boolean;
}

export function useIntersectionObserver({
  items,
  offset,
  onActiveChange,
  isLocked,
}: UseIntersectionObserverProps) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (isLocked) return; // 스크롤 애니메이션 중 IO 무시

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - offset) -
              Math.abs(b.boundingClientRect.top - offset),
          )[0];

        if (visible?.target?.id) {
          onActiveChange(visible.target.id);
        }
      },
      { rootMargin: `-${offset}px 0px -70% 0px`, threshold: [0] },
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => io.disconnect();
  }, [items, offset, onActiveChange, isLocked]);
}
