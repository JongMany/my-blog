import { useResume } from "../contexts/ResumeContext";
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
} from "../../../utils/resumeFilter";

interface UseResumeContentReturn {
  profile: ResumeData["profile"];
  experiences: Experience[];
  sideProjects?: SideProject[];
  education: Education[];
  activities: Activity[];
  skills?: string[];
}

export function useResumeContent(): UseResumeContentReturn {
  const { isDetailed } = useResume();
  const { profile, experiences, sideProjects, education, activities, skills } =
    resume;

  // 토글 상태에 따라 데이터 필터링
  const processedExperiences = isDetailed
    ? experiences
    : experiences.map(filterExperienceForCompact);

  const processedSideProjects = isDetailed
    ? sideProjects
    : sideProjects?.map(filterSideProjectForCompact);

  const processedEducation = isDetailed
    ? education
    : education.map(filterEducationForCompact);

  const processedActivities = isDetailed
    ? activities
    : activities.map(filterActivityForCompact);

  const processedSkills = isDetailed
    ? skills
    : filterSkillsForCompact(skills || []);

  return {
    profile,
    experiences: processedExperiences,
    sideProjects: processedSideProjects,
    education: processedEducation,
    activities: processedActivities,
    skills: processedSkills,
  };
}
