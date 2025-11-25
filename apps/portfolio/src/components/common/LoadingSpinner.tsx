import { cn } from "@srf/ui";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  message = "로딩 중...",
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <div className="text-sm text-[var(--muted-fg)]">{message}</div>
    </div>
  );
}
