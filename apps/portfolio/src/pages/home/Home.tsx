import { SEO } from "@srf/ui";
import type { ProjectIndex } from "../../entities/project";
import { usePortfolioIndex } from "../../entities/project";
import { LoadingSpinner } from "../../components/common";
import { SectionHeader } from "./components/SectionHeader";
import { Hero, SelectedProjects, Experience } from "./components";

export default function Home() {
  const portfolioIndex = usePortfolioIndex();
  const isLoading = !portfolioIndex;
  const topProjects = selectTopProjects(portfolioIndex);

  if (isLoading) {
    return (
      <>
        <SEO
          title="Frontend Developer 프로젝트 모음"
          description="TradingView 차트 주문 시스템, AI 캐릭터 텍스트 파싱, WebSocket Fallback 시스템 등 다양한 프론트엔드 프로젝트를 확인하세요."
          keywords="포트폴리오, 프론트엔드 개발자, React, TypeScript, TradingView, AI, WebSocket, 프로젝트"
        />
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      <SEO
        title="Frontend Developer 프로젝트 모음"
        description="TradingView 차트 주문 시스템, AI 캐릭터 텍스트 파싱, WebSocket Fallback 시스템 등 다양한 프론트엔드 프로젝트를 확인하세요."
        keywords="포트폴리오, 프론트엔드 개발자, React, TypeScript, TradingView, AI, WebSocket, 프로젝트"
      />

      <div className="space-y-8">
        <Hero />
        <SelectedProjects projects={topProjects} />
        <ExperienceSection />
      </div>
    </>
  );
}

function selectTopProjects(portfolioIndex?: ProjectIndex) {
  if (!portfolioIndex) return [];

  const banners = portfolioIndex.all
    .filter((project) => project.banner)
    .slice(0, 6);
  if (banners.length) {
    return banners;
  }
  return portfolioIndex.all.slice(0, 6);
}

function ExperienceSection() {
  return (
    <section className="space-y-3">
      <SectionHeader title="Experience" />
      <Experience />
    </section>
  );
}
