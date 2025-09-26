import { PrintButton } from "../../../../components/button/PrintButton";
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
  return (
    <main className="space-y-6 lg:col-span-7">
      <ExperienceSection experiences={experiences} />
      <SideProjectSection sideProjects={sideProjects} />
      <EducationSection education={education} />
      <ActivitySection activities={activities} />
      <PrintButton />
    </main>
  );
}
