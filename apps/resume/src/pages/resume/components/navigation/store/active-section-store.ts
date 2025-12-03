/**
 * Active Section 상태를 중앙에서 관리하는 외부 스토어
 *
 * @description
 * - useSyncExternalStore를 사용하여 여러 컴포넌트 간 상태 동기화
 * - NavigationPanel과 TopTabs가 동일한 active section 상태를 공유
 */

type Listener = () => void;

class ActiveSectionStore {
  private active: string | undefined;
  private listeners = new Set<Listener>();
  private lockTimeoutId: number | null = null;

  getSnapshot = (): string | undefined => {
    return this.active;
  };

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  setActive = (id: string | undefined): void => {
    if (this.active !== id) {
      this.active = id;
      this.notify();
    }
  };

  getLockTimeoutId = (): number | null => {
    return this.lockTimeoutId;
  };

  setLockTimeoutId = (timeoutId: number | null): void => {
    this.lockTimeoutId = timeoutId;
  };

  private notify = (): void => {
    this.listeners.forEach((listener) => listener());
  };
}

export const activeSectionStore = new ActiveSectionStore();

