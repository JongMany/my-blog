import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

import BlogLayout from "./components/Layout";
import PostPage from "./pages/posts/PostsPage";

import ListAll from "./pages/list/ListAll";
import ListByCategory from "./pages/category/ListByCategory";

export default function BlogApp() {
  return (
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
  );
}
