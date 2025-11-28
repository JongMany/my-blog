import React from "react";

import type { Education } from "../../../../../service";
import { MotionStack } from "../../../../../components/stack";
import EducationItem from "./education-item";

interface EducationSectionProps {
  education: Education[];
}

export default function EducationSection({ education }: EducationSectionProps) {
  return (
    <MotionStack id="education" title="교육">
      {education.map((educationItem) => (
        <EducationItem
          key={`${educationItem.school}-${educationItem.period}`}
          item={educationItem}
        />
      ))}
    </MotionStack>
  );
}
