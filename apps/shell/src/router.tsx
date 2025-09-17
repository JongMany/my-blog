import * as React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

import Layout from "./components/Layout";
import Hero from "./components/Hero";
import FeatureGrid from "./components/FeatureGrid";
import StatsStrip from "./components/StatsStrip";
import BootRedirect from "./components/BootRedirect";
import { SEO } from "@srf/ui";
import { withBoundary } from "./components/withBoundary";
import { lazyRemote } from "./mfe/lazyRemote";
import "./App.css";

const RAW_BASE = import.meta.env.BASE_URL || "/";
const BASENAME = RAW_BASE.endsWith("/") ? RAW_BASE.slice(0, -1) : RAW_BASE;

// ⬇️ 리모트: Routes-조각 export를 lazy load (기존과 동일)
const BlogApp = withBoundary(
  lazyRemote(() => import("blog/BlogApp"), { retries: 6, baseDelay: 500 }),
  {
    remoteOrigin: "http://localhost:3001",
    appName: "블로그",
  },
);
const PortfolioApp = withBoundary(
  lazyRemote(() => import("portfolio/App"), { retries: 6, baseDelay: 500 }),
  {
    remoteOrigin: "http://localhost:3002",
    appName: "포트폴리오",
  },
);
const ResumeApp = withBoundary(
  lazyRemote(() => import("resume/App"), { retries: 6, baseDelay: 500 }),
  {
    remoteOrigin: "http://localhost:3003",
    appName: "이력서",
  },
);

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <Layout>
          <BootRedirect />
          <Outlet /> {/* ← 자식 라우트가 여기서 렌더링됩니다 */}
        </Layout>
      ),
      children: [
        {
          index: true,
          element: (
            <>
            <SEO
              title="Frontend Developer | 포트폴리오 & 블로그"
              description="사용자 경험을 최우선으로 생각하는 Frontend Developer 이종민입니다. 암호화폐 거래소와 AI 채팅 플랫폼에서 핵심 기능을 개발한 경험을 공유합니다."
              keywords="프론트엔드 개발자, React, TypeScript, 포트폴리오, 블로그, 이종민, Frontend Developer"
            />
              <Hero />
              <FeatureGrid />
              <StatsStrip />
            </>
          ),
        },
        // ⬇️ lazy() 삭제, element로 직접 마운트
        { path: "blog/*", element: <BlogApp /> },
        { path: "portfolio/*", element: <PortfolioApp /> },
        { path: "resume/*", element: <ResumeApp /> },
      ],
    },
  ],
  { basename: BASENAME },
);
