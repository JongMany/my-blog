import React from "react";
import { SectionWithAnimation } from "../../../../../components/layout";
import ExperienceItem from "./ExperienceItem";
import type { Experience } from "../../../../../service";

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
          key={`${experience.company}-${experience.period}`}
          item={experience}
        />
      ))}
    </SectionWithAnimation>
  );
}
