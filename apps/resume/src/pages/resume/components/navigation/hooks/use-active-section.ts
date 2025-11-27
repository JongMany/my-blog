import { useEffect, useRef, useState } from "react";

interface UseActiveSectionOptions {
  items: { id: string; label: string }[];
  offset?: number;
  intersectionObserver?: typeof IntersectionObserver;
  getElementById?: (id: string) => HTMLElement | null;
  getLocationHash?: () => string;
  addEventListener?: (
    type: string,
    listener: () => void,
  ) => void;
  removeEventListener?: (
    type: string,
    listener: () => void,
  ) => void;
}

/**
 * IntersectionObserver와 URL 해시를 사용하여 현재 활성화된 섹션을 추적하는 훅
 */
export function useActiveSection({
  items,
  offset = 96,
  intersectionObserver = IntersectionObserver,
  getElementById = (id) => document.getElementById(id),
  getLocationHash = () => window.location.hash.slice(1),
  addEventListener = (type, listener) =>
    window.addEventListener(type, listener),
  removeEventListener = (type, listener) =>
    window.removeEventListener(type, listener),
}: UseActiveSectionOptions) {
  const [active, setActive] = useState(items[0]?.id);
  const lockRef = useRef<number | null>(null);

  // 해시에서 활성 섹션 ID 추출
  const getActiveIdFromHash = (): string | null => {
    const hash = getLocationHash();
    if (hash && items.some((item) => item.id === hash)) {
      return hash;
    }
    return null;
  };

  // IntersectionObserver로 활성 섹션 감지
  useEffect(() => {
    const io = new intersectionObserver(
      (entries) => {
        if (lockRef.current) return;

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - offset) -
              Math.abs(b.boundingClientRect.top - offset),
          )[0];

        if (visible?.target?.id) {
          setActive(visible.target.id);
        }
      },
      { rootMargin: `-${offset}px 0px -70% 0px`, threshold: [0] },
    );

    items.forEach(({ id }) => {
      const el = getElementById(id);
      if (el) io.observe(el);
    });

    return () => io.disconnect();
  }, [items, offset, intersectionObserver, getElementById]);

  // URL 해시 변경 감지
  useEffect(() => {
    const handleHashChange = () => {
      const hashId = getActiveIdFromHash();
      if (hashId) {
        setActive(hashId);
      }
    };

    // 초기 해시 확인
    const initialHashId = getActiveIdFromHash();
    if (initialHashId) {
      setActive(initialHashId);
    }

    // 해시 변경 이벤트 리스너 등록
    addEventListener("hashchange", handleHashChange);

    return () => {
      removeEventListener("hashchange", handleHashChange);
    };
  }, [items, getLocationHash, addEventListener, removeEventListener]);

  return { active, setActive, lockRef };
}

