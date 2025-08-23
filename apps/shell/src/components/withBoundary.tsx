// apps/shell/src/mfe/withBoundary.tsx
import * as React from "react";
import { useLocation } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary";
import RemoteFallback from "./RemoteFallback";

type Options = {
  suspenseFallback?: React.ReactNode;
  remoteOrigin?: string; // ex) "http://localhost:3003"
  onError?: (err: Error) => void;
};

export function withBoundary(
  Comp: React.LazyExoticComponent<React.ComponentType>,
  opts: Options = {}
) {
  const {
    suspenseFallback = <div className="p-6">연결 중…</div>,
    remoteOrigin,
    onError,
  } = opts;

  return function Wrapped() {
    const [key, setKey] = React.useState(0);
    const [attempts, setAttempts] = React.useState(0);
    const loc = useLocation();

    const retry = React.useCallback(() => {
      // 리모트 import 캐시 이슈를 피하려면 키를 바꿔 재마운트
      setAttempts((n) => n + 1);
      setKey((k) => k + 1);
    }, []);

    return (
      <React.Suspense fallback={suspenseFallback}>
        <ErrorBoundary
          onError={(e) => onError?.(e)}
          onReset={() => {
            // ErrorBoundary 내부 상태 리셋 시점 - 필요 시 로깅
          }}
          resetKeys={[loc.key, key]} // 라우트 변화 or 수동 재시도 시 리셋
          fallback={(err) => (
            <RemoteFallback
              error={err}
              onRetry={retry}
              attempts={attempts}
              remoteOrigin={remoteOrigin}
            />
          )}
        >
          <Comp key={key} />
        </ErrorBoundary>
      </React.Suspense>
    );
  };
}
