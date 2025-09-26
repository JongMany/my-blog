import React from "react";
import ExperienceItem from "./ExperienceItem";
import SideProjectItem from "./SideProjectItem";
import EducationItem from "./EducationItem";
import ActivityItem from "./ActivityItem";
import type {
  Experience,
  SideProject,
  Education,
  Activity,
} from "../../../service";
import { SectionWithAnimation } from "../../../components/layout/SectionWithAnimation";

interface ResumeMainProps {
  filteredExperiences: Experience[];
  filteredSideProjects?: SideProject[];
  filteredEducation: Education[];
  filteredActivities: Activity[];
}

export function ResumeMain({
  filteredExperiences,
  filteredSideProjects,
  filteredEducation,
  filteredActivities,
}: ResumeMainProps) {
  return (
    <main className="space-y-6 lg:col-span-7">
      <SectionWithAnimation id="experience" title="경력">
        {filteredExperiences.map((experience) => (
          <ExperienceItem
            key={`${experience.company}-${experience.period}`}
            item={experience}
          />
        ))}
      </SectionWithAnimation>

      {filteredSideProjects && filteredSideProjects.length > 0 && (
        <SectionWithAnimation id="side-projects" title="사이드 프로젝트">
          {filteredSideProjects.map((project) => (
            <SideProjectItem
              key={`${project.title}-${project.period}`}
              item={project}
            />
          ))}
        </SectionWithAnimation>
      )}

      <SectionWithAnimation id="education" title="교육">
        {filteredEducation.map((education) => (
          <EducationItem
            key={`${education.school}-${education.period}`}
            item={education}
          />
        ))}
      </SectionWithAnimation>

      <SectionWithAnimation id="activities" title="대내외 활동">
        {filteredActivities.map((activity) => (
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
