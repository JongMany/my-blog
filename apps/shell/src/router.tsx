import * as React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

import Layout from "./components/root-layout";
import BootRedirect from "./components/boot-redirect";
import NotFoundPage from "./components/not-found-page";
import { withBoundary } from "./components/with-boundary";
import { lazyRemote } from "./mfe/lazy-remote";
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
const HomeApp = withBoundary(
  lazyRemote(() => import("home/App"), { retries: 6, baseDelay: 500 }),
  {
    remoteOrigin: "http://localhost:3004",
    appName: "홈",
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
          element: <HomeApp />,
        },
        // ⬇️ lazy() 삭제, element로 직접 마운트
        { path: "blog/*", element: <BlogApp /> },
        { path: "portfolio/*", element: <PortfolioApp /> },
        { path: "resume/*", element: <ResumeApp /> },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ],
  { basename: BASENAME },
);
