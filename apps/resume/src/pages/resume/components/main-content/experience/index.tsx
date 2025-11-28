import React from "react";

import type { Experience } from "../../../../../service";
import { MotionStack } from "../../../../../components/stack";
import ExperienceItem from "./ExperienceItem";

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({
  experiences,
}: ExperienceSectionProps) {
  return (
    <MotionStack id="experience" title="경력">
      {experiences.map((experience) => (
        <ExperienceItem
          key={`${experience.companyName}-${experience.workPeriod}`}
          item={experience}
        />
      ))}
    </MotionStack>
  );
}
