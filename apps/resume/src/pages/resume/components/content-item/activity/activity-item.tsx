import React from "react";
import { motion } from "framer-motion";

import type { Activity } from "../../../../../service";
import { Card } from "../../../../../components/card";
import { fadeInItem } from "../../../../../constants/motion-variants";

interface ActivityItemProps {
  item: Activity;
}

export default function ActivityItem({ item }: ActivityItemProps) {
  return (
    <motion.div variants={fadeInItem}>
      <Card className="p-4">
        <ActivityHeader item={item} />
        <ActivityBullets bullets={item.bullets} />
      </Card>
    </motion.div>
  );
}

function ActivityHeader({ item }: { item: Activity }) {
  return (
    <div className="flex items-baseline gap-2">
      <h4 className="font-medium">{item.title}</h4>
      {item.period && (
        <span className="ml-auto text-xs text-[var(--muted-fg)]">
          {item.period}
        </span>
      )}
    </div>
  );
}

function ActivityBullets({ bullets }: { bullets: string[] }) {
  return (
    <ul className="mt-2 list-disc pl-5 space-y-1 text-xs">
      {bullets.map((bullet, index) => (
        <li key={index}>{bullet}</li>
      ))}
    </ul>
  );
}
