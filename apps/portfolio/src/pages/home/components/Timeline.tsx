// apps/portfolio/src/components/timeline/Timeline.tsx
import React from "react";
import { motion } from "framer-motion";
import { fadeUp } from "../../../components/motion/Motion";
import type { Experience } from "../../../service/portfolio";

export default function Timeline({ items }: { items: Experience[] }) {
  return (
    <ol className="relative ml-2 border-l border-[var(--border)] pl-4">
      {items.map((e, i) => (
        <motion.li key={e.company + i} {...fadeUp} className="mb-6">
          <div className="absolute -left-1.5 mt-1.5 size-3 rounded-full bg-[var(--primary)]" />
          <div className="font-medium">
            {e.role} · {e.company}
          </div>
          <div className="text-xs text-[var(--muted-fg)]">{e.period}</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--fg)]">
            {e.points.map((pt, idx) => (
              <li key={idx}>{pt}</li>
            ))}
          </ul>
        </motion.li>
      ))}
    </ol>
  );
}
