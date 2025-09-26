interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({
  message,
  className = "text-sm text-[var(--muted-fg)]",
}: EmptyStateProps) {
  return <div className={className}>{message}</div>;
}
