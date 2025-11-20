import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { SEO } from "@srf/ui";

import BlogLayout from "./components/layout";
import { PostDetailPage } from "./pages/post";
import { HomePage } from "./pages/home";
import BookDetailPage from "./pages/books/book-detail-page";
import BooksPage from "./pages/books/books-page";

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
          {/* /blog  → 전체 목록 */}
          <Route index element={<HomePage />} />

          {/* /blog/c/:category → 카테고리 목록 */}
          {/* <Route path="c/:category" element={<CategoryPage />} /> */}
          <Route path="books">
            <Route index element={<BooksPage />} />
            <Route path=":slug" element={<BookDetailPage />} />
          </Route>
          {/* /blog/:category/:slug → 글 상세(MDX) */}
          <Route path=":category/:slug" element={<PostDetailPage />} />

          {/* 예전 경로 호환: /blog/all → /blog */}
          <Route path="all" element={<Navigate to="." replace />} />
        </Route>
      </Routes>
    </>
  );
}
