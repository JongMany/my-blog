import { SEO, cn } from "@srf/ui";

import { ScrollProgress } from "../../components/layout";
import { useViewport } from "../../contexts/viewport-context";
import "../../styles/print.css";

import { TOC_ITEMS } from "./constants";
import {
  ResumeContextProvider,
  useResumeContext,
} from "./contexts/resume-context-provider";
import ProfileHeader from "./components/header";
import Sidebar from "./components/sidebar";
import MainContent from "./components/main-content";
import NavigationPanel from "./components/navigation/panel";
import TopTabs from "./components/navigation/tabs";

function ResumePage() {
  const {
    resumeContent: {
      profile,
      experiences,
      sideProjects,
      education,
      activities,
      skills,
    },
  } = useResumeContext();

  const { isLargeDesktop } = useViewport();

  return (
    <>
      <SEO
        title="Frontend Developer 경력 및 스킬"
        description="암호화폐 거래소와 AI 채팅 플랫폼에서의 개발 경험을 가진 프론트엔드 개발자입니다."
        keywords="이력서, 프론트엔드 개발자, React, TypeScript, TradingView, 경력, 스킬, 채용"
      />
      <div className="space-y-6">
        <ScrollProgress />
        <TopTabs items={TOC_ITEMS} />

        <div className="mx-auto max-w-screen-xl px-3 sm:px-4">
          <ProfileHeader profile={profile} />

          <div
            className={cn(
              "grid gap-4",
              isLargeDesktop ? "lg:grid-cols-12" : "grid-cols-1",
            )}
          >
            <Sidebar
              contact={{
                email: profile.email,
                github: profile.github,
                blog: profile.blog,
                portfolio: profile.portfolio,
              }}
              skills={skills}
              className="mt-4"
            />
            <MainContent
              experiences={experiences}
              sideProjects={sideProjects}
              education={education}
              activities={activities}
              skills={skills}
            />
            <NavigationPanel className="mt-4" />
          </div>
        </div>
      </div>
    </>
  );
}

export default () => {
  return (
    <ResumeContextProvider>
      <ResumePage />
    </ResumeContextProvider>
  );
};
