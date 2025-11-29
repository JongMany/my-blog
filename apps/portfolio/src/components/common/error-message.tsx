import { cn } from "@srf/ui";

interface ErrorMessageProps {
  message: string;
  className?: string;
  illustrationSrc?: string;
  illustrationAlt?: string;
}

export function ErrorMessage({
  message,
  className,
  illustrationSrc,
  illustrationAlt = "에러 일러스트레이션",
}: ErrorMessageProps) {
  return (
    <div className={cn("text-center py-12 flex flex-col items-center gap-6", className)}>
      {illustrationSrc ? (
        <img
          src={illustrationSrc}
          alt={illustrationAlt}
          className="max-w-[240px] w-full h-auto"
          loading="lazy"
        />
      ) : null}
      <div className="text-lg text-[var(--muted-fg)]">{message}</div>
    </div>
  );
}
