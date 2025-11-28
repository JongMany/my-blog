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
  return (
    <button
      className={cn(
        // Base styles
        "inline-flex items-center gap-1.5 rounded-xl transition hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:[box-shadow:var(--ring)]",

        // Variant styles
        {
          "bg-[var(--primary)] text-[var(--primary-ink)] hover:brightness-105":
            variant === "primary",
          "text-[var(--fg)] hover:bg-[var(--hover-bg)]": variant === "ghost",
          "border border-[var(--border)] bg-[var(--card-bg)] text-[var(--fg)] hover:bg-[var(--hover-bg)]":
            variant === "default",
        },

        // Size styles
        {
          "px-3 py-1.5 text-xs": size === "sm",
          "px-3.5 py-2 text-sm": size === "md",
          "px-2 py-0.5 text-[10px]": size === "xs",
        },

        className,
      )}
      {...rest}
    />
  );
}
