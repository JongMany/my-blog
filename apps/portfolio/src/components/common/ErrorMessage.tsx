interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({
  message,
  className = "text-center py-8",
}: ErrorMessageProps) {
  return (
    <div className={className}>
      <div className="text-lg text-[var(--muted-fg)]">{message}</div>
    </div>
  );
}
