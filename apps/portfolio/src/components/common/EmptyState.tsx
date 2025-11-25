import { cn } from "@srf/ui";

interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div className={cn("text-sm text-[var(--muted-fg)]", className)}>
      {message}
    </div>
  );
}
