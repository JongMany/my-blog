import { SEO } from "@srf/ui";
import { usePortfolioIndex, selectTopProjects } from "@/entities/project";
import { LoadingSpinner } from "@/components/common";
import { HeroSection, SelectedProjects, ExperienceSection } from "./components";

const SEO_PROPS = {
  title: "Frontend Developer 프로젝트 모음",
  description:
    "TradingView 차트 주문 시스템, AI 캐릭터 텍스트 파싱, WebSocket Fallback 시스템 등 다양한 프론트엔드 프로젝트를 확인하세요.",
  keywords:
    "포트폴리오, 프론트엔드 개발자, React, TypeScript, TradingView, AI, WebSocket, 프로젝트",
} as const;

export default function Home() {
  const portfolioIndex = usePortfolioIndex();
  const isLoading = !portfolioIndex;
  const topProjects = selectTopProjects(portfolioIndex);

  return (
    <>
      <SEO {...SEO_PROPS} />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-8">
          <HeroSection />
          <SelectedProjects projects={topProjects} />
          <ExperienceSection />
        </div>
      )}
    </>
  );
}
