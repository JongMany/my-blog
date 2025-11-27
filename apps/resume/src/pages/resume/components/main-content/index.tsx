import { PrintButton } from "../../../../components";
import type {
  Experience,
  SideProject,
  Education,
  Activity,
} from "../../../../service";
import ExperienceSection from "./experience";
import SideProjectSection from "./side-project";
import EducationSection from "./education";
import ActivitySection from "./activity";
import { useViewport } from "../../../../contexts/ViewportContext";
import { cn } from "@srf/ui";

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
