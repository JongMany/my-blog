import * as React from "react";
import type { RouteObject } from "react-router-dom";

import BlogLayout from "./components/Layout";
import BlogHome from "./pages/home/BlogHome";
import PostsPage from "./pages/posts/PostsPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import CategoryPage from "./pages/category/CategoryPage";
import PostDetail from "./pages/detail/PostDetail";
import WritePage from "./pages/write/WritePage";
import ListAll from "./pages/list/ListAll";

// 필요 시 loader/action/errorElement도 추가 가능
export const routes: RouteObject = {
  element: <BlogLayout />,
  children: [
    { index: true, element: <BlogHome /> },
    { path: "posts", element: <PostsPage /> },
    { path: "all", element: <ListAll /> },
    { path: "categories", element: <CategoriesPage /> },
    { path: "categories/:slug", element: <CategoryPage /> },
    { path: "post/:id", element: <PostDetail /> },
    { path: "write", element: <WritePage /> },
  ],
};

export default routes;
