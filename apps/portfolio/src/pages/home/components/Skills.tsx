import { motion } from "framer-motion";
import { fadeUp } from "../../../components/motion/Motion";
import { skills } from "../constants/skills";

export function Skills() {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {skills.map((s) => (
        <motion.div key={s.name} {...fadeUp} className="t-card p-3">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span>{s.name}</span>
            <span className="text-[var(--muted-fg)]">{s.lvl}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--hover-bg)]">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${s.lvl}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-[var(--primary)]"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
