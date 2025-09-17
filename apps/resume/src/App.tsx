import { Routes, Route } from "react-router-dom";
import { SEO } from "@srf/ui";
import "./App.css";
import ResumePage from "./pages/ResumePage";

export default function ResumeApp() {
  return (
    <>
      <SEO
        title="Frontend Developer 경력 및 스킬"
        description="암호화폐 거래소와 AI 채팅 플랫폼에서의 개발 경험, React, TypeScript, TradingView 등 기술 스택을 확인하세요."
        keywords="이력서, 프론트엔드 개발자, React, TypeScript, TradingView, 경력, 스킬, 채용"
      />
      <Routes>
        <Route index element={<ResumePage />} />
      </Routes>
    </>
  );
}
