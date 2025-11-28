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

interface MainContentProps {
  experiences: Experience[];
  sideProjects?: SideProject[];
  education: Education[];
  activities: Activity[];
}

export default function MainContent({
  experiences,
  sideProjects,
  education,
  activities,
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
      <SideProjectSection sideProjects={sideProjects} />
      <EducationSection education={education} />
      <ActivitySection activities={activities} />
      <PrintButton />
    </main>
  );
}
