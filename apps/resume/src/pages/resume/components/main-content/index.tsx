import { cn } from "@srf/ui";

import type { Experience, SideProject, Education, Activity } from "@/service";
import { PrintButton } from "@/components";
import { useViewport } from "@/contexts/viewport-context";
import ActivitySection from "@/pages/resume/components/content-item/activity";
import EducationSection from "@/pages/resume/components/content-item/education";
import ExperienceSection from "@/pages/resume/components/content-item/experience";
import SideProjectSection from "@/pages/resume/components/content-item/side-project";
import SkillsCard from "@/pages/resume/components/content-item/skills";

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
