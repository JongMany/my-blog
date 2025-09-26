import { cn } from "@srf/ui";

export function pillClass(
  variant: "soft" | "primary" | "outline",
  size: "sm" | "md" | "xs",
) {
  return cn(
    // Base styles
    "inline-flex items-center gap-1.5 rounded-full",
    "focus-visible:outline-none focus-visible:[box-shadow:var(--ring)]",
    "transition will-change-transform hover:-translate-y-0.5",

    // Variant styles
    {
      "bg-[var(--primary)] text-[var(--primary-ink)] hover:brightness-105":
        variant === "primary",
      "bg-transparent border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--hover-bg)]":
        variant === "outline",
      "border border-[var(--border)] text-[var(--fg)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] [background:linear-gradient(180deg,rgba(255,255,255,.65),rgba(255,255,255,.0))_padding-box,linear-gradient(var(--card-bg),var(--card-bg))_border-box]":
        variant === "soft",
    },

    // Size styles
    {
      "px-3 py-1.5 text-xs": size === "sm",
      "px-2 py-0.5 text-[10px]": size === "xs",
      "px-3.5 py-2 text-sm": size === "md",
    },
  );
}
