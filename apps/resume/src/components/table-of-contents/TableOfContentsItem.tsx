import React from "react";
import { cn } from "@srf/ui";

interface TableOfContentsItemProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

export function TableOfContentsItem({
  id,
  label,
  isActive,
  onClick,
}: TableOfContentsItemProps) {
  return (
    <button
      key={id}
      onClick={() => onClick(id)}
      className={cn(
        "w-full rounded-full px-3 py-1.5 text-left text-sm transition",
        isActive
          ? "bg-[var(--primary)] text-[var(--primary-ink)]"
          : "bg-[var(--surface)] hover:bg-[var(--hover-bg)]",
      )}
      aria-current={isActive ? "true" : undefined}
    >
      {label}
    </button>
  );
}
