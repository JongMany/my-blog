import {
  useState,
  useCallback,
  Suspense,
  type ReactNode,
  type LazyExoticComponent,
  type ComponentType,
} from "react";
import { useLocation } from "react-router-dom";
import { ErrorBoundary } from "./error-boundary";
import { RemoteLoader } from "@srf/ui";

type Options = {
  suspenseFallback?: ReactNode;
  remoteOrigin?: string;
  onError?: (err: Error) => void;
  appName?: string;
};

export function withBoundary(
  Comp: LazyExoticComponent<ComponentType>,
  opts: Options = {},
) {
  const { suspenseFallback, remoteOrigin, onError, appName } = opts;

  const defaultSuspenseFallback = <RemoteLoader appName={appName} />;

  return function Wrapped() {
    const [key, setKey] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const loc = useLocation();

    const retry = useCallback(() => {
      setAttempts((n) => n + 1);
      setKey((k) => k + 1);
    }, []);

    return (
      <Suspense fallback={suspenseFallback || defaultSuspenseFallback}>
        <ErrorBoundary
          onError={(e) => onError?.(e)}
          onReset={() => {
            // ErrorBoundary 내부 상태 리셋
          }}
          resetKeys={[loc.key, key]}
          fallback={(err) => (
            <RemoteLoader
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
      </Suspense>
    );
  };
}
