import "./App.css";
import { Navigate, Route, Routes, Link } from "react-router-dom";
import { SEO, WebsiteJsonLd, PersonJsonLd, NotFoundSection } from "@srf/ui";
import { imageSource } from "@mfe/shared";

import BlogLayout from "./components/layout";
import PostDetailPage from "./pages/post/post-detail-page";
import BookDetailPage from "./pages/books/book-detail-page";
import BooksPage from "./pages/books/books-page";
import PostsPage from "./pages/post/posts-page";
import RetrospectsPage from "./pages/retrospect/retrospects-page";
import RetrospectDetailPage from "./pages/retrospect/retrosepct-detail-page";
import LogsPage from "./pages/logs/logs-page";
import LogDetailPage from "./pages/logs/log-detail-page";
import EconomyPage from "./pages/economy/economy-page";
import EconomyDetailPage from "./pages/economy/economy-detail-page";
import { Suspense } from "react";

export default function BlogApp() {
  return (
    <>
      <SEO
        title="이종민 블로그"
        description="프론트엔드 개발 경험, React, TypeScript, TradingView 개발 노하우, AI 채팅 플랫폼 개발 과정을 공유합니다."
        keywords="기술 블로그, 프론트엔드 개발자, React, TypeScript, TradingView, AI, 개발 노하우"
        siteName="이종민 블로그"
        url="https://jongmany.github.io/my-blog/blog/"
      />
      {/* 웹사이트 구조화된 데이터 */}
      <WebsiteJsonLd
        name="이종민 블로그"
        description="프론트엔드 개발 경험, React, TypeScript, TradingView 개발 노하우, AI 채팅 플랫폼 개발 과정을 공유합니다."
        url="https://jongmany.github.io/my-blog/blog/"
      />
      {/* 저자 구조화된 데이터 */}
      <PersonJsonLd />
      <Routes>
        <Route path="/" element={<BlogLayout />}>
          <Route index element={<Navigate to="/blog/posts" replace />} />

          <Route path="books">
            <Route index element={<BooksPage />} />
            <Route
              path=":slug"
              element={
                <Suspense fallback={<></>}>
                  <BookDetailPage />
                </Suspense>
              }
            />
          </Route>
          <Route path="posts">
            <Route index element={<PostsPage />} />
            <Route
              path=":slug"
              element={
                <Suspense fallback={<></>}>
                  <PostDetailPage />
                </Suspense>
              }
            />
          </Route>
          <Route path="retrospect">
            <Route index element={<RetrospectsPage />} />
            <Route
              path=":slug"
              element={
                <Suspense fallback={<></>}>
                  <RetrospectDetailPage />
                </Suspense>
              }
            />
          </Route>
          <Route path="logs">
            <Route index element={<LogsPage />} />
            <Route
              path=":slug"
              element={
                <Suspense fallback={<></>}>
                  <LogDetailPage />
                </Suspense>
              }
            />
          </Route>
          <Route path="economy">
            <Route index element={<EconomyPage />} />
            <Route
              path=":slug"
              element={
                <Suspense fallback={<></>}>
                  <EconomyDetailPage />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="*"
            element={
              <NotFoundSection
                illustrationSrc={imageSource("/404.svg", "blog", {
                  isDevelopment: import.meta.env.MODE === "development",
                })}
                renderLink={() => (
                  <Link
                    to="/blog/posts"
                    className="inline-block mt-4 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    블로그로 돌아가기
                  </Link>
                )}
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
}
