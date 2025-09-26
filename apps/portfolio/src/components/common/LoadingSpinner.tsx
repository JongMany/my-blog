interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  message = "로딩 중...",
  className = "flex items-center justify-center py-8",
}: LoadingSpinnerProps) {
  return (
    <div className={className}>
      <div className="text-sm text-[var(--muted-fg)]">{message}</div>
    </div>
  );
}
