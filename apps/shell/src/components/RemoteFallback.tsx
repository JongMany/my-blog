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
    <div className="shell:t-card shell:p-6 shell:text-sm">
      <div className="shell:font-medium">원격 앱 로드에 실패했어요.</div>
      {/* ...중략... */}

      <div className="shell:mt-3 shell:flex shell:flex-wrap shell:gap-2">
        <button
          onClick={onRetry}
          className="shell:rounded-xl shell:border shell:border-[var(--border)] shell:bg-[var(--card-bg)] shell:px-3.5 shell:py-2 shell:text-sm hover:shell:bg-[var(--hover-bg)]"
        >
          다시 시도
        </button>

        {/* ...중략... */}

        {hasError && (
          <button
            onClick={copyError}
            className="shell:rounded-xl shell:border shell:border-[var(--border)] shell:bg-[var(--card-bg)] shell:px-3.5 shell:py-2 shell:text-sm hover:shell:bg-[var(--hover-bg)]"
          >
            오류 내용 복사
          </button>
        )}
      </div>

      {import.meta.env.PROD && hasError && (
        <pre className="shell:mt-3 shell:max-h-48 shell:overflow-auto shell:whitespace-pre-wrap shell:rounded-lg shell:bg-[var(--surface)] shell:p-3 shell:text-[11px]">
          {errorText}
        </pre>
      )}
    </div>
  );
}
