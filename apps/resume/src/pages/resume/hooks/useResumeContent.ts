import { useResumeContext } from "../contexts/resume-context-provider";
import { resume } from "../../../service";
import type {
  ResumeData,
  Experience,
  SideProject,
  Education,
  Activity,
} from "../../../service";
import {
  filterExperienceForCompact,
  filterSideProjectForCompact,
  filterEducationForCompact,
  filterActivityForCompact,
  filterSkillsForCompact,
} from "../../../utils/resume-filter";

interface UseResumeContentReturn {
  profile: ResumeData["profile"];
  experiences: Experience[];
  sideProjects?: SideProject[];
  education: Education[];
  activities: Activity[];
  skills?: string[];
}

export function useResumeContent(): UseResumeContentReturn {
  const { isDetailed } = useResumeContext();
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
