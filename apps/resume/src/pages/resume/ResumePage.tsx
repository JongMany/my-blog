import React from "react";
import { Tabs as TopTabs, ScrollProgress } from "../../components/layout";
import {
  ResumeHeader,
  ResumeSidebar,
  ResumeMain,
  ResumeTOC,
} from "./components";
import { useResumeData } from "./hooks/useResumeData";
import { TOC_ITEMS } from "./constants/toc";
import "../../styles/print.css";

export default function ResumePage() {
  const {
    profile,
    filteredExperiences,
    filteredSideProjects,
    filteredEducation,
    filteredActivities,
    filteredSkills,
  } = useResumeData();

  return (
    <div className="space-y-6">
      <ScrollProgress />
      <TopTabs items={TOC_ITEMS} />

      <div className="mx-auto max-w-screen-xl px-3 sm:px-4">
        <ResumeHeader profile={profile} />

        <div className="grid gap-4 lg:grid-cols-12">
          <ResumeSidebar profile={profile} filteredSkills={filteredSkills} />
          <ResumeMain
            filteredExperiences={filteredExperiences}
            filteredSideProjects={filteredSideProjects}
            filteredEducation={filteredEducation}
            filteredActivities={filteredActivities}
          />
          <ResumeTOC />
        </div>
      </div>
    </div>
  );
}
