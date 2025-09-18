import { resume } from "../service/resume";
import ResumeHeader from "../components/ResumeHeader";
import Section from "../components/Section";
import ExperienceItem from "../components/ExperienceItem";
import EducationItem from "../components/EducationItem";
import ActivityItem from "../components/ActivityItem";
import PageTOC from "../components/PageTOC";
import TopTabs from "../components/Tabs";
import ScrollProgress from "../components/ScrollProgress";
import { motion } from "framer-motion";
import { stagger } from "../components/Motion";
import { Card } from "../components/ui";
import "../styles/print.css";
import SkillsCompact from "../components/SkillsCompact";
import Contact from "../components/Contact";
import { useResume } from "../contexts/ResumeContext";
import {
  filterExperienceForCompact,
  filterEducationForCompact,
  filterActivityForCompact,
  filterSkillsForCompact,
} from "../utils/resumeFilter";

export default function ResumePage() {
  const { profile, experiences, education, activities, skills } = resume;
  const { isDetailed } = useResume();

  // 토글 상태에 따라 데이터 필터링
  const filteredExperiences = isDetailed
    ? experiences
    : experiences.map(filterExperienceForCompact);

  const filteredEducation = isDetailed
    ? education
    : education.map(filterEducationForCompact);

  const filteredActivities = isDetailed
    ? activities
    : activities.map(filterActivityForCompact);

  const filteredSkills = isDetailed
    ? skills
    : filterSkillsForCompact(skills || []);

  const toc = [
    { id: "experience", label: "경력" },
    { id: "education", label: "교육" },
    { id: "activities", label: "대내외 활동" },
  ];

  return (
    <div className="space-y-6">
      <ScrollProgress />
      <TopTabs items={toc} />

      <div className="mx-auto max-w-screen-xl px-4">
        <ResumeHeader profile={profile} />

        <div className="grid gap-4 lg:grid-cols-12">
          {/* 왼쪽 요약(스티키) */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-4">
              <Contact profile={profile} />
              {filteredSkills?.length ? (
                <Card className="p-4">
                  <div className="mb-2 font-medium">Skills</div>
                  <SkillsCompact items={filteredSkills} />
                </Card>
              ) : null}
            </div>
          </aside>

          {/* 본문 */}
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

          {/* 오른쪽 TOC(스티키) */}
          <aside className="lg:block lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <PageTOC items={toc} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
