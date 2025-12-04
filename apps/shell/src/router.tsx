import * as React from "react";
import { createBrowserRouter, Outlet, Link } from "react-router-dom";
import { NotFoundSection } from "@srf/ui";
import { imageSource } from "@mfe/shared";

import Layout from "./components/root-layout";
import BootRedirect from "./components/boot-redirect";
import { withBoundary } from "./components/with-boundary";
import { lazyRemote } from "./mfe/lazy-remote";
import "./App.css";
import "./index.css"; // prefix 없는 Tailwind (UI 패키지용)

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
        {
          path: "*",
          element: (
            <NotFoundSection
              illustrationSrc={imageSource("/404.svg", "home", {
                isDevelopment: import.meta.env.MODE === "development",
              })}
              renderLink={() => (
                <Link
                  to="/"
                  className="inline-block mt-4 px-4 py-2 rounded-full bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  홈으로 돌아가기
                </Link>
              )}
            />
          ),
        },
      ],
    },
  ],
  { basename: BASENAME },
);
