import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import FeatureGrid from "./components/FeatureGrid";
import StatsStrip from "./components/StatsStrip";
import { lazyRemote } from "./mfe/lazyRemote";
import { withBoundary } from "./components/withBoundary";
import BootRedirect from "./components/BootRedirect";

export const BlogApp = withBoundary(
  lazyRemote(
    () => import("blog/BlogApp"), // ← federation remote
    { retries: 6, baseDelay: 500, factor: 1.7 } // ← 취향대로
  ),
  { remoteOrigin: "http://localhost:3001" }
);
export const PortfolioApp = withBoundary(
  lazyRemote(
    () => import("portfolio/App"), // ← federation remote
    { retries: 6, baseDelay: 500, factor: 1.7 } // ← 취향대로
  ),
  { remoteOrigin: "http://localhost:3002" }
);
export const ResumeApp = withBoundary(
  lazyRemote(
    () => import("resume/App"), // ← federation remote
    { retries: 6, baseDelay: 500, factor: 1.7 } // ← 취향대로
  ),
  { remoteOrigin: "http://localhost:3003" }
);

export default function App() {
  return (
    <Layout>
      <React.Suspense fallback={<p>Loading...</p>}>
        <BootRedirect />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <FeatureGrid />
                <StatsStrip />
              </>
            }
          />
          <Route path="/blog/*" element={<BlogApp />} />
          <Route path="/portfolio/*" element={<PortfolioApp />} />
          <Route path="/resume/*" element={<ResumeApp />} />
        </Routes>
      </React.Suspense>
    </Layout>
  );
}
