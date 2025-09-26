import React from "react";
import { cn } from "@srf/ui";

export function Meta(p: React.HTMLAttributes<HTMLSpanElement>) {
  const { className, ...rest } = p;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full",
        "border border-[var(--border)] bg-[var(--surface)]",
        "px-2 py-[2px] text-[11px]",
        "[font-variant-numeric:tabular-nums] text-[var(--muted-fg)]",
        className,
      )}
      {...rest}
    />
  );
}
