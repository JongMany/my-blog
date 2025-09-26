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
import { ResumeProvider } from "./contexts/ResumeContext";
import { SEO } from "@srf/ui";

function ResumePage() {
  const {
    profile,
    filteredExperiences,
    filteredSideProjects,
    filteredEducation,
    filteredActivities,
    filteredSkills,
  } = useResumeData();

  return (
    <>
      <SEO
        title="Frontend Developer 경력 및 스킬"
        description="암호화폐 거래소와 AI 채팅 플랫폼에서의 개발 경험, React, TypeScript, TradingView 등 기술 스택을 확인하세요."
        keywords="이력서, 프론트엔드 개발자, React, TypeScript, TradingView, 경력, 스킬, 채용"
      />
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
    </>
  );
}

export default () => {
  return (
    <ResumeProvider>
      <ResumePage />
    </ResumeProvider>
  );
};
