// apps/shell/src/components/withBoundary.tsx
import * as React from "react";
import { useLocation } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary";
import { TossRemoteLoader } from "@srf/ui";

type Options = {
  suspenseFallback?: React.ReactNode;
  remoteOrigin?: string;
  onError?: (err: Error) => void;
  appName?: string;
};

export function withBoundary(
  Comp: React.LazyExoticComponent<React.ComponentType>,
  opts: Options = {},
) {
  const { suspenseFallback, remoteOrigin, onError, appName } = opts;

  const defaultSuspenseFallback = <TossRemoteLoader appName={appName} />;

  return function Wrapped() {
    const [key, setKey] = React.useState(0);
    const [attempts, setAttempts] = React.useState(0);
    const loc = useLocation();

    const retry = React.useCallback(() => {
      setAttempts((n) => n + 1);
      setKey((k) => k + 1);
    }, []);

    return (
      <React.Suspense fallback={suspenseFallback || defaultSuspenseFallback}>
        <ErrorBoundary
          onError={(e) => onError?.(e)}
          onReset={() => {
            // ErrorBoundary 내부 상태 리셋
          }}
          resetKeys={[loc.key, key]}
          fallback={(err) => (
            <TossRemoteLoader
              appName={appName}
              error={err instanceof Error ? err : new Error(String(err))}
              onRetry={retry}
              attempts={attempts}
              maxAttempts={6}
            />
          )}
        >
          <Comp key={key} />
        </ErrorBoundary>
      </React.Suspense>
    );
  };
}
