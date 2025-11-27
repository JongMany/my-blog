import {
  calculateScrollTop,
  isValidHash,
  type SectionItem,
} from "../utils/utils";

interface UseSectionScrollOptions {
  offset?: number;
  updateHash?: boolean;
  getElementById?: (id: string) => HTMLElement | null;
  getBoundingClientRect?: (element: HTMLElement) => DOMRect;
  getScrollY?: () => number;
  scrollTo?: (options: { top: number; behavior: ScrollBehavior }) => void;
  replaceState?: (state: null, title: string, url: string) => void;
  setTimeout?: (callback: () => void, delay: number) => number;
  clearTimeout?: (id: number) => void;
  getLocationHash?: () => string;
  requestAnimationFrame?: (callback: () => void) => number;
  dispatchEvent?: (event: Event) => boolean;
  createEvent?: (type: string) => Event;
}

const DEFAULT_LOCK_DURATION_MS = 700;

/**
 * 섹션 스크롤 및 해시 관리를 위한 훅
 *
 * @description
 * - 섹션으로 스크롤하고 URL 해시를 업데이트
 * - 해시 변경 시 다른 컴포넌트가 감지할 수 있도록 이벤트 발생
 */
export function useSectionScroll({
  offset = 96,
  updateHash = true,
  getElementById = (id) => document.getElementById(id),
  getBoundingClientRect = (el) => el.getBoundingClientRect(),
  getScrollY = () => window.scrollY,
  scrollTo = (options) => window.scrollTo(options),
  replaceState = (state, title, url) => history.replaceState(state, title, url),
  setTimeout: setTimeoutFn = (callback, delay) =>
    window.setTimeout(callback, delay),
  clearTimeout: clearTimeoutFn = (id) => window.clearTimeout(id),
  getLocationHash = () => window.location.hash.slice(1),
  requestAnimationFrame: raf = (callback) =>
    window.requestAnimationFrame(callback),
  dispatchEvent = (event) => window.dispatchEvent(event),
  createEvent = (type) => new Event(type),
}: UseSectionScrollOptions = {}) {
  const scrollToSection = (
    id: string,
    behavior: ScrollBehavior = "smooth",
    onLock?: (lockId: number | null) => void,
  ) => {
    const el = getElementById(id);
    if (!el) return;

    const rect = getBoundingClientRect(el);
    const scrollY = getScrollY();
    const top = calculateScrollTop(rect.top, scrollY, offset);

    scrollTo({ top, behavior });

    if (updateHash) {
      replaceState(null, "", `#${id}`);
      // history.replaceState는 hashchange 이벤트를 발생시키지 않으므로
      // 커스텀 이벤트를 발생시켜 다른 컴포넌트가 해시 변경을 감지할 수 있도록 함
      // requestAnimationFrame을 사용하여 다음 프레임에 이벤트를 발생시켜
      // 상태 업데이트가 완료된 후에 다른 컴포넌트가 해시를 감지하도록 함
      raf(() => {
        const event = createEvent("hashchange");
        dispatchEvent(event);
      });
    }

    if (onLock) {
      const lockId = setTimeoutFn(() => {
        onLock(null);
      }, DEFAULT_LOCK_DURATION_MS);
      onLock(lockId);
    }
  };

  /**
   * 초기 해시가 있을 경우 해당 섹션으로 스크롤
   * (active 상태는 useActiveSection에서 처리)
   */
  const initializeScrollFromHash = (items: SectionItem[]) => {
    const hash = getLocationHash();
    if (isValidHash(hash, items)) {
      scrollToSection(hash, "instant");
    }
  };

  return { scrollToSection, initializeScrollFromHash };
}
