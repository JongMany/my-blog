// apps/resume/src/components/SkillPill.tsx
import { cn } from "@srf/ui";
import React from "react";

export default function SkillPill({
  children,
  pressed,
  onToggle,
}: React.PropsWithChildren<{
  pressed?: boolean;
  onToggle?: (v: boolean) => void;
}>) {
  const [on, setOn] = React.useState(!!pressed);
  React.useEffect(() => setOn(!!pressed), [pressed]);

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => {
        const v = !on;
        setOn(v);
        onToggle?.(v);
      }}
      className={cn(
        "rounded-full px-3 py-1.5 text-xs transition will-change-transform",
        "border border-[var(--border)] shadow-[var(--shadow-soft)]",
        "hover:-translate-y-0.5 active:translate-y-0",
        on
          ? "bg-[var(--primary)] text-[var(--primary-ink)]"
          : "bg-[var(--card-bg)] text-[var(--fg)] hover:bg-[var(--hover-bg)]"
      )}
    >
      {children}
    </button>
  );
}
