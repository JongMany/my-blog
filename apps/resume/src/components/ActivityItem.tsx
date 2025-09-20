import React from "react";
import type { Activity } from "../service/resume";
import { motion } from "framer-motion";
import { vItem } from "./Motion";
import { Card } from "./ui";
export default function ActivityItem({ item }: { item: Activity }) {
  return (
    <motion.div variants={vItem}>
      <Card className="p-4">
        <div className="flex items-baseline gap-2">
          <h4 className="font-medium">{item.title}</h4>
          {item.period && (
            <span className="ml-auto text-xs text-[var(--muted-fg)]">
              {item.period}
            </span>
          )}
        </div>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-xs">
          {item.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </Card>
    </motion.div>
  );
}
