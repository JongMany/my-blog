// Props 타입 정의
interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-sm text-[var(--muted-fg)]">{message}</p>
    </div>
  );
}
