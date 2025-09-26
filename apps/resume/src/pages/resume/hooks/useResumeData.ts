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

interface UseResumeDataReturn {
  profile: ResumeData["profile"];
  filteredExperiences: Experience[];
  filteredSideProjects?: SideProject[];
  filteredEducation: Education[];
  filteredActivities: Activity[];
  filteredSkills?: string[];
}

export function useResumeData(): UseResumeDataReturn {
  const { isDetailed } = useResume();
  const { profile, experiences, sideProjects, education, activities, skills } =
    resume;

  // 토글 상태에 따라 데이터 필터링
  const filteredExperiences = isDetailed
    ? experiences
    : experiences.map(filterExperienceForCompact);

  const filteredSideProjects = isDetailed
    ? sideProjects
    : sideProjects?.map(filterSideProjectForCompact);

  const filteredEducation = isDetailed
    ? education
    : education.map(filterEducationForCompact);

  const filteredActivities = isDetailed
    ? activities
    : activities.map(filterActivityForCompact);

  const filteredSkills = isDetailed
    ? skills
    : filterSkillsForCompact(skills || []);

  return {
    profile,
    filteredExperiences,
    filteredSideProjects,
    filteredEducation,
    filteredActivities,
    filteredSkills,
  };
}
