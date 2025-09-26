// apps/resume/src/components/EducationItem.tsx
import React from "react";
import type { Education } from "../../../service";
import { motion } from "framer-motion";
import { vItem } from "../../../constants";
import { Card } from "../../../components/card";
export default function EducationItem({ item }: { item: Education }) {
  return (
    <motion.div variants={vItem}>
      <Card className="p-4">
        <div className="flex flex-wrap items-baseline gap-2">
          <h4 className="font-medium">{item.school}</h4>
          {item.degree && (
            <span className="text-sm text-[var(--muted-fg)]">
              {item.degree}
            </span>
          )}
          <span className="ml-auto text-xs text-[var(--muted-fg)]">
            {item.period}
          </span>
        </div>
        <div className="mt-2 ml-2 text-xs text-[var(--muted-fg)] flex flex-col">
          {item.gpaMajor && <span className="mr-3">{item.gpaMajor}</span>}
          {item.gpaOverall && <span>{item.gpaOverall}</span>}
          {item.note && <span className="ml-3">{item.note}</span>}
        </div>
      </Card>
    </motion.div>
  );
}
