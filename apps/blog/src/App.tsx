import { useAppStore } from "@mfe/shared";
import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { Link, Route, Routes } from "react-router-dom";

import BlogHome from "./pages/home/BlogHome";
import BlogLayout from "./components/Layout";
import PostPage from "./pages/posts/PostsPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import CategoryPage from "./pages/category/CategoryPage";
import PostDetail from "./pages/detail/PostDetail";
import WritePage from "./pages/write/WritePage";
import ListAll from "./pages/list/ListAll";

export default function BlogApp() {
  return (
    <Routes>
      <Route
        index
        element={
          <BlogLayout>
            <BlogHome />
          </BlogLayout>
        }
      />
      <Route
        path="/:category/:slug"
        element={
          <BlogLayout>
            <PostPage />
          </BlogLayout>
        }
      />
      <Route
        path="categories"
        element={
          <BlogLayout>
            <CategoriesPage />
          </BlogLayout>
        }
      />
      <Route
        path="categories/:slug"
        element={
          <BlogLayout>
            <CategoryPage />
          </BlogLayout>
        }
      />
      <Route
        path="post/:id"
        element={
          <BlogLayout>
            <PostDetail />
          </BlogLayout>
        }
      />
      <Route
        path="write"
        element={
          <BlogLayout>
            <WritePage />
          </BlogLayout>
        }
      />
      <Route
        path="all"
        element={
          <BlogLayout>
            <ListAll />
          </BlogLayout>
        }
      />
    </Routes>
  );
}
