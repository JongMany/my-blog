import { useMemo } from "react";

// apps/shell/src/mfe/RemoteFallback.tsx
type Props = {
  onRetry?: () => void;
  error?: unknown | null; // (권장) null 허용
  attempts?: number;
  remoteOrigin?: string;
};

export default function RemoteFallback({
  onRetry,
  error,
  attempts,
  remoteOrigin,
}: Props) {
  const hasError = !!error;

  const errorText = useMemo(() => {
    if (!hasError) return "";
    if (error instanceof Error) return error.stack || error.message;
    try {
      return JSON.stringify(error, null, 2);
    } catch {
      return String(error);
    }
  }, [hasError, error]);

  const copyError = async () => {
    if (!errorText) return;
    try {
      await navigator.clipboard.writeText(errorText);
    } catch {}
  };

  return (
    <div className="t-card p-6 text-sm">
      <div className="font-medium">원격 앱 로드에 실패했어요.</div>
      {/* ...중략... */}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={onRetry}
          className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3.5 py-2 text-sm hover:bg-[var(--hover-bg)]"
        >
          다시 시도
        </button>

        {/* ...중략... */}

        {hasError && (
          <button
            onClick={copyError}
            className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3.5 py-2 text-sm hover:bg-[var(--hover-bg)]"
          >
            오류 내용 복사
          </button>
        )}
      </div>

      {import.meta.env.PROD && hasError && (
        <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-[var(--surface)] p-3 text-[11px]">
          {errorText}
        </pre>
      )}
    </div>
  );
}
