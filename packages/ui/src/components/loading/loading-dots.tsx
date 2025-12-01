export default function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400 dark:bg-gray-500" />
      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400 dark:bg-gray-500 [animation-delay:0.2s]" />
      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400 dark:bg-gray-500 [animation-delay:0.4s]" />
    </span>
  );
}
