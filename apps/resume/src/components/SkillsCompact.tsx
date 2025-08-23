import React from "react";
import { PillButton } from "./ui";

export default function SkillsCompact({ items }: { items: string[] }) {
  const [open, setOpen] = React.useState(false);
  const visible = open ? items : items.slice(0, 8);
  const more = items.length - visible.length;

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((s) => (
        <PillButton key={s} variant="soft" size="sm">
          #{s}
        </PillButton>
      ))}
      {more > 0 && (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--fg)] hover:bg-[var(--hover-bg)]"
        >
          +{more}
        </button>
      )}
    </div>
  );
}
