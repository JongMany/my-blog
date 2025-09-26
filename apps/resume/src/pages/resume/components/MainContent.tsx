import React from "react";
import ExperienceItem from "./ExperienceItem";
import SideProjectItem from "./SideProjectItem";
import EducationItem from "./EducationItem";
import ActivityItem from "./ActivityItem";
import { SectionWithAnimation } from "../../../components/layout";
import type {
  Experience,
  SideProject,
  Education,
  Activity,
} from "../../../service";

interface MainContentProps {
  experiences: Experience[];
  sideProjects?: SideProject[];
  education: Education[];
  activities: Activity[];
}

export function MainContent({
  experiences,
  sideProjects,
  education,
  activities,
}: MainContentProps) {
  return (
    <main className="space-y-6 lg:col-span-7">
      <SectionWithAnimation id="experience" title="경력">
        {experiences.map((experience) => (
          <ExperienceItem
            key={`${experience.company}-${experience.period}`}
            item={experience}
          />
        ))}
      </SectionWithAnimation>

      {sideProjects && sideProjects.length > 0 && (
        <SectionWithAnimation id="side-projects" title="사이드 프로젝트">
          {sideProjects.map((project) => (
            <SideProjectItem
              key={`${project.title}-${project.period}`}
              item={project}
            />
          ))}
        </SectionWithAnimation>
      )}

      <SectionWithAnimation id="education" title="교육">
        {education.map((educationItem) => (
          <EducationItem
            key={`${educationItem.school}-${educationItem.period}`}
            item={educationItem}
          />
        ))}
      </SectionWithAnimation>

      <SectionWithAnimation id="activities" title="대내외 활동">
        {activities.map((activity) => (
          <ActivityItem
            key={`${activity.title}-${activity.period}`}
            item={activity}
          />
        ))}
      </SectionWithAnimation>

      <div className="flex justify-end pt-2 print:hidden">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center rounded-xl bg-[var(--primary)] px-4 py-2 text-sm text-[var(--primary-ink)]"
        >
          PDF로 저장
        </button>
      </div>
    </main>
  );
}
