import React from "react";
import { motion } from "framer-motion";
import { fadeUp, easeOutCb } from "../../../components/motion/Motion";
import type { Experience } from "../../../service/portfolio";

export default function Timeline({ items }: { items: Experience[] }) {
  return (
    <ol className="relative ml-2 border-l border-[var(--border)] pl-4">
      {items.map((e, i) => (
        <TimelineItem key={e.company + i} experience={e} />
      ))}
    </ol>
  );
}

function TimelineItem({ experience }: { experience: Experience }) {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ margin: "-10% 0px", once: true }}
        transition={{ duration: 0.5, ease: easeOutCb, delay: 0 }}
        className="absolute -left-1.5 mt-1.5 size-3 rounded-full bg-[var(--primary)]"
      />
      <motion.li
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-10% 0px", once: true }}
        transition={{ duration: 0.5, ease: easeOutCb }}
        className="mb-6"
      >
        <div className="font-medium">
          {experience.role} · {experience.company}
        </div>
        <div className="text-xs text-[var(--muted-fg)]">
          {experience.period}
        </div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--fg)]">
          {experience.points.map((pt, idx) => (
            <li key={idx}>{pt}</li>
          ))}
        </ul>
      </motion.li>
    </React.Fragment>
  );
}
