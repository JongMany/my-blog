import "./App.css";
import { Route, Routes } from "react-router-dom";
import { SEO } from "@srf/ui";

import BlogLayout from "./components/layout";
import PostDetailPage from "./pages/post/post-detail-page";
import BookDetailPage from "./pages/books/book-detail-page";
import BooksPage from "./pages/books/books-page";
import PostsPage from "./pages/post/posts-page";
import RetrospectsPage from "./pages/retrospect/retrospects-page";
import RetrospectDetailPage from "./pages/retrospect/retrosepct-detail-page";
import LogsPage from "./pages/logs/logs-page";
import LogDetailPage from "./pages/logs/log-detail-page";
import HomePage from "./pages/home/home-page";
import { Suspense } from "react";

export default function BlogApp() {
  return (
    <>
      <SEO
        title="이종민 블로그"
        description="프론트엔드 개발 경험, React, TypeScript, TradingView 개발 노하우, AI 채팅 플랫폼 개발 과정을 공유합니다."
        keywords="기술 블로그, 프론트엔드 개발자, React, TypeScript, TradingView, AI, 개발 노하우"
      />
      <Routes>
        <Route path="/" element={<BlogLayout />}>
          <Route index element={<HomePage />} />

          <Route path="books">
            <Route index element={<BooksPage />} />
            <Route
              path=":slug"
              element={
                <Suspense fallback={<div>Loading...</div>}>
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
                <Suspense fallback={<div>Loading...</div>}>
                  <PostDetailPage />
                </Suspense>
              }
            />
          </Route>
          <Route path="retrospect">
            <Route index element={<RetrospectsPage />} />
            <Route path=":slug" element={<RetrospectDetailPage />} />
          </Route>
          <Route path="logs">
            <Route index element={<LogsPage />} />
            <Route path=":slug" element={<LogDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
