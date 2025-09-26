import React from "react";
import { cn } from "@srf/ui";

export function Button({
  variant = "default",
  size = "md",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "ghost";
  size?: "sm" | "md" | "xs";
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-xl transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:[box-shadow:var(--ring)]";
  const vs =
    variant === "primary"
      ? "bg-[var(--primary)] text-[var(--primary-ink)] hover:brightness-105"
      : variant === "ghost"
        ? "text-[var(--fg)] hover:bg-[var(--hover-bg)]"
        : "border border-[var(--border)] bg-[var(--card-bg)] text-[var(--fg)] hover:bg-[var(--hover-bg)]";
  const sz = size === "sm" ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-sm";
  return <button className={cn(base, vs, sz, className)} {...rest} />;
}
