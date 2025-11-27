import React from "react";

import type { SideProject } from "../../../../../service";
import { SectionWithAnimation } from "../../../../../components/layout";
import SideProjectItem from "./SideProjectItem";

interface SideProjectSectionProps {
  sideProjects?: SideProject[];
}

export default function SideProjectSection({
  sideProjects,
}: SideProjectSectionProps) {
  if (!sideProjects || sideProjects.length === 0) {
    return null;
  }

  return (
    <SectionWithAnimation id="side-projects" title="사이드 프로젝트">
      {sideProjects.map((project) => (
        <SideProjectItem
          key={`${project.title}-${project.period}`}
          item={project}
        />
      ))}
    </SectionWithAnimation>
  );
}
