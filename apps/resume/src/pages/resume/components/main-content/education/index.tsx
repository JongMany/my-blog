import React from "react";
import { SectionWithAnimation } from "../../../../../components/layout";
import EducationItem from "./EducationItem";
import type { Education } from "../../../../../service";

interface EducationSectionProps {
  education: Education[];
}

export default function EducationSection({ education }: EducationSectionProps) {
  return (
    <SectionWithAnimation id="education" title="교육">
      {education.map((educationItem) => (
        <EducationItem
          key={`${educationItem.school}-${educationItem.period}`}
          item={educationItem}
        />
      ))}
    </SectionWithAnimation>
  );
}
