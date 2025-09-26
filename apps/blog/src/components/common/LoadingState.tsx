// Props 타입 정의
interface LoadingStateProps {
  count?: number;
  className?: string;
}

export function LoadingState({ count = 6, className = "" }: LoadingStateProps) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-48 animate-pulse rounded-xl bg-white/[0.06]"
        />
      ))}
    </div>
  );
}
