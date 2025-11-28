import React from "react";
import { motion } from "framer-motion";

import type { Education } from "@/service";
import { Card } from "@/components/card";
import { fadeInItem } from "@/constants/motion-variants";

interface EducationItemProps {
  item: Education;
}

export default function EducationItem({ item }: EducationItemProps) {
  return (
    <motion.div variants={fadeInItem}>
      <Card className="p-4">
        <EducationHeader item={item} />
        <EducationDetails item={item} />
      </Card>
    </motion.div>
  );
}

function EducationHeader({ item }: { item: Education }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <h4 className="font-medium">{item.school}</h4>
      {item.degree && (
        <span className="text-sm text-[var(--muted-fg)]">{item.degree}</span>
      )}
      <span className="ml-auto text-xs text-[var(--muted-fg)]">
        {item.period}
      </span>
    </div>
  );
}

function EducationDetails({ item }: { item: Education }) {
  const hasDetails = item.gpaMajor || item.gpaOverall || item.note;

  if (!hasDetails) return null;

  return (
    <div className="mt-2 ml-2 text-xs text-[var(--muted-fg)] flex flex-col">
      {item.gpaMajor && <span className="mr-3">{item.gpaMajor}</span>}
      {item.gpaOverall && <span>{item.gpaOverall}</span>}
      {item.note && <span className="ml-3">{item.note}</span>}
    </div>
  );
}
