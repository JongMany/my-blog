interface UseSectionScrollOptions {
  offset?: number;
  updateHash?: boolean;
  getElementById?: (id: string) => HTMLElement | null;
  scrollTo?: (options: { top: number; behavior: ScrollBehavior }) => void;
  replaceState?: (state: null, title: string, url: string) => void;
  setTimeout?: (callback: () => void, delay: number) => number;
  clearTimeout?: (id: number) => void;
  getLocationHash?: () => string;
}

/**
 * 섹션 스크롤 및 해시 관리를 위한 훅
 */
export function useSectionScroll({
  offset = 96,
  updateHash = true,
  getElementById = (id) => document.getElementById(id),
  scrollTo = (options) => window.scrollTo(options),
  replaceState = (state, title, url) => history.replaceState(state, title, url),
  setTimeout: setTimeoutFn = (callback, delay) =>
    window.setTimeout(callback, delay),
  clearTimeout: clearTimeoutFn = (id) => window.clearTimeout(id),
  getLocationHash = () => window.location.hash.slice(1),
}: UseSectionScrollOptions = {}) {
  const scrollToSection = (
    id: string,
    behavior: ScrollBehavior = "smooth",
    onLock?: (lockId: number | null) => void,
  ) => {
    const el = getElementById(id);
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    scrollTo({ top, behavior });

    if (updateHash) {
      replaceState(null, "", `#${id}`);
    }

    if (onLock) {
      const lockId = setTimeoutFn(() => {
        onLock(null);
      }, 700);
      onLock(lockId);
    }
  };

  /**
   * 초기 해시가 있을 경우 해당 섹션으로 스크롤
   * (active 상태는 useActiveSection에서 처리)
   */
  const initializeScrollFromHash = (
    items: { id: string; label: string }[],
  ) => {
    const hash = getLocationHash();
    if (hash && items.some((i) => i.id === hash)) {
      scrollToSection(hash, "instant");
    }
  };

  return { scrollToSection, initializeScrollFromHash };
}

