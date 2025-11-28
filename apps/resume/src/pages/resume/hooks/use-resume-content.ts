import { resume } from "@/service";
import {
  filterExperienceForCompact,
  filterSideProjectForCompact,
  filterEducationForCompact,
  filterActivityForCompact,
  filterSkillsForCompact,
} from "@/utils/resume-filter";

export function useResumeContent(isDetailed: boolean) {
  const { profile, experiences, sideProjects, education, activities, skills } =
    resume;

  return {
    profile,
    experiences: isDetailed
      ? experiences
      : experiences.map(filterExperienceForCompact),
    sideProjects: isDetailed ? sideProjects : [],
    education: isDetailed
      ? education
      : education.map(filterEducationForCompact),
    activities: isDetailed
      ? activities
      : activities.map(filterActivityForCompact),
    skills: isDetailed ? skills : filterSkillsForCompact(skills || []),
  };
}
