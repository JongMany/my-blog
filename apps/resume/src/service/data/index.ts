import type { ResumeData } from "@/service/types";
import { profile } from "@/service/data/profile";
import { experiences } from "@/service/data/experiences";
import { sideProjects } from "@/service/data/side-projects";
import { education } from "@/service/data/education";
import { activities } from "@/service/data/activities";
import { skills } from "@/service/data/skills";

export const resume: ResumeData = {
  profile,
  experiences,
  sideProjects,
  education,
  activities,
  skills,
};
