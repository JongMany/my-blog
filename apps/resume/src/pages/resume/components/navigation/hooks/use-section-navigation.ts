import { useEffect, useRef } from "react";
import { useSyncExternalStore } from "react";
import {
  getActiveIdFromHash,
  findClosestVisibleSection,
  calculateScrollTop,
  isValidHash,
  type SectionItem,
} from "@/pages/resume/components/navigation/utils/utils";
import { activeSectionStore } from "@/pages/resume/components/navigation/store/active-section-store";

interface UseSectionNavigationOptions {
  items: SectionItem[];
  offset?: number;
  updateHash?: boolean;
}

const HASH_LOCK_DURATION_MS = 100;
const SCROLL_LOCK_DURATION_MS = 700;
const INTERSECTION_ROOT_MARGIN_BOTTOM = "-70%";

// IntersectionObserver 싱글톤
let intersectionObserver: IntersectionObserver | null = null;
let observerRefCount = 0;
let currentItems: SectionItem[] = [];
let currentOffset = 96;

/**
 * IntersectionObserver 초기화
 */
const initializeObserver = (
  items: SectionItem[],
  offset: number,
): void => {
  // 이미 같은 설정으로 초기화되어 있으면 재사용
  if (
    intersectionObserver &&
    currentItems.length === items.length &&
    currentItems.every((item, i) => item.id === items[i]?.id) &&
    currentOffset === offset
  ) {
    return;
  }

  // 기존 Observer 정리
  if (intersectionObserver) {
    intersectionObserver.disconnect();
  }

  currentItems = items;
  currentOffset = offset;

  // 새 Observer 생성
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      // Lock이 설정되어 있으면 무시
      if (activeSectionStore.getLockTimeoutId()) {
        return;
      }

      // 가장 가까운 섹션 찾기
      const sectionId = findClosestVisibleSection(entries, offset);
      if (sectionId) {
        activeSectionStore.setActive(sectionId);
      }
    },
    {
      rootMargin: `-${offset}px 0px ${INTERSECTION_ROOT_MARGIN_BOTTOM} 0px`,
      threshold: [0],
    },
  );

  // 모든 섹션 요소 관찰 시작
  const observeAll = () => {
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el && intersectionObserver) {
        intersectionObserver.observe(el);
      }
    });
  };

  // DOM 준비 대기 후 observe
  requestAnimationFrame(() => {
    observeAll();
    // 요소를 찾지 못했을 경우 재시도
    setTimeout(observeAll, 100);
  });
};

/**
 * IntersectionObserver 정리
 */
const cleanupObserver = (): void => {
  observerRefCount--;
  if (observerRefCount <= 0 && intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
    currentItems = [];
    observerRefCount = 0;
  }
};

/**
 * 섹션 네비게이션 통합 훅
 *
 * @description
 * - IntersectionObserver로 스크롤에 따라 활성 섹션 자동 감지
 * - URL 해시 변경 감지 및 동기화
 * - 섹션으로 스크롤 및 해시 업데이트
 * - useSyncExternalStore로 여러 컴포넌트 간 상태 동기화
 */
export function useSectionNavigation({
  items,
  offset = 96,
  updateHash = true,
}: UseSectionNavigationOptions) {
  // 중앙 스토어에서 active 상태 구독
  const active = useSyncExternalStore(
    activeSectionStore.subscribe,
    activeSectionStore.getSnapshot,
    () => activeSectionStore.getSnapshot(),
  );

  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // 초기값 설정
  useEffect(() => {
    const currentActive = activeSectionStore.getSnapshot();
    if (!currentActive) {
      const hash = window.location.hash.slice(1);
      const hashId = getActiveIdFromHash(hash, items);
      if (hashId) {
        activeSectionStore.setActive(hashId);
      } else if (items[0]?.id) {
        activeSectionStore.setActive(items[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // IntersectionObserver 초기화
  useEffect(() => {
    observerRefCount++;
    initializeObserver(items, offset);

    return () => {
      cleanupObserver();
    };
  }, [items, offset]);

  // 해시 변경 감지
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const hashId = getActiveIdFromHash(hash, items);

      if (hashId && hashId !== activeRef.current) {
        // 기존 lock 해제
        const lockId = activeSectionStore.getLockTimeoutId();
        if (lockId) {
          clearTimeout(lockId);
        }

        // 상태 업데이트
        activeSectionStore.setActive(hashId);

        // 잠시 lock 설정 (IntersectionObserver가 덮어쓰지 않도록)
        const newLockId = window.setTimeout(() => {
          activeSectionStore.setLockTimeoutId(null);
        }, HASH_LOCK_DURATION_MS);
        activeSectionStore.setLockTimeoutId(newLockId);
      }
    };

    // 초기 해시 확인
    const hash = window.location.hash.slice(1);
    const hashId = getActiveIdFromHash(hash, items);
    if (hashId && hashId !== activeSectionStore.getSnapshot()) {
      activeSectionStore.setActive(hashId);
    }

    // 이벤트 리스너 등록
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, [items]);

  // 섹션으로 스크롤
  const scrollToSection = (
    id: string,
    behavior: ScrollBehavior = "smooth",
  ) => {
    const el = document.getElementById(id);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollY = window.scrollY;
    const top = calculateScrollTop(rect.top, scrollY, offset);

    window.scrollTo({ top, behavior });

    // 해시 업데이트
    if (updateHash) {
      history.replaceState(null, "", `#${id}`);
      // hashchange 이벤트 발생 (다른 컴포넌트가 감지할 수 있도록)
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("hashchange"));
      });
    }

    // Lock 설정 (스크롤 애니메이션 중 IntersectionObserver 무시)
    const lockId = activeSectionStore.getLockTimeoutId();
    if (lockId) {
      clearTimeout(lockId);
    }

    const newLockId = window.setTimeout(() => {
      activeSectionStore.setLockTimeoutId(null);
    }, SCROLL_LOCK_DURATION_MS);
    activeSectionStore.setLockTimeoutId(newLockId);
  };

  // 초기 해시로 스크롤
  const initializeScrollFromHash = () => {
    const hash = window.location.hash.slice(1);
    if (isValidHash(hash, items)) {
      scrollToSection(hash, "instant");
    }
  };

  // 상태 업데이트 함수
  const setActive = (id: string | undefined) => {
    activeSectionStore.setActive(id);
  };

  return {
    active,
    setActive,
    scrollToSection,
    initializeScrollFromHash,
  };
}

