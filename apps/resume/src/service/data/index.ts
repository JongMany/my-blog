import type { ResumeData } from "../types";
import { profile } from "./profile";
import { experiences } from "./experiences";
import { sideProjects } from "./side-projects";
import { education } from "./education";
import { activities } from "./activities";
import { skills } from "./skills";

export const resume: ResumeData = {
  profile,
  experiences,
  sideProjects,
  education,
  activities,
  skills,
};
