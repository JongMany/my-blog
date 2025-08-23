// apps/resume/src/components/SkillBadges.tsx
import React from "react";
import { motion } from "framer-motion";
import { fadeUp } from "./Motion";
import SkillPill from "./SkillPill";

export default function SkillBadges({
  items = [] as string[],
  interactive = true, // ← 기본 상호작용 켜둠(원하면 false)
  onChange,
}: {
  items?: string[];
  interactive?: boolean;
  onChange?: (selected: string[]) => void;
}) {
  const [sel, setSel] = React.useState<string[]>([]);
  const toggle = (s: string, v: boolean) => {
    if (!interactive) return;
    const next = v ? [...sel, s] : sel.filter((x) => x !== s);
    setSel(next);
    onChange?.(next);
  };

  if (!items.length) return null;
  return (
    <motion.div {...fadeUp} className="t-card p-4">
      <div className="mb-2 font-medium">Skills</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) =>
          interactive ? (
            <SkillPill
              key={s}
              pressed={sel.includes(s)}
              onToggle={(v) => toggle(s, v)}
            >
              #{s}
            </SkillPill>
          ) : (
            <span
              key={s}
              className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs border border-[var(--border)]"
            >
              #{s}
            </span>
          )
        )}
      </div>
    </motion.div>
  );
}
