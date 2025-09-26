import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { SEO } from "@srf/ui";

import { BlogLayout } from "./components/layout";
import PostPage from "./pages/posts/PostsPage";

import ListAll from "./pages/list/ListAll";
import ListByCategory from "./pages/category/ListByCategory";

export default function BlogApp() {
  return (
    <>
      <SEO
        title="Frontend Developer 기술 블로그"
        description="프론트엔드 개발 경험, React, TypeScript, TradingView 개발 노하우, AI 채팅 플랫폼 개발 과정을 공유합니다."
        keywords="기술 블로그, 프론트엔드 개발자, React, TypeScript, TradingView, AI, 개발 노하우"
      />
      <Routes>
        <Route path="/" element={<BlogLayout />}>
          {/* /blog  → 전체 목록 */}
          <Route index element={<ListAll />} />

          {/* /blog/c/:category → 카테고리 목록 */}
          <Route path="c/:category" element={<ListByCategory />} />

          {/* /blog/:category/:slug → 글 상세(MDX) */}
          <Route path=":category/:slug" element={<PostPage />} />

          {/* 예전 경로 호환: /blog/all → /blog */}
          <Route path="all" element={<Navigate to="." replace />} />
        </Route>
      </Routes>
    </>
  );
}
