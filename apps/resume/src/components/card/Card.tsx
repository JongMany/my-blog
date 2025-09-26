import React from "react";
import { cn } from "@srf/ui";

export function Card(p: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = p;
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]",
        "shadow-[var(--shadow-soft)] transition will-change-transform",
        "hover:-translate-y-[1px] hover:shadow-lg", // hover 통일
        className,
      )}
      {...rest}
    />
  );
}
