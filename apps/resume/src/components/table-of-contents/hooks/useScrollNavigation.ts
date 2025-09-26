import { useRef } from "react";

interface UseScrollNavigationProps {
  offset: number;
  onActiveChange: (id: string) => void;
  onHashUpdate: (id: string) => void;
}

export function useScrollNavigation({
  offset,
  onActiveChange,
  onHashUpdate,
}: UseScrollNavigationProps) {
  const lockRef = useRef<number | null>(null);

  const navigateToSection = (id: string) => {
    onActiveChange(id); // 클릭 즉시 활성
    onHashUpdate(id); // 클릭 시 해시 반영

    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }

    // 스크롤 애니메이션 중 IntersectionObserver 무시
    if (lockRef.current) window.clearTimeout(lockRef.current);
    lockRef.current = window.setTimeout(() => (lockRef.current = null), 700);
  };

  const isLocked = lockRef.current !== null;

  return {
    navigateToSection,
    isLocked,
  };
}
