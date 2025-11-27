import { cn } from "@srf/ui";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div className={cn("text-center py-8", className)}>
      <div className="text-lg text-[var(--muted-fg)]">{message}</div>
    </div>
  );
}
