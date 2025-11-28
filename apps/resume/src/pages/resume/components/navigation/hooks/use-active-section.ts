import { useEffect, useRef, useState } from "react";
import {
  getActiveIdFromHash,
  findClosestVisibleSection,
  type SectionItem,
} from "@/pages/resume/components/navigation/utils/utils";

interface UseActiveSectionOptions {
  items: SectionItem[];
  offset?: number;
  intersectionObserver?: typeof IntersectionObserver;
  getElementById?: (id: string) => HTMLElement | null;
  getLocationHash?: () => string;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
  setTimeout?: (callback: () => void, delay: number) => number;
  clearTimeout?: (id: number) => void;
}

const DEFAULT_HASH_LOCK_DURATION_MS = 100;
const INTERSECTION_OBSERVER_ROOT_MARGIN_BOTTOM = "-70%";

/**
 * IntersectionObserver와 URL 해시를 사용하여 현재 활성화된 섹션을 추적하는 훅
 *
 * @description
 * - IntersectionObserver로 스크롤에 따라 활성 섹션 자동 감지
 * - URL 해시 변경을 감지하여 다른 컴포넌트와 상태 동기화
 * - 스크롤 애니메이션 중에는 IntersectionObserver 업데이트를 잠금
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
  setTimeout: setTimeoutFn = (callback, delay) =>
    window.setTimeout(callback, delay),
  clearTimeout: clearTimeoutFn = (id) => window.clearTimeout(id),
}: UseActiveSectionOptions) {
  const [active, setActive] = useState(items[0]?.id);
  const lockRef = useRef<number | null>(null);

  // 해시에서 활성 섹션 ID 추출 (순수 함수 사용)
  const getActiveIdFromHashValue = (): string | null => {
    const hash = getLocationHash();
    return getActiveIdFromHash(hash, items);
  };

  // IntersectionObserver로 활성 섹션 감지
  useEffect(() => {
    const io = new intersectionObserver(
      (entries) => {
        // 스크롤 애니메이션 중에는 업데이트 무시
        if (lockRef.current) return;

        const sectionId = findClosestVisibleSection(entries, offset);
        if (sectionId) {
          setActive(sectionId);
        }
      },
      {
        rootMargin: `-${offset}px 0px ${INTERSECTION_OBSERVER_ROOT_MARGIN_BOTTOM} 0px`,
        threshold: [0],
      },
    );

    items.forEach(({ id }) => {
      const el = getElementById(id);
      if (el) io.observe(el);
    });

    return () => io.disconnect();
  }, [items, offset, intersectionObserver, getElementById]);

  // active 상태를 ref로도 관리하여 이벤트 핸들러에서 최신 값 참조
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // URL 해시 변경 감지
  useEffect(() => {
    const handleHashChange = () => {
      const hashId = getActiveIdFromHashValue();

      // 해시가 있고 현재 active와 다를 때만 업데이트 (중복 업데이트 방지)
      if (hashId && hashId !== activeRef.current) {
        // 기존 lock이 있으면 취소
        if (lockRef.current) {
          clearTimeoutFn(lockRef.current);
        }

        setActive(hashId);

        // 해시 변경으로 인한 상태 업데이트 후 잠시 lock 설정
        // IntersectionObserver가 상태를 덮어쓰지 않도록 함
        lockRef.current = setTimeoutFn(() => {
          lockRef.current = null;
        }, DEFAULT_HASH_LOCK_DURATION_MS);
      }
    };

    // 초기 해시 확인
    const initialHashId = getActiveIdFromHashValue();
    if (initialHashId) {
      setActive(initialHashId);
    }

    // 해시 변경 이벤트 리스너 등록
    // hashchange: 브라우저 뒤로가기/앞으로가기, 직접 URL 변경
    // popstate: history API 사용 시 (뒤로가기/앞으로가기)
    addEventListener("hashchange", handleHashChange);
    addEventListener("popstate", handleHashChange);

    return () => {
      removeEventListener("hashchange", handleHashChange);
      removeEventListener("popstate", handleHashChange);
    };
  }, [
    items,
    getLocationHash,
    addEventListener,
    removeEventListener,
    setActive,
    setTimeoutFn,
    clearTimeoutFn,
  ]);

  return { active, setActive, lockRef };
}
