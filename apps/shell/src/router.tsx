import * as React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

import Layout from "./components/Layout";
import Hero from "./components/Hero";
import FeatureGrid from "./components/FeatureGrid";
import StatsStrip from "./components/StatsStrip";
import BootRedirect from "./components/BootRedirect";
import { withBoundary } from "./components/withBoundary";
import { lazyRemote } from "./mfe/lazyRemote";
import "./App.css";

const RAW_BASE = import.meta.env.BASE_URL || "/";
const BASENAME = RAW_BASE.endsWith("/") ? RAW_BASE.slice(0, -1) : RAW_BASE;

// ⬇️ 리모트: Routes-조각 export를 lazy load (기존과 동일)
const BlogApp = withBoundary(
  lazyRemote(() => import("blog/BlogApp"), { retries: 6, baseDelay: 500 }),
  { remoteOrigin: "http://localhost:3001" }
);
const PortfolioApp = withBoundary(
  lazyRemote(() => import("portfolio/App"), { retries: 6, baseDelay: 500 }),
  { remoteOrigin: "http://localhost:3002" }
);
const ResumeApp = withBoundary(
  lazyRemote(() => import("resume/App"), { retries: 6, baseDelay: 500 }),
  { remoteOrigin: "http://localhost:3003" }
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
  { basename: BASENAME }
);
