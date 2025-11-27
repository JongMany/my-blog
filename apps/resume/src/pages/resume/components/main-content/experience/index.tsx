import React from "react";

import type { Experience } from "../../../../../service";
import { SectionWithAnimation } from "../../../../../components/layout";
import ExperienceItem from "./ExperienceItem";

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({
  experiences,
}: ExperienceSectionProps) {
  return (
    <SectionWithAnimation id="experience" title="경력">
      {experiences.map((experience) => (
        <ExperienceItem
          key={`${experience.companyName}-${experience.workPeriod}`}
          item={experience}
        />
      ))}
    </SectionWithAnimation>
  );
}
