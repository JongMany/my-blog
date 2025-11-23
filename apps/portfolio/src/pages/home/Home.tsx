import { SEO } from "@srf/ui";
import { usePortfolioIndex } from "../../entities/project";
import { LoadingSpinner } from "../../components/common";
import { SectionHeader } from "./components/SectionHeader";
import { Hero, SelectedProjects, Experience } from "./components";

export default function Home() {
  const { data: portfolioIndex, isLoading } = usePortfolioIndex();
  const bannerProjects =
    portfolioIndex?.all.filter((project) => project.banner).slice(0, 6) ?? [];
  const fallbackProjects = portfolioIndex?.all.slice(0, 6) ?? [];
  const topProjects =
    bannerProjects.length > 0 ? bannerProjects : fallbackProjects;

  return (
    <>
      <SEO
        title="Frontend Developer 프로젝트 모음"
        description="TradingView 차트 주문 시스템, AI 캐릭터 텍스트 파싱, WebSocket Fallback 시스템 등 다양한 프론트엔드 프로젝트를 확인하세요."
        keywords="포트폴리오, 프론트엔드 개발자, React, TypeScript, TradingView, AI, WebSocket, 프로젝트"
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-8">
          <Hero />
          <SelectedProjects projects={topProjects} />

          <section className="space-y-3">
            <SectionHeader title="Experience" />
            <Experience />
          </section>
        </div>
      )}
    </>
  );
}
