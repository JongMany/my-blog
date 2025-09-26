import React from "react";
import { motion } from "framer-motion";
import { stagger } from "../../../constants";
import { Section } from "../../../components/layout";
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
      <Section id="experience" title="경력">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-3"
        >
          {filteredExperiences.map((e, i) => (
            <ExperienceItem key={i} item={e} />
          ))}
        </motion.div>
      </Section>

      {filteredSideProjects && filteredSideProjects.length > 0 && (
        <Section id="side-projects" title="사이드 프로젝트">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid gap-3"
          >
            {filteredSideProjects.map((project, i) => (
              <SideProjectItem key={i} item={project} />
            ))}
          </motion.div>
        </Section>
      )}

      <Section id="education" title="교육">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-3"
        >
          {filteredEducation.map((e, i) => (
            <EducationItem key={i} item={e} />
          ))}
        </motion.div>
      </Section>

      <Section id="activities" title="대내외 활동">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-3"
        >
          {filteredActivities.map((a, i) => (
            <ActivityItem key={i} item={a} />
          ))}
        </motion.div>
      </Section>

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
