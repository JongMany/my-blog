import React from "react";

import type { SideProject } from "@/service";
import { MotionStack } from "@/components/stack";
import SideProjectItem from "./side-project-item";

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
    <MotionStack id="side-projects" title="사이드 프로젝트">
      {sideProjects.map((project) => (
        <SideProjectItem
          key={`${project.title}-${project.period}`}
          item={project}
        />
      ))}
    </MotionStack>
  );
}
