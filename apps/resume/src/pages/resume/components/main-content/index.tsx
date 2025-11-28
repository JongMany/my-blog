import { cn } from "@srf/ui";

import type {
  Experience,
  SideProject,
  Education,
  Activity,
} from "../../../../service";
import { PrintButton } from "../../../../components";
import { useViewport } from "../../../../contexts/viewport-context";
import ActivitySection from "./activity";
import EducationSection from "./education";
import ExperienceSection from "./experience";
import SideProjectSection from "./side-project";
import SkillsCard from "../skills-card";

interface MainContentProps {
  experiences: Experience[];
  sideProjects?: SideProject[];
  education: Education[];
  activities: Activity[];
  skills?: string[];
}

export default function MainContent({
  experiences,
  sideProjects,
  education,
  activities,
  skills,
}: MainContentProps) {
  const { isLargeDesktop } = useViewport();

  return (
    <main
      className={cn(
        "space-y-6",
        isLargeDesktop ? "lg:col-span-7" : "col-span-1",
      )}
    >
      <ExperienceSection experiences={experiences} />
      {/* 모바일에서만 skills를 경력 아래에 표시 */}
      {!isLargeDesktop && <SkillsCard skills={skills} />}
      <SideProjectSection sideProjects={sideProjects} />
      <EducationSection education={education} />
      <ActivitySection activities={activities} />
      <PrintButton />
    </main>
  );
}
