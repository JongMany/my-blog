import * as React from "react";

type Props = {
  children: React.ReactNode;
  /** 에러 시 렌더할 UI */
  fallback: React.ReactNode | ((error: unknown) => React.ReactNode);
  /** 에러에서 복구(상태 초기화)할 때 호출 */
  onReset?: () => void;
  /** 에러 보고용 훅 */
  onError?: (error: Error, info: React.ErrorInfo) => void;
  /**
   * resetKeys 값이 바뀌면 자동으로 에러 상태를 리셋.
   * 예: [location.key] 또는 [remoteName, route]
   */
  resetKeys?: unknown[];
};

type State = { error: Error | null };

function shallowArrayEqual(a?: unknown[], b?: unknown[]) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
  }

  componentDidUpdate(prevProps: Props) {
    if (!shallowArrayEqual(prevProps.resetKeys, this.props.resetKeys)) {
      this.reset();
    }
  }

  reset = () => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (error) {
      if (typeof this.props.fallback === "function") {
        return (this.props.fallback as (e: unknown) => React.ReactNode)(error);
      }
      return this.props.fallback;
    }
    return this.props.children;
  }
}
