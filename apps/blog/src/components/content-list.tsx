import { cn } from "@srf/ui";
import { ReactNode } from "react";

interface ContentListProps<T> {
  items: T[];
  emptyMessage: string;
  renderItem: (item: T) => ReactNode;
  itemKey: (item: T) => string | number;
  className?: string;
}

export function ContentList<T>({
  items,
  emptyMessage,
  renderItem,
  itemKey,
  className,
}: ContentListProps<T>) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {items.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div key={itemKey(item)}>{renderItem(item)}</div>
          ))}
        </div>
      )}
    </div>
  );
}
